import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  getSurveyQuestions,
  getParticipantStatus,
  createParticipant,
  saveResponse,
  updateParticipantStatus,
  getParticipantResponses,
  calculateProgress,
  type SurveyQuestion,
  type SurveyParticipant
} from '../services/surveyService'

export interface UseSurveyReturn {
  // Data
  questions: SurveyQuestion[]
  currentQuestion: SurveyQuestion | null
  currentIndex: number
  responses: Map<string, any>
  participant: SurveyParticipant | null
  
  // States
  isLoading: boolean
  isSaving: boolean
  error: string | null
  
  // Navigation helpers
  canGoNext: boolean
  canGoPrevious: boolean
  isLastQuestion: boolean
  progressPercentage: number
  
  // Actions
  goToNext: () => Promise<void>
  goToPrevious: () => void
  updateResponse: (value: any) => Promise<void>
  finishSurvey: () => Promise<void>
  goToQuestion: (index: number) => void
  retryLoad: () => Promise<void>
}

interface UseSurveyOptions {
  surveyId: string
  autoSave?: boolean
  autoSaveDelay?: number
}

export function useSurvey({ 
  surveyId, 
  autoSave = true, 
  autoSaveDelay = 1000 
}: UseSurveyOptions): UseSurveyReturn {
  const { user } = useAuth()
  
  // Core state
  const [questions, setQuestions] = useState<SurveyQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState<Map<string, any>>(new Map())
  const [participant, setParticipant] = useState<SurveyParticipant | null>(null)
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Auto-save timeout ref
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedResponseRef = useRef<Map<string, any>>(new Map())

  // Computed values
  const currentQuestion = questions[currentIndex] || null
  const canGoPrevious = currentIndex > 0
  const isLastQuestion = currentIndex === questions.length - 1
  const progressPercentage = questions.length > 0 
    ? Math.round(((currentIndex + 1) / questions.length) * 100) 
    : 0

  // Check if current question is answered and valid
  const isCurrentQuestionValid = useCallback(() => {
    if (!currentQuestion) return false
    
    const response = responses.get(currentQuestion.id)
    
    // If question is required, must have a response
    if (currentQuestion.is_required) {
      if (response === undefined || response === null || response === '') {
        return false
      }
      
      // For multiple choice questions, ensure at least one option is selected
      if (currentQuestion.question_type === 'multiple_choice' && Array.isArray(response)) {
        return response.length > 0
      }
    }
    
    return true
  }, [currentQuestion, responses])

  const canGoNext = isCurrentQuestionValid()

  // Initialize survey data
  const initializeSurvey = useCallback(async () => {
    if (!user?.id) return

    try {
      setIsLoading(true)
      setError(null)

      // Load questions
      const questionsData = await getSurveyQuestions(surveyId)
      setQuestions(questionsData)

      if (questionsData.length === 0) {
        throw new Error('No questions found for this survey')
      }

      // Get or create participant
      let participantData = await getParticipantStatus(user.id, surveyId)
      
      if (!participantData) {
        participantData = await createParticipant(user.id, surveyId)
      }
      
      setParticipant(participantData)

      // Load existing responses
      if (participantData.id) {
        const existingResponses = await getParticipantResponses(participantData.id)
        const responseMap = new Map<string, any>()
        
        existingResponses.forEach(response => {
          let value: any = null
          
          // Extract value based on the response type
          if (response.response_value !== null) {
            // Try to parse JSON first, fallback to string
            try {
              value = JSON.parse(response.response_value)
            } catch {
              value = response.response_value
            }
          } else if (response.response_data !== null) {
            value = response.response_data
          }
          
          responseMap.set(response.question_id, value)
        })
        
        setResponses(responseMap)
        lastSavedResponseRef.current = new Map(responseMap)

        // Set current index to first unanswered question or last answered
        let targetIndex = 0
        for (let i = 0; i < questionsData.length; i++) {
          const questionId = questionsData[i].id
          if (!responseMap.has(questionId)) {
            targetIndex = i
            break
          }
          targetIndex = i + 1
        }
        
        // Ensure we don't go beyond the last question
        setCurrentIndex(Math.min(targetIndex, questionsData.length - 1))
      }

    } catch (err) {
      console.error('Error initializing survey:', err)
      setError(err instanceof Error ? err.message : 'Failed to load survey')
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, surveyId])

  // Auto-save functionality
  const performAutoSave = useCallback(async (questionId: string, value: any) => {
    if (!participant?.id || !autoSave) return

    try {
      setIsSaving(true)
      await saveResponse(participant.id, questionId, value)
      
      // Update last saved state
      lastSavedResponseRef.current.set(questionId, value)
      
      // Update progress
      const progress = await calculateProgress(participant.id, questions.length)
      await updateParticipantStatus(participant.id, 'in_progress', progress)
      
    } catch (err) {
      console.error('Auto-save failed:', err)
      // Don't show error to user for auto-save failures, just log them
    } finally {
      setIsSaving(false)
    }
  }, [participant?.id, autoSave, questions.length])

  // Debounced auto-save
  const scheduleAutoSave = useCallback((questionId: string, value: any) => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      performAutoSave(questionId, value)
    }, autoSaveDelay)
  }, [performAutoSave, autoSaveDelay])

  // Update response
  const updateResponse = useCallback(async (value: any) => {
    if (!currentQuestion) return

    // Update local state immediately (optimistic update)
    setResponses(prev => {
      const newResponses = new Map(prev)
      newResponses.set(currentQuestion.id, value)
      return newResponses
    })

    // Schedule auto-save if enabled
    if (autoSave) {
      scheduleAutoSave(currentQuestion.id, value)
    }
  }, [currentQuestion, autoSave, scheduleAutoSave])

  // Navigation functions
  const goToNext = useCallback(async () => {
    if (!canGoNext || isLastQuestion) return

    // Save current response immediately before navigating
    if (currentQuestion && autoSave) {
      const currentResponse = responses.get(currentQuestion.id)
      const lastSaved = lastSavedResponseRef.current.get(currentQuestion.id)
      
      if (currentResponse !== lastSaved) {
        await performAutoSave(currentQuestion.id, currentResponse)
      }
    }

    setCurrentIndex(prev => Math.min(prev + 1, questions.length - 1))
  }, [canGoNext, isLastQuestion, currentQuestion, autoSave, performAutoSave, responses, questions.length])

  const goToPrevious = useCallback(() => {
    if (!canGoPrevious) return
    setCurrentIndex(prev => Math.max(prev - 1, 0))
  }, [canGoPrevious])

  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index)
    }
  }, [questions.length])

  // Finish survey
  const finishSurvey = useCallback(async () => {
    if (!participant?.id) return

    try {
      setIsSaving(true)
      setError(null)

      // Save any pending responses
      if (currentQuestion && autoSave) {
        const currentResponse = responses.get(currentQuestion.id)
        const lastSaved = lastSavedResponseRef.current.get(currentQuestion.id)
        
        if (currentResponse !== lastSaved) {
          await performAutoSave(currentQuestion.id, currentResponse)
        }
      }

      // Mark survey as completed
      await updateParticipantStatus(participant.id, 'completed', 100)
      
      // Update local participant state
      setParticipant(prev => prev ? {
        ...prev,
        status: 'completed',
        completed_at: new Date().toISOString(),
        progress_percentage: 100
      } : null)

    } catch (err) {
      console.error('Error finishing survey:', err)
      setError(err instanceof Error ? err.message : 'Failed to complete survey')
      throw err
    } finally {
      setIsSaving(false)
    }
  }, [participant?.id, currentQuestion, autoSave, responses, performAutoSave])

  // Retry loading
  const retryLoad = useCallback(async () => {
    await initializeSurvey()
  }, [initializeSurvey])

  // Initialize on mount
  useEffect(() => {
    initializeSurvey()
  }, [initializeSurvey])

  // Cleanup auto-save timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [])

  // Save any pending changes when leaving the page
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (currentQuestion && autoSave && participant?.id) {
        const currentResponse = responses.get(currentQuestion.id)
        const lastSaved = lastSavedResponseRef.current.get(currentQuestion.id)
        
        if (currentResponse !== lastSaved) {
          // Use sendBeacon for reliable saving on page unload
          const formData = new FormData()
          formData.append('participantId', participant.id.toString())
          formData.append('questionId', currentQuestion.id.toString())
          formData.append('value', JSON.stringify(currentResponse))
          
          navigator.sendBeacon('/api/save-response', formData)
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [currentQuestion, autoSave, participant?.id, responses])

  return {
    // Data
    questions,
    currentQuestion,
    currentIndex,
    responses,
    participant,
    
    // States
    isLoading,
    isSaving,
    error,
    
    // Navigation helpers
    canGoNext,
    canGoPrevious,
    isLastQuestion,
    progressPercentage,
    
    // Actions
    goToNext,
    goToPrevious,
    updateResponse,
    finishSurvey,
    goToQuestion,
    retryLoad
  }
}