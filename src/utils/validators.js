/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' }
  }

  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' }
  }

  if (password.length > 128) {
    return { isValid: false, message: 'Password must be less than 128 characters' }
  }

  return { isValid: true, message: 'Password is valid' }
}

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} Validation result with isValid and message
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, message: `${fieldName} is required` }
  }

  if (typeof value === 'string' && value.trim() === '') {
    return { isValid: false, message: `${fieldName} cannot be empty` }
  }

  return { isValid: true, message: `${fieldName} is valid` }
}

/**
 * Validate string length
 * @param {string} value - String to validate
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} Validation result with isValid and message
 */
export const validateStringLength = (value, minLength, maxLength, fieldName = 'Field') => {
  if (typeof value !== 'string') {
    return { isValid: false, message: `${fieldName} must be a string` }
  }

  if (value.length < minLength) {
    return { isValid: false, message: `${fieldName} must be at least ${minLength} characters long` }
  }

  if (value.length > maxLength) {
    return { isValid: false, message: `${fieldName} must be less than ${maxLength} characters` }
  }

  return { isValid: true, message: `${fieldName} is valid` }
}

/**
 * Validate number range
 * @param {number} value - Number to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} Validation result with isValid and message
 */
export const validateNumberRange = (value, min, max, fieldName = 'Field') => {
  if (typeof value !== 'number' || isNaN(value)) {
    return { isValid: false, message: `${fieldName} must be a valid number` }
  }

  if (value < min) {
    return { isValid: false, message: `${fieldName} must be at least ${min}` }
  }

  if (value > max) {
    return { isValid: false, message: `${fieldName} must be less than or equal to ${max}` }
  }

  return { isValid: true, message: `${fieldName} is valid` }
}

/**
 * Validate form data
 * @param {Object} formData - Form data to validate
 * @param {Object} rules - Validation rules
 * @returns {Object} Validation result with isValid, errors, and firstError
 */
export const validateForm = (formData, rules) => {
  const errors = {}
  let isValid = true

  for (const [fieldName, fieldRules] of Object.entries(rules)) {
    const value = formData[fieldName]
    const fieldError = validateField(value, fieldRules, fieldName)

    if (!fieldError.isValid) {
      errors[fieldName] = fieldError.message
      isValid = false
    }
  }

  const firstError = Object.values(errors)[0] || null

  return {
    isValid,
    errors,
    firstError
  }
}

/**
 * Validate a single field based on rules
 * @param {any} value - Value to validate
 * @param {Array} rules - Array of validation rules
 * @param {string} fieldName - Name of the field
 * @returns {Object} Validation result with isValid and message
 */
export const validateField = (value, rules, fieldName) => {
  for (const rule of rules) {
    const result = rule(value, fieldName)
    if (!result.isValid) {
      return result
    }
  }

  return { isValid: true, message: `${fieldName} is valid` }
}

/**
 * Common validation rules
 */
export const validationRules = {
  required: (value, fieldName) => validateRequired(value, fieldName),

  email: (value, fieldName) => {
    const requiredResult = validateRequired(value, fieldName)
    if (!requiredResult.isValid) return requiredResult

    return isValidEmail(value)
      ? { isValid: true, message: `${fieldName} is valid` }
      : { isValid: false, message: `${fieldName} must be a valid email address` }
  },

  password: (value, fieldName) => validatePassword(value),

  minLength: (min) => (value, fieldName) =>
    validateStringLength(value, min, Infinity, fieldName),

  maxLength: (max) => (value, fieldName) =>
    validateStringLength(value, 0, max, fieldName),

  minMaxLength: (min, max) => (value, fieldName) =>
    validateStringLength(value, min, max, fieldName),

  numberRange: (min, max) => (value, fieldName) =>
    validateNumberRange(value, min, max, fieldName),
}
