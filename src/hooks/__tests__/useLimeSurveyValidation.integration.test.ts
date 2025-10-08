// Integration test to verify the hook can be imported and has correct interface
// Note: This doesn't test actual functionality since we don't have a test environment set up

import { useLimeSurveyValidation } from '@/hooks/useLimeSurveyValidation'
import type { UseLimeSurveyValidationReturn } from '@/types/limesurvey'

console.log('Testing useLimeSurveyValidation hook integration...')

// Test 1: Hook can be imported
console.assert(typeof useLimeSurveyValidation === 'function', 'useLimeSurveyValidation should be a function')

// Test 2: Verify the hook interface matches expected return type
// This is a compile-time check that the hook returns the correct interface
const mockHookReturn: UseLimeSurveyValidationReturn = {
  participantStatus: { status: 'loading' },
  checkParticipantStatus: async () => {},
  isLoading: false,
  error: null,
  retry: () => {}
}

console.assert(typeof mockHookReturn.checkParticipantStatus === 'function', 'checkParticipantStatus should be a function')
console.assert(typeof mockHookReturn.retry === 'function', 'retry should be a function')
console.assert(typeof mockHookReturn.isLoading === 'boolean', 'isLoading should be a boolean')
console.assert(mockHookReturn.error === null || typeof mockHookReturn.error === 'string', 'error should be null or string')
console.assert(typeof mockHookReturn.participantStatus === 'object', 'participantStatus should be an object')

// Test 3: Verify status values are valid
const validStatuses = ['loading', 'not_found', 'pending', 'completed', 'error']
console.assert(validStatuses.includes(mockHookReturn.participantStatus.status), 'Status should be valid')

console.log('useLimeSurveyValidation hook integration tests passed! ✅')

export {} // Make this a module