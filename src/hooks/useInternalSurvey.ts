import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { InternalSurveyService, SurveyParticipant } from '@/services/internalSurveyService'
import { SurveyQuestion } from '@/types/survey'
import { toast } from 'sonner'

export interface UseInternalSurveyReturn {
  participant: SurveyParticipant | null
  currentQuestionIndex: number
  responses: Record<string, any>
  isLoading: boolean
  error: string | null
  saveResponse: (questionId: string, value: any) => Promise<void>
  goToNext: () => Promise<void>
  goToPrevious: () => void
  completeSurvey: () => Promise<void>
  loadParticipantData: () => Promise<void>
}

export function useInternalSurvey(questions: SurveyQuestion[]): UseInternalSurveyReturn {
  const { user } = useAuth()
  const [participant, setParticipant] = useState<SurveyParticipant | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadParticipantData = useCallback(async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      // Get or create participant
      const participantData = await InternalSurveyService.getOrCreateParticipant(user.id)
      setParticipant(participantData)
      setCurrentQuestionIndex(participantData.current_question_index)

      // Load existing responses
      const existingResponses = await InternalSurveyService.getParticipantResponses(participantData.id)
      setResponses(existingResponses)

      console.log('Loaded participant data:', {
        participant: participantData,
        responses: existingResponses
      })
    } catch (error: any) {
      console.error('Error loading participant data:', error)
      setError(error.message || 'Error al cargar datos de la encuesta')
      toast.error('Error al cargar la encuesta')
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const saveResponse = useCallback(async (questionId: string, value: any) => {
    if (!participant) return

    try {
      await InternalSurveyService.saveResponse(participant.id, questionId, value)
      
      // Update local state
      setResponses(prev => ({
        ...prev,
        [questionId]: value
      }))

      console.log('Saved response:', { questionId, value })
    } catch (error: any) {
      console.error('Error saving response:', error)
      toast.error('Error al guardar respuesta')
      throw error
    }
  }, [participant])

  const goToNext = useCallback(async () => {
    if (!participant || currentQuestionIndex >= questions.length - 1) return

    const newIndex = currentQuestionIndex + 1
    
    try {
      // Update participant progress
      await InternalSurveyService.updateParticipantProgress(
        participant.id,
        newIndex,
        newIndex === 0 ? 'in_progress' : undefined
      )

      setCurrentQuestionIndex(newIndex)
      
      // Update participant status if this is the first question
      if (newIndex === 1 && participant.status === 'not_started') {
        setParticipant(prev => prev ? { ...prev, status: 'in_progress' } : null)
      }

      console.log('Moved to next question:', newIndex)
    } catch (error: any) {
      console.error('Error updating progress:', error)
      toast.error('Error al avanzar en la encuesta')
    }
  }, [participant, currentQuestionIndex, questions.length])

  const goToPrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }, [currentQuestionIndex])

  const completeSurvey = useCallback(async () => {
    if (!participant) return

    try {
      await InternalSurveyService.updateParticipantProgress(
        participant.id,
        questions.length,
        'completed'
      )

      setParticipant(prev => prev ? { ...prev, status: 'completed' } : null)
      
      console.log('Survey completed successfully')
      toast.success('¡Encuesta completada exitosamente!')
    } catch (error: any) {
      console.error('Error completing survey:', error)
      toast.error('Error al completar la encuesta')
      throw error
    }
  }, [participant, questions.length])

  // Load participant data when user is available
  useEffect(() => {
    if (user) {
      loadParticipantData()
    }
  }, [user, loadParticipantData])

  return {
    participant,
    currentQuestionIndex,
    responses,
    isLoading,
    error,
    saveResponse,
    goToNext,
    goToPrevious,
    completeSurvey,
    loadParticipantData
  }
}