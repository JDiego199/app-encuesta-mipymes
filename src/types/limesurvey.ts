// LimeSurvey validation types

export interface LimeSurveyParticipant {
  tid: number
  token: string
  participant_info: {
    firstname: string
    lastname: string
    email: string
  }
  completed: string | "N" // Date string or "N"
  usesleft: number
}

export interface LimeSurveyParticipantStatus {
  status: 'loading' | 'not_found' | 'pending' | 'completed' | 'error'
  completedDate?: string
  usesLeft?: number
  error?: string
  participantData?: LimeSurveyParticipant
}

export interface UseLimeSurveyValidationReturn {
  participantStatus: LimeSurveyParticipantStatus
  checkParticipantStatus: () => Promise<void>
  isLoading: boolean
  error: string | null
  retry: () => void
}

export interface EdgeFunctionError {
  type: 'network' | 'limesurvey_api' | 'authentication' | 'validation'
  message: string
  code?: string
  retryable: boolean
}

export interface CheckParticipantResponse {
  data?: {
    status: 'not_found' | 'pending' | 'completed' | 'error'
    completedDate?: string
    usesLeft?: number
    error?: string | { message: string }
    participantData?: LimeSurveyParticipant
  }
}