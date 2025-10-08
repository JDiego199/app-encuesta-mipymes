import { useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLimeSurveyValidation } from '@/hooks/useLimeSurveyValidation'
import { ArtificialResultsService } from '@/lib/artificialResultsService'
import { ResultsTransformer } from '@/lib/resultsTransformer'
import { MetricsData } from '@/types/results'

/**
 * Custom hook for managing results data
 * Generates artificial results based on user profile and survey completion status
 */
export function useResultsData() {
  const { user, profile } = useAuth()
  const { participantStatus } = useLimeSurveyValidation()

  const metricsData = useMemo((): MetricsData | null => {
    // Only generate data if survey is completed
    if (participantStatus.status !== 'completed' || !user || !profile) {
      return null
    }

    try {
      // Create user profile for artificial data generation
      const userProfile = {
        id: user.id,
        nombre_persona: profile.nombre_persona,
        razon_social: profile.razon_social,
        ruc: profile.ruc,
        ciudad: profile.ciudad
      }

      // Generate artificial results based on user data
      const artificialResults = ArtificialResultsService.generateResults(
        userProfile,
        participantStatus.completedDate || new Date().toISOString()
      )

      // Transform to metrics format for visualization components
      return ResultsTransformer.transformToMetricsData(artificialResults)
    } catch (error) {
      console.error('Error generating artificial results:', error)
      
      // Fallback to sample data in case of error
      return ResultsTransformer.createSampleMetricsData()
    }
  }, [user, profile, participantStatus.status, participantStatus.completedDate])

  const isLoading = participantStatus.status === 'loading'
  const isCompleted = participantStatus.status === 'completed'
  const hasData = metricsData !== null

  return {
    metricsData,
    isLoading,
    isCompleted,
    hasData,
    participantStatus
  }
}