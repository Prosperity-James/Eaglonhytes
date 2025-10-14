// Centralized validation utilities

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

// Phone validation - Nigerian phone number friendly
export const validatePhone = (phone) => {
  if (!phone) return null; // Phone is optional in most cases
  
  // Remove spaces, dashes, parentheses for validation
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Nigerian phone number patterns:
  // - Local: 0803xxxxxxx, 0701xxxxxxx (11 digits starting with 0)
  // - International: +2348xxxxxxxx, 2348xxxxxxxx (13-14 digits)
  // - General international: +xxx... (any country)
  const nigerianPatterns = [
    /^0[7-9][0-1]\d{8}$/,           // Nigerian local format: 0803xxxxxxx
    /^\+234[7-9][0-1]\d{8}$/,       // Nigerian international: +2348xxxxxxxx
    /^234[7-9][0-1]\d{8}$/,         // Nigerian without +: 2348xxxxxxxx
    /^\+\d{10,15}$/,                // Other international numbers
    /^\d{10,11}$/                   // General 10-11 digit numbers
  ];
  
  const isValid = nigerianPatterns.some(pattern => pattern.test(cleanPhone));
  
  if (!isValid) {
    return 'Please enter a valid phone number (e.g., 0803xxxxxxx or +2348xxxxxxxx)';
  }
  
  return null;
};

// Password validation
export const validatePassword = (password, minLength = 6) => {
  if (!password) return 'Password is required';
  if (password.length < minLength) return `Password must be at least ${minLength} characters`;
  return null;
};

// Required field validation
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};

// Number validation
export const validateNumber = (value, fieldName, min = null, max = null) => {
  if (!value) return `${fieldName} is required`;
  
  const num = parseFloat(value);
  if (isNaN(num)) return `${fieldName} must be a valid number`;
  
  if (min !== null && num < min) return `${fieldName} must be at least ${min}`;
  if (max !== null && num > max) return `${fieldName} must be at most ${max}`;
  
  return null;
};

// Integer validation
export const validateInteger = (value, fieldName, min = null, max = null) => {
  if (!value) return `${fieldName} is required`;
  
  const num = parseInt(value);
  if (isNaN(num) || !Number.isInteger(num)) return `${fieldName} must be a whole number`;
  
  if (min !== null && num < min) return `${fieldName} must be at least ${min}`;
  if (max !== null && num > max) return `${fieldName} must be at most ${max}`;
  
  return null;
};

// Land form validation
export const validateLandForm = (formData) => {
  const errors = {};
  
  // Get values from FormData
  const title = formData.get('title');
  const description = formData.get('description');
  const address = formData.get('address');
  const city = formData.get('city');
  const state = formData.get('state');
  const size = formData.get('size');
  const price = formData.get('price');

  // Validate required fields
  const titleError = validateRequired(title, 'Title');
  if (titleError) errors.title = titleError;

  const descriptionError = validateRequired(description, 'Description');
  if (descriptionError) errors.description = descriptionError;

  const addressError = validateRequired(address, 'Address');
  if (addressError) errors.address = addressError;

  const cityError = validateRequired(city, 'City');
  if (cityError) errors.city = cityError;

  const stateError = validateRequired(state, 'State');
  if (stateError) errors.state = stateError;

  // Validate required fields
  const sizeError = validateRequired(size, 'Size');
  if (sizeError) errors.size = sizeError;

  const priceError = validateNumber(price, 'Price', 0);
  if (priceError) errors.price = priceError;

  return errors;
};

// User form validation
export const validateUserForm = (formData, isEdit = false) => {
  const errors = {};
  
  const fullName = formData.get('full_name');
  const email = formData.get('email');
  const phone = formData.get('phone');
  const password = formData.get('password');

  // Validate required fields
  const nameError = validateRequired(fullName, 'Full Name');
  if (nameError) errors.full_name = nameError;

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  // Phone validation - Nigerian number friendly, optional
  const phoneError = validatePhone(phone);
  if (phoneError) errors.phone = phoneError;

  // Password validation - required for new users, optional for edits
  if (!isEdit) {
    const passwordError = validatePassword(password, 6);
    if (passwordError) errors.password = passwordError;
  } else if (password && password.trim() !== '') {
    // If password is provided during edit, validate it
    const passwordError = validatePassword(password, 6);
    if (passwordError) errors.password = passwordError;
  }

  return errors;
};

// Profile form validation
export const validateProfileForm = (formData) => {
  const errors = {};
  
  const fullName = formData.get('full_name');
  const email = formData.get('email');
  const phone = formData.get('phone');

  // Validate required fields
  const nameError = validateRequired(fullName, 'Full Name');
  if (nameError) errors.full_name = nameError;

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const phoneError = validatePhone(phone);
  if (phoneError) errors.phone = phoneError;

  return errors;
};

// Password change validation
export const validatePasswordChange = (currentPassword, newPassword, confirmPassword) => {
  const errors = {};

  const currentError = validateRequired(currentPassword, 'Current Password');
  if (currentError) errors.current_password = currentError;

  const newError = validatePassword(newPassword, 6);
  if (newError) errors.new_password = newError;

  if (newPassword !== confirmPassword) {
    errors.confirm_password = 'Passwords do not match';
  }

  return errors;
};

// Generic form validation helper
export const validateForm = (formData, validationRules) => {
  const errors = {};
  
  for (const [field, rules] of Object.entries(validationRules)) {
    const value = formData.get(field);
    
    for (const rule of rules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break; // Stop at first error for this field
      }
    }
  }
  
  return errors;
};

export default {
  validateEmail,
  validatePhone,
  validatePassword,
  validateRequired,
  validateNumber,
  validateInteger,
  validateLandForm,
  validateUserForm,
  validateProfileForm,
  validatePasswordChange,
  validateForm,
};
