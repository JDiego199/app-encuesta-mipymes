import { PasswordErrorType, passwordErrorMessages } from '@/types/password'

export interface ValidationResult {
  isValid: boolean
  error?: {
    type: PasswordErrorType
    message: string
  }
}

/**
 * Validates password strength
 */
export function validatePasswordStrength(password: string): ValidationResult {
  if (!password || password.length < 6) {
    return {
      isValid: false,
      error: {
        type: PasswordErrorType.WEAK_PASSWORD,
        message: passwordErrorMessages[PasswordErrorType.WEAK_PASSWORD]
      }
    }
  }
  
  return { isValid: true }
}

/**
 * Validates password confirmation
 */
export function validatePasswordConfirmation(password: string, confirmPassword: string): ValidationResult {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: {
        type: PasswordErrorType.PASSWORD_MISMATCH,
        message: passwordErrorMessages[PasswordErrorType.PASSWORD_MISMATCH]
      }
    }
  }
  
  return { isValid: true }
}

/**
 * Validates email format
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!email || !emailRegex.test(email)) {
    return {
      isValid: false,
      error: {
        type: PasswordErrorType.EMAIL_NOT_FOUND,
        message: 'Por favor ingresa un email válido'
      }
    }
  }
  
  return { isValid: true }
}

/**
 * Comprehensive password change validation
 */
export function validatePasswordChangeForm(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): ValidationResult {
  if (!currentPassword) {
    return {
      isValid: false,
      error: {
        type: PasswordErrorType.INVALID_CURRENT_PASSWORD,
        message: 'La contraseña actual es requerida'
      }
    }
  }
  
  const passwordStrengthResult = validatePasswordStrength(newPassword)
  if (!passwordStrengthResult.isValid) {
    return passwordStrengthResult
  }
  
  const passwordConfirmationResult = validatePasswordConfirmation(newPassword, confirmPassword)
  if (!passwordConfirmationResult.isValid) {
    return passwordConfirmationResult
  }
  
  return { isValid: true }
}