import { api, endpoints } from './api.js';

// Image upload configuration
const UPLOAD_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
};

// Validate file before upload
export const validateImageFile = (file) => {
  const errors = [];

  if (!file) {
    errors.push('No file selected');
    return errors;
  }

  // Check file size
  if (file.size > UPLOAD_CONFIG.maxSize) {
    errors.push(`File size must be less than ${UPLOAD_CONFIG.maxSize / (1024 * 1024)}MB`);
  }

  // Check file type
  if (!UPLOAD_CONFIG.allowedTypes.includes(file.type)) {
    errors.push(`File type not allowed. Supported types: ${UPLOAD_CONFIG.allowedExtensions.join(', ')}`);
  }

  // Check file extension as backup
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension && !UPLOAD_CONFIG.allowedExtensions.includes(extension)) {
    errors.push(`File extension not allowed. Supported extensions: ${UPLOAD_CONFIG.allowedExtensions.join(', ')}`);
  }

  return errors;
};

// Upload a single image file
export const uploadImage = async (file, type = 'general') => {
  // Validate file first
  const validationErrors = validateImageFile(file);
  if (validationErrors.length > 0) {
    throw new Error(validationErrors.join(', '));
  }

  // Create form data
  const formData = new FormData();
  formData.append('image', file);
  formData.append('type', type);

  try {
    // Use the API client's postForm method for FormData
    const response = await api.postForm(`${endpoints.upload}?type=${type}`, formData);

    // Helpful debug log for developers
    // eslint-disable-next-line no-console
    console.debug('[uploadImage] server response:', response);

    if (!response || !response.success) {
      const message = response?.message || 'Upload failed - unknown server error';
      throw new Error(message);
    }

    return {
      success: true,
      filename: response.filename,
      relativePath: response.relative_path,
      // Keep snake_case for callers that may expect it
      relative_path: response.relative_path,
      url: response.url,
    };
  } catch (error) {
    // If ApiError from apiFetch includes status, surface authentication issues clearly
    const errMsg = error?.message || String(error);
    if (errMsg.includes('Authentication required') || errMsg.includes('401')) {
      throw new Error('Authentication required: please log in as an admin before uploading images');
    }

    throw new Error(`Image upload failed: ${errMsg}`);
  }
};

// Upload multiple images
export const uploadMultipleImages = async (files, type = 'general') => {
  const results = [];
  const errors = [];

  for (let i = 0; i < files.length; i++) {
    try {
      const result = await uploadImage(files[i], type);
      results.push(result);
    } catch (error) {
      errors.push(`File ${i + 1}: ${error.message}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join('; '));
  }

  return results;
};

// Create image preview URL for display
export const createImagePreview = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

// Create multiple image previews
export const createImagePreviews = async (files) => {
  // Use Promise.all for parallel processing to prevent sequential delays
  const previewPromises = Array.from(files).map(async (file) => {
    try {
      const preview = await createImagePreview(file);
      return {
        file,
        preview,
        name: file.name,
        size: file.size,
      };
    } catch (error) {
      console.error('Failed to create preview for file:', file.name, error);
      return null;
    }
  });
  
  const results = await Promise.all(previewPromises);
  return results.filter(result => result !== null);
};

export default {
  uploadImage,
  uploadMultipleImages,
  validateImageFile,
  createImagePreview,
  createImagePreviews,
  UPLOAD_CONFIG,
};
