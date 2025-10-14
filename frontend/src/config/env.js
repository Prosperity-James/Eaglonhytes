/**
 * Environment Configuration
 * Centralizes all environment-dependent URLs and settings
 */

// Get API URL from environment variable or use default
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/Eaglonhytes/api';

// Get environment
export const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';
export const IS_PRODUCTION = APP_ENV === 'production';

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  login: `${API_URL}/login.php`,
  register: `${API_URL}/register.php`,
  logout: `${API_URL}/logout.php`,
  session: `${API_URL}/session.php`,
  
  // Lands
  lands: `${API_URL}/lands.php`,
  
  // Applications
  applications: `${API_URL}/land_applications.php`,
  
  // Users
  users: `${API_URL}/users.php`,
  
  // Profile
  profile: `${API_URL}/profile.php`,
  
  // Contact
  contact: `${API_URL}/contact.php`,
  
  // Notifications
  notifications: `${API_URL}/notifications.php`,
  
  // Upload
  upload: `${API_URL}/upload_image.php`,
  
  // Settings
  settings: `${API_URL}/settings.php`,
};

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_URL}/${endpoint}`;
};

// Helper to get upload URL
export const getUploadUrl = (path) => {
  if (!path) return null;
  
  // If already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Build full URL
  return `${API_URL}/${cleanPath}`;
};

export default {
  API_URL,
  APP_ENV,
  IS_PRODUCTION,
  API_ENDPOINTS,
  buildApiUrl,
  getUploadUrl,
};
