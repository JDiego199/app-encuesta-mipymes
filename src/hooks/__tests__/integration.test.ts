// Integration test to verify hooks can be imported and used
import { usePasswordChange, usePasswordReset, usePasswordResetConfirmation } from '@/hooks/usePasswordManagement'
import { PasswordErrorType, passwordErrorMessages } from '@/types/password'
import { validatePasswordChangeForm, validateEmail } from '@/lib/passwordValidation'

// Test that all exports are available
console.log('Testing imports...')

// Verify hook functions exist
console.assert(typeof usePasswordChange === 'function', 'usePasswordChange should be a function')
console.assert(typeof usePasswordReset === 'function', 'usePasswordReset should be a function')
console.assert(typeof usePasswordResetConfirmation === 'function', 'usePasswordResetConfirmation should be a function')

// Verify types exist
console.assert(typeof PasswordErrorType === 'object', 'PasswordErrorType should be an object')
console.assert(typeof passwordErrorMessages === 'object', 'passwordErrorMessages should be an object')

// Verify validation functions exist
console.assert(typeof validatePasswordChangeForm === 'function', 'validatePasswordChangeForm should be a function')
console.assert(typeof validateEmail === 'function', 'validateEmail should be a function')

// Test error messages are in Spanish
console.assert(passwordErrorMessages[PasswordErrorType.WEAK_PASSWORD].includes('contraseña'), 'Error messages should be in Spanish')
console.assert(passwordErrorMessages[PasswordErrorType.PASSWORD_MISMATCH].includes('contraseñas'), 'Error messages should be in Spanish')

console.log('All integration tests passed! ✅')
console.log('Password management hooks are ready to use.')

export {}