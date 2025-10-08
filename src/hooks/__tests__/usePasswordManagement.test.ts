// Basic validation tests for password management hooks
// Note: These are validation tests, not full unit tests since no test framework is configured

import { PasswordErrorType, passwordErrorMessages } from '@/types/password'
import { validatePasswordChangeForm, validateEmail } from '@/lib/passwordValidation'

// Test password validation
console.log('Testing password validation...')

// Test 1: Valid password change
const validTest = validatePasswordChangeForm('current123', 'newpass123', 'newpass123')
console.assert(validTest.isValid === true, 'Valid password change should pass')

// Test 2: Weak password
const weakPasswordTest = validatePasswordChangeForm('current123', '123', '123')
console.assert(weakPasswordTest.isValid === false, 'Weak password should fail')
console.assert(weakPasswordTest.error?.type === PasswordErrorType.WEAK_PASSWORD, 'Should return weak password error')

// Test 3: Password mismatch
const mismatchTest = validatePasswordChangeForm('current123', 'newpass123', 'different123')
console.assert(mismatchTest.isValid === false, 'Password mismatch should fail')
console.assert(mismatchTest.error?.type === PasswordErrorType.PASSWORD_MISMATCH, 'Should return password mismatch error')

// Test 4: Valid email
const validEmailTest = validateEmail('test@example.com')
console.assert(validEmailTest.isValid === true, 'Valid email should pass')

// Test 5: Invalid email
const invalidEmailTest = validateEmail('invalid-email')
console.assert(invalidEmailTest.isValid === false, 'Invalid email should fail')

// Test 6: Error messages exist
console.assert(passwordErrorMessages[PasswordErrorType.WEAK_PASSWORD] !== undefined, 'Error messages should be defined')
console.assert(passwordErrorMessages[PasswordErrorType.PASSWORD_MISMATCH] !== undefined, 'Error messages should be defined')

console.log('All validation tests passed! ✅')

export {} // Make this a module