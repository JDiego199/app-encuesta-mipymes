import { useState, useEffect, useMemo } from 'react'
import { ArtificialResultsService } from '@/lib/artificialResultsService'
import { ArtificialResultsData, UserProfile } from '@/types/results'

interface UseArtificialResultsReturn {
  results: ArtificialResultsData | null
  isLoading: boolean
  error: string | null
  regenerateResults: () => void
}

/**
 * Hook for managing artificial survey results data
 * Generates consistent results based on user profile and completion date
 */
export function useArtificialResults(
  userProfile: UserProfile | null,
  completedDate: string | null
): UseArtificialResultsReturn {
  const [results, setResults] = useState<ArtificialResultsData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Memoize the generation function to avoid unnecessary recalculations
  const generateResults = useMemo(() => {
    return () => {
      if (!userProfile || !completedDate) {
        setResults(null)
        setError(null)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const artificialResults = ArtificialResultsService.generateResults(
          userProfile,
          completedDate
        )
        setResults(artificialResults)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error generating results'
        setError(errorMessage)
        setResults(null)
      } finally {
        setIsLoading(false)
      }
    }
  }, [userProfile, completedDate])

  // Generate results when dependencies change
  useEffect(() => {
    generateResults()
  }, [generateResults])

  // Function to manually regenerate results (useful for testing)
  const regenerateResults = () => {
    generateResults()
  }

  return {
    results,
    isLoading,
    error,
    regenerateResults
  }
}