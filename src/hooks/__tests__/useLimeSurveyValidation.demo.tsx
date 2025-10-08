// Demo component to show how to use the useLimeSurveyValidation hook
// This is for documentation and testing purposes

import React from 'react'
import { useLimeSurveyValidation } from '@/hooks/useLimeSurveyValidation'

export function LimeSurveyValidationDemo() {
  const { 
    participantStatus, 
    checkParticipantStatus, 
    isLoading, 
    error, 
    retry 
  } = useLimeSurveyValidation()

  const handleRetry = () => {
    retry()
  }

  const handleManualCheck = () => {
    checkParticipantStatus()
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">LimeSurvey Validation Status</h3>
      
      <div className="space-y-2">
        <div>
          <strong>Status:</strong> {participantStatus.status}
        </div>
        
        {participantStatus.completedDate && (
          <div>
            <strong>Completed Date:</strong> {participantStatus.completedDate}
          </div>
        )}
        
        {participantStatus.usesLeft !== undefined && (
          <div>
            <strong>Uses Left:</strong> {participantStatus.usesLeft}
          </div>
        )}
        
        {error && (
          <div className="text-red-600">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {isLoading && (
          <div className="text-blue-600">
            Loading...
          </div>
        )}
      </div>
      
      <div className="mt-4 space-x-2">
        <button 
          onClick={handleManualCheck}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Check Status
        </button>
        
        {error && (
          <button 
            onClick={handleRetry}
            disabled={isLoading}
            className="px-4 py-2 bg-orange-500 text-white rounded disabled:opacity-50"
          >
            Retry
          </button>
        )}
      </div>
      
      {/* Status-specific content */}
      {participantStatus.status === 'not_found' && (
        <div className="mt-4 p-3 bg-yellow-100 rounded">
          <p>User not found in survey. Registration needed.</p>
        </div>
      )}
      
      {participantStatus.status === 'pending' && (
        <div className="mt-4 p-3 bg-blue-100 rounded">
          <p>Survey is pending completion. {participantStatus.usesLeft} uses left.</p>
        </div>
      )}
      
      {participantStatus.status === 'completed' && (
        <div className="mt-4 p-3 bg-green-100 rounded">
          <p>Survey completed on {participantStatus.completedDate}</p>
        </div>
      )}
    </div>
  )
}

// Example usage in a component
export function ExampleUsage() {
  const validation = useLimeSurveyValidation()
  
  // Handle different states
  switch (validation.participantStatus.status) {
    case 'loading':
      return <div>Checking survey status...</div>
      
    case 'not_found':
      return (
        <div>
          <p>You need to register for the survey</p>
          <button onClick={() => {/* Register user */}}>
            Register for Survey
          </button>
        </div>
      )
      
    case 'pending':
      return (
        <div>
          <p>You have a pending survey ({validation.participantStatus.usesLeft} uses left)</p>
          <button onClick={() => {/* Navigate to survey */}}>
            Continue Survey
          </button>
        </div>
      )
      
    case 'completed':
      return (
        <div>
          <p>Survey completed on {validation.participantStatus.completedDate}</p>
          <button onClick={() => {/* Navigate to results */}}>
            View Results
          </button>
        </div>
      )
      
    case 'error':
      return (
        <div>
          <p>Error: {validation.error}</p>
          <button onClick={validation.retry}>
            Retry
          </button>
        </div>
      )
      
    default:
      return <div>Unknown status</div>
  }
}

export {} // Make this a module