import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getSurveyResults, transformSurveyResultsToMetrics, getParticipantStatusForResults } from '@/services/resultsService'
import { MetricsData } from '@/types/results'

// Default survey ID - this should match the survey created in the database
const DEFAULT_SURVEY_ID = 'bfb4c2e2-ea0e-406a-b09c-226e883dd417'

interface UseInternalSurveyResultsReturn {
  metricsData: MetricsData | null
  isLoading: boolean
  isCompleted: boolean
  hasData: boolean
  participantStatus: {
    status: 'not_started' | 'in_progress' | 'completed' | 'loading' | 'error'
    completedDate?: string
    error?: string
  }
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Custom hook for managing internal survey results data
 * Replaces the LimeSurvey integration with internal Supabase data
 */
export function useInternalSurveyResults(surveyId: string = DEFAULT_SURVEY_ID): UseInternalSurveyResultsReturn {
  const { user, profile } = useAuth()
  const [metricsData, setMetricsData] = useState<MetricsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [participantStatus, setParticipantStatus] = useState<{
    status: 'not_started' | 'in_progress' | 'completed' | 'loading' | 'error'
    completedDate?: string
    error?: string
  }>({
    status: 'loading'
  })

  const fetchResults = async () => {
    if (!user) {
      setParticipantStatus({
        status: 'error',
        error: 'Usuario no autenticado'
      })
      setError('Usuario no autenticado')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // First, check participant status
      const statusResult = await getParticipantStatusForResults(user.id, surveyId)
      setParticipantStatus(statusResult)

      // Only fetch results if survey is completed
      if (statusResult.status === 'completed') {
        console.log('Fetching survey results for user:', user.id, 'survey:', surveyId)
        
        const resultsData = await getSurveyResults(surveyId, user.id)
        const transformedMetrics = transformSurveyResultsToMetrics(resultsData)
        
        console.log('Survey results transformed:', transformedMetrics)
        setMetricsData(transformedMetrics)
      } else {
        setMetricsData(null)
      }
    } catch (error) {
      console.error('Error fetching survey results:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar resultados'
      setError(errorMessage)
      setParticipantStatus(prev => ({
        ...prev,
        status: 'error',
        error: errorMessage
      }))
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch when user is available
  useEffect(() => {
    if (user) {
      fetchResults()
    } else {
      setIsLoading(false)
      setParticipantStatus({ status: 'error', error: 'Usuario no autenticado' })
    }
  }, [user, surveyId])

  const isCompleted = participantStatus.status === 'completed'
  const hasData = metricsData !== null

  return {
    metricsData,
    isLoading,
    isCompleted,
    hasData,
    participantStatus,
    error,
    refetch: fetchResults
  }
}