import { useState, useCallback } from 'react'

export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Update field value
  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }, [errors])

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    setValue(name, newValue)
  }, [setValue])

  // Mark field as touched
  const setTouchedField = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }))
  }, [])

  // Validate single field
  const validateField = useCallback((name, value) => {
    const rule = validationRules[name]
    if (!rule) return ''

    if (rule.required && (!value || value.toString().trim() === '')) {
      return rule.required
    }

    if (rule.minLength && value && value.length < rule.minLength) {
      return rule.minLength
    }

    if (rule.maxLength && value && value.length > rule.maxLength) {
      return rule.maxLength
    }

    if (rule.pattern && value && !rule.pattern.test(value)) {
      return rule.pattern
    }

    if (rule.validate && typeof rule.validate === 'function') {
      return rule.validate(value, values)
    }

    return ''
  }, [validationRules, values])

  // Validate all fields
  const validate = useCallback(() => {
    const newErrors = {}
    let isValid = true

    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name])
      if (error) {
        newErrors[name] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [values, validationRules, validateField])

  // Reset form
  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  // Set form values (useful for editing)
  const setFormValues = useCallback((newValues) => {
    setValues(newValues)
    setErrors({})
    setTouched({})
  }, [])

  // Handle blur event
  const handleBlur = useCallback((e) => {
    const { name } = e.target
    setTouchedField(name)

    // Validate field on blur
    const error = validateField(name, values[name])
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }, [setTouchedField, validateField, values])

  return {
    values,
    errors,
    touched,
    setValue,
    handleChange,
    handleBlur,
    setTouchedField,
    validate,
    reset,
    setFormValues,
    isValid: Object.keys(errors).length === 0
  }
}
