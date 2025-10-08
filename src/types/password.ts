// Types for password management functionality

export interface PasswordChangeRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirmation {
  token: string
  newPassword: string
  confirmPassword: string
}

export enum PasswordErrorType {
  INVALID_CURRENT_PASSWORD = 'invalid_current_password',
  WEAK_PASSWORD = 'weak_password',
  PASSWORD_MISMATCH = 'password_mismatch',
  INVALID_TOKEN = 'invalid_token',
  EXPIRED_TOKEN = 'expired_token',
  EMAIL_NOT_FOUND = 'email_not_found',
  NETWORK_ERROR = 'network_error',
  UNKNOWN_ERROR = 'unknown_error'
}

export interface PasswordError {
  type: PasswordErrorType
  message: string
}

export interface PasswordChangeResponse {
  success: boolean
  error?: PasswordError
}

export interface PasswordResetResponse {
  success: boolean
  error?: PasswordError
}

// Error messages in Spanish
export const passwordErrorMessages: Record<PasswordErrorType, string> = {
  [PasswordErrorType.INVALID_CURRENT_PASSWORD]: 'La contraseña actual es incorrecta',
  [PasswordErrorType.WEAK_PASSWORD]: 'La contraseña debe tener al menos 6 caracteres',
  [PasswordErrorType.PASSWORD_MISMATCH]: 'Las contraseñas no coinciden',
  [PasswordErrorType.INVALID_TOKEN]: 'El enlace de recuperación es inválido',
  [PasswordErrorType.EXPIRED_TOKEN]: 'El enlace de recuperación ha expirado',
  [PasswordErrorType.EMAIL_NOT_FOUND]: 'No se encontró una cuenta con este email',
  [PasswordErrorType.NETWORK_ERROR]: 'Error de conexión. Intente nuevamente',
  [PasswordErrorType.UNKNOWN_ERROR]: 'Ocurrió un error inesperado'
}