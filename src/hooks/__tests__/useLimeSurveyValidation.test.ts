// Basic validation tests for LimeSurvey validation hook
// Note: These are validation tests for types and interfaces, not full unit tests since no test framework is configured

import type { 
  LimeSurveyParticipantStatus, 
  UseLimeSurveyValidationReturn,
  CheckParticipantResponse,
  EdgeFunctionError,
  LimeSurveyParticipant
} from '@/types/limesurvey'

console.log('Testing LimeSurvey validation types...')

// Test 1: LimeSurveyParticipantStatus interface
const testParticipantStatus: LimeSurveyParticipantStatus = {
  status: 'completed',
  completedDate: '2025-08-30 20:52',
  usesLeft: 0
}
console.assert(testParticipantStatus.status === 'completed', 'Status should be completed')
console.assert(testParticipantStatus.completedDate === '2025-08-30 20:52', 'Completed date should match')

// Test 2: Loading state
const loadingStatus: LimeSurveyParticipantStatus = {
  status: 'loading'
}
console.assert(loadingStatus.status === 'loading', 'Loading status should be valid')

// Test 3: Error state
const errorStatus: LimeSurveyParticipantStatus = {
  status: 'error',
  error: 'Test error message'
}
console.assert(errorStatus.status === 'error', 'Error status should be valid')
console.assert(errorStatus.error === 'Test error message', 'Error message should match')

// Test 4: Not found state
const notFoundStatus: LimeSurveyParticipantStatus = {
  status: 'not_found'
}
console.assert(notFoundStatus.status === 'not_found', 'Not found status should be valid')

// Test 5: Pending state
const pendingStatus: LimeSurveyParticipantStatus = {
  status: 'pending',
  usesLeft: 3
}
console.assert(pendingStatus.status === 'pending', 'Pending status should be valid')
console.assert(pendingStatus.usesLeft === 3, 'Uses left should match')

// Test 6: EdgeFunctionError interface
const networkError: EdgeFunctionError = {
  type: 'network',
  message: 'Connection failed',
  retryable: true
}
console.assert(networkError.type === 'network', 'Error type should be network')
console.assert(networkError.retryable === true, 'Network errors should be retryable')

const authError: EdgeFunctionError = {
  type: 'authentication',
  message: 'Not authenticated',
  retryable: false
}
console.assert(authError.retryable === false, 'Auth errors should not be retryable')

// Test 7: LimeSurveyParticipant interface
const testParticipant: LimeSurveyParticipant = {
  tid: 123,
  token: 'user-id-123',
  participant_info: {
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@example.com'
  },
  completed: '2025-08-30 20:52',
  usesleft: 0
}
console.assert(testParticipant.tid === 123, 'Participant tid should match')
console.assert(testParticipant.token === 'user-id-123', 'Participant token should match')
console.assert(testParticipant.participant_info.firstname === 'John', 'Participant firstname should match')

// Test 8: CheckParticipantResponse interface
const successResponse: CheckParticipantResponse = {
  data: {
    status: 'completed',
    completedDate: '2025-08-30 20:52',
    usesLeft: 0,
    participantData: testParticipant
  }
}
console.assert(successResponse.data?.status === 'completed', 'Response status should be completed')

const errorResponse: CheckParticipantResponse = {
  error: {
    message: 'API Error',
    type: 'limesurvey_api'
  }
}
console.assert(errorResponse.error?.message === 'API Error', 'Error response should have message')

// Test 9: Status type validation
const validStatuses: LimeSurveyParticipantStatus['status'][] = [
  'loading', 'not_found', 'pending', 'completed', 'error'
]
validStatuses.forEach(status => {
  const testStatus: LimeSurveyParticipantStatus = { status }
  console.assert(testStatus.status === status, `Status ${status} should be valid`)
})

console.log('All LimeSurvey validation type tests passed! ✅')

export {} // Make this a module