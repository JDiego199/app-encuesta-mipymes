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
  const [allQuestions, setAllQuestions] = useState<SurveyQuestion[]>([]) // todas las preguntas
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
  const [progressPercentage, setProgressPercentage] = useState(0)

  
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


  const removeHiddenResponsesFromDB = useCallback(async (hiddenQuestionIds: string[]) => {
    if (!participant?.id) return
    try {
      for (const qId of hiddenQuestionIds) {
        await saveResponse(participant.id, qId, null) // guardar null elimina o limpia la respuesta
        lastSavedResponseRef.current.delete(qId)       // actualizar el registro local
      }
    } catch (err) {
      console.error('Error removing hidden responses from DB:', err)
    }
  }, [participant?.id])


  const filterQuestions = useCallback((questionsData: SurveyQuestion[], responseMap: Map<string, any>) => {
    return questionsData.filter(q => {
      const respBfb = responseMap.get('bfb4c2e2-ea0e-406a-b09c-226e773dd417')
      const resp333 = responseMap.get('333d5bf0-96c4-40ba-8c3c-adfdb338f407')
      const resp504 = responseMap.get('504a9b7e-1c09-413d-8ba4-2374a4b64fe7')

      switch (q.id) {
        case '6eb3af2a-b3fa-475a-9c4f-1d7b1c30fdb6':
          return respBfb !== undefined && Number(respBfb) >= 2
        case 'd4314b0c-8087-481d-959c-913d35762938':
        case '6c78e68c-0371-4613-868d-fa1a8c579b9d':
          return resp333 !== undefined && resp333 === 'Sí'
        case '03008df9-1188-4f27-bcfd-e1e121066c23':
        case 'a680280a-8755-4b54-a3e2-3f3a967fe89d':
          return resp504 !== undefined && resp504 === 'Sí'
        default:
          return true
      }
    })
  }, [])


  const calculateProgressPercentage = useCallback((visibleQuestions: SurveyQuestion[], responseMap: Map<string, any>) => {
    if (visibleQuestions.length === 0) return 0

    const answeredCount = visibleQuestions.filter(q => {
      const resp = responseMap.get(q.id)
      return resp !== undefined && resp !== null && resp !== ''
    }).length

    return Math.round((answeredCount / visibleQuestions.length) * 100)
  }, [])


  // Initialize survey data
  const initializeSurvey = useCallback(async () => {
    if (!user?.id) return
    try {
      setIsLoading(true)
      setError(null)

      // Load all questions
      const questionsData = await getSurveyQuestions(surveyId)
      if (questionsData.length === 0) throw new Error('No questions found')
      setAllQuestions(questionsData)

      // Get or create participant
      let participantData = await getParticipantStatus(user.id, surveyId)
      if (!participantData) participantData = await createParticipant(user.id, surveyId)
      setParticipant(participantData)

      // Load existing responses
      const responseMap = new Map<string, any>()
      if (participantData.id) {
        const existingResponses = await getParticipantResponses(participantData.id)
        existingResponses.forEach(r => {
          let value: any = null
          if (r.response_value !== null) {
            try { value = JSON.parse(r.response_value) } catch { value = r.response_value }
          } else if (r.response_data !== null) {
            value = r.response_data
          }
          responseMap.set(r.question_id, value)
        })
        setResponses(responseMap)
        lastSavedResponseRef.current = new Map(responseMap)
      }

      // Set filtered questions visibles
      const visibleQuestions = filterQuestions(questionsData, responseMap)
      setQuestions(visibleQuestions)

      // Set current index to first unanswered
      let targetIndex = 0
      for (let i = 0; i < visibleQuestions.length; i++) {
        if (!responseMap.has(visibleQuestions[i].id)) {
          targetIndex = i
          break
        }
        targetIndex = i + 1
      }
      setCurrentIndex(Math.min(targetIndex, visibleQuestions.length - 1))

    } catch (err: any) {
      setError(err.message || 'Error initializing survey')
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, surveyId, filterQuestions])


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
      
      const updatedVisibleQuestions = filterQuestions(allQuestions, newResponses)
      const visibleIds = new Set(updatedVisibleQuestions.map(q => q.id))
      for (const questionId of newResponses.keys()) {
        if (!visibleIds.has(questionId)) {
          newResponses.delete(questionId)
        }
      }
      
      // Identificar preguntas que dejaron de ser visibles
      const removedQuestionIds = Array.from(newResponses.keys()).filter(id => !visibleIds.has(id))
      for (const id of removedQuestionIds) {
        newResponses.delete(id)
      }

      // Limpiar también en DB
      if (removedQuestionIds.length > 0) {
        removeHiddenResponsesFromDB(removedQuestionIds)
      }

      setQuestions(updatedVisibleQuestions)

      const progress = calculateProgressPercentage(updatedVisibleQuestions, newResponses)
      setProgressPercentage(progress)

      // Ajustar currentIndex si la pregunta actual desaparece
      let index = updatedVisibleQuestions.findIndex(q => q.id === currentQuestion.id)
      if (index === -1) index = Math.min(currentIndex, updatedVisibleQuestions.length - 1)
      setCurrentIndex(index)

      return newResponses
    })

    // Schedule auto-save if enabled
    if (autoSave) {
      scheduleAutoSave(currentQuestion.id, value)
    }
  }, [currentQuestion, autoSave, scheduleAutoSave, allQuestions, filterQuestions, currentIndex])

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