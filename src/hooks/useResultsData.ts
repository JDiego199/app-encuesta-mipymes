import { useInternalSurveyResults } from '@/hooks/useInternalSurveyResults'

/**
 * Custom hook for managing results data
 * Now uses internal survey results from Supabase instead of artificial data
 */
export function useResultsData() {
  return useInternalSurveyResults()
}