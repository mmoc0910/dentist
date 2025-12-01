const validator = require('validator');

// Validate email
const isValidEmail = (email) => {
  return validator.isEmail(email);
};

// Validate phone number (Vietnamese format)
const isValidPhone = (phone) => {
  const phoneRegex = /^(0|\+84)[0-9]{9}$/;
  return phoneRegex.test(phone);
};

// Validate password strength
const isValidPassword = (password) => {
  // At least 6 characters
  return password && password.length >= 6;
};

// Validate required fields
const validateRequiredFields = (data, fields) => {
  const errors = [];
  
  fields.forEach(field => {
    if (!data[field] || data[field].toString().trim() === '') {
      errors.push(`${field} không được để trống`);
    }
  });
  
  return errors;
};

// Sanitize input
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return validator.escape(input.trim());
  }
  return input;
};

module.exports = {
  isValidEmail,
  isValidPhone,
  isValidPassword,
  validateRequiredFields,
  sanitizeInput
};
