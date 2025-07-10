import { ref, computed } from 'vue'

export interface ValidationRule {
  test: (value: unknown) => boolean
  message: string
}

export interface FieldValidation {
  value: unknown
  rules: ValidationRule[]
  touched: boolean
}

/**
 * Composable for form validation with reactive error handling
 * 
 * @description
 * Provides utilities for:
 * - Field-level validation with custom rules
 * - Form-level validation
 * - Error message management
 * - Touch state tracking
 */
export function useFormValidation() {
  const fields = ref<Record<string, FieldValidation>>({})
  const globalError = ref('')

  /**
   * Registers a field for validation
   */
  const registerField = (name: string, value: unknown, rules: ValidationRule[]) => {
    fields.value[name] = {
      value,
      rules,
      touched: false
    }
  }

  /**
   * Updates a field value and marks it as touched
   */
  const updateField = (name: string, value: unknown) => {
    if (fields.value[name]) {
      fields.value[name].value = value
      fields.value[name].touched = true
    }
    clearGlobalError()
  }

  /**
   * Validates a specific field
   */
  const validateField = (name: string): string => {
    const field = fields.value[name]
    if (!field || !field.touched) return ''

    for (const rule of field.rules) {
      if (!rule.test(field.value)) {
        return rule.message
      }
    }
    return ''
  }

  /**
   * Validates all fields in the form
   */
  const validateForm = (): { isValid: boolean; firstError: string } => {
    let firstError = ''
    let isValid = true

    for (const [name, field] of Object.entries(fields.value)) {
      field.touched = true
      const error = validateField(name)
      if (error && !firstError) {
        firstError = error
        isValid = false
      }
    }

    if (!isValid) {
      setGlobalError(firstError)
    }

    return { isValid, firstError }
  }

  /**
   * Gets error for a specific field
   */
  const getFieldError = (name: string) => computed(() => validateField(name))

  /**
   * Checks if a field has an error
   */
  const hasFieldError = (name: string) => computed(() => !!validateField(name))

  /**
   * Sets a global error message
   */
  const setGlobalError = (message: string) => {
    globalError.value = message
  }

  /**
   * Clears the global error message
   */
  const clearGlobalError = () => {
    globalError.value = ''
  }

  /**
   * Resets all form fields and errors
   */
  const resetForm = () => {
    fields.value = {}
    globalError.value = ''
  }

  return {
    fields,
    globalError,
    registerField,
    updateField,
    validateField,
    validateForm,
    getFieldError,
    hasFieldError,
    setGlobalError,
    clearGlobalError,
    resetForm
  }
}

// Common validation rules
export const validationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    test: (value: unknown) => !!String(value ?? '').trim(),
    message
  }),

  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    test: (value: unknown) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(String(value ?? ''))
    },
    message
  }),

  minLength: (length: number, message?: string): ValidationRule => ({
    test: (value: unknown) => String(value ?? '').length >= length,
    message: message || `Must be at least ${length} characters long`
  }),

  maxLength: (length: number, message?: string): ValidationRule => ({
    test: (value: unknown) => String(value ?? '').length <= length,
    message: message || `Must be no more than ${length} characters long`
  }),

  pattern: (regex: RegExp, message: string): ValidationRule => ({
    test: (value: unknown) => regex.test(String(value ?? '')),
    message
  })
}
