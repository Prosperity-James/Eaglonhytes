// API Configuration and Client
// Use Vite proxy in development, full backend URL in production
const API_BASE_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.DEV 
    ? '/api' 
    : 'https://eaglonhytes.infinityfreeapp.com/api'  // ✅ your real backend
);


const API_CONFIG = {
  baseURL: API_BASE_URL,
  defaultOptions: {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  },
};

// Custom error class for API errors
export class ApiError extends Error {
  constructor(message, status, response) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

// Core fetch wrapper with error handling
export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  
  // Debug logging (uncomment for debugging)
  // console.log('🌐 API Request:', { url, method: options.method || 'GET', baseURL: API_CONFIG.baseURL, endpoint });
  
  // Don't set Content-Type header for FormData - let browser handle it
  const shouldSetContentType = !(options.body instanceof FormData);
  
  const config = {
    ...API_CONFIG.defaultOptions,
    ...options,
    headers: {
      ...(shouldSetContentType ? API_CONFIG.defaultOptions.headers : {}),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Clone the response so we can read it multiple times if needed
    const responseClone = response.clone();
    
    // Try to parse JSON response
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      // If JSON parsing fails, get the raw text from the cloned response
      try {
        const text = await responseClone.text();
        console.error('🔍 JSON parsing failed. Raw response:', text.substring(0, 500));
        throw new ApiError(
          `Server returned non-JSON response: ${text.substring(0, 200)}...`,
          response.status,
          response
        );
      } catch (textError) {
        console.error('🔍 Failed to read response as text:', textError);
        throw new ApiError(
          `Failed to parse server response`,
          response.status,
          response
        );
      }
    }

    if (!response.ok) {
      throw new ApiError(
        data.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        response
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      `Network error: ${error.message}`,
      0,
      null
    );
  }
};

// Convenience methods for common HTTP verbs
export const api = {
  get: (endpoint, options = {}) => 
    apiFetch(endpoint, { ...options, method: 'GET' }),
  
  post: (endpoint, data, options = {}) =>
    apiFetch(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  put: (endpoint, data, options = {}) =>
    apiFetch(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (endpoint, options = {}) =>
    apiFetch(endpoint, { ...options, method: 'DELETE' }),

  // Special method for form data (file uploads, etc.)
  postForm: (endpoint, formData, options = {}) => {
    // Remove Content-Type from headers to let browser set it with boundary
    const { headers = {}, ...otherOptions } = options;
    const { 'Content-Type': _, ...headersWithoutContentType } = headers;
    
    return apiFetch(endpoint, {
      ...otherOptions,
      method: 'POST',
      headers: headersWithoutContentType,
      body: formData,
    });
  },
};

// Specific API endpoints
export const endpoints = {
  // Auth
  login: '/login.php',
  logout: '/logout.php',
  session: '/session.php',
  
  // Profile
  profile: '/profile.php',
  
  // Lands
  lands: '/lands.php',
  
  // Users
  users: '/users.php',
  
  // Applications
  applications: '/land_applications.php',
  
  // Upload
  upload: '/upload_image.php',
  
  // Carousel
  carousel: '/carousel.php',
};

export default api;
