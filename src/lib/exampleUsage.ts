// Example usage of ArtificialResultsService
// This file demonstrates how to integrate the service with React components

import { ArtificialResultsService } from './artificialResultsService'
import { UserProfile } from '@/types/results'

/**
 * Example function showing how to use the service in a React component
 */
export function exampleUsage() {
  // Example user profile (this would come from your auth context)
  const userProfile: UserProfile = {
    id: 'user-123',
    ruc: '1234567890001',
    razon_social: 'Empresa Ejemplo S.A.',
    nombre_persona: 'Juan Pérez',
    ciudad: 'Quito'
  }

  // Example completion date (this would come from LimeSurvey validation)
  const completedDate = '2025-08-30 20:52'

  // Generate results
  const results = ArtificialResultsService.generateResults(userProfile, completedDate)

  // Example of how to use the results in a component
  console.log('User Results:', {
    userName: results.user.name,
    totalScore: results.overallMetrics.totalScore,
    percentile: results.overallMetrics.percentile,
    dimensionsCount: results.dimensions.length,
    strongAreas: results.overallMetrics.strongAreas,
    improvementAreas: results.overallMetrics.improvementAreas
  })

  // Example of iterating through dimensions
  results.dimensions.forEach(dimension => {
    console.log(`${dimension.name}: ${dimension.userScore}/${dimension.maxScore}`)
    
    // Calculate percentage for this dimension
    const percentage = (dimension.userScore / dimension.maxScore) * 100
    console.log(`  Performance: ${percentage.toFixed(1)}%`)
    
    // Compare with average
    const avgPercentage = (dimension.averageScore / dimension.maxScore) * 100
    const comparison = percentage > avgPercentage ? 'above' : 'below'
    console.log(`  Compared to average: ${comparison} average`)
  })

  return results
}

/**
 * Example of how to integrate with React component using the hook
 */
export const ReactComponentExample = `
import { useAuth } from '@/contexts/AuthContext'
import { useLimeSurveyValidation } from '@/hooks/useLimeSurveyValidation'
import { useArtificialResults } from '@/hooks/useArtificialResults'

export function ResultsComponent() {
  const { profile } = useAuth()
  const { participantStatus } = useLimeSurveyValidation()
  
  // Generate artificial results
  const { results, isLoading, error } = useArtificialResults(
    profile,
    participantStatus.completedDate
  )

  if (isLoading) return <div>Loading results...</div>
  if (error) return <div>Error: {error}</div>
  if (!results) return <div>No results available</div>

  return (
    <div>
      <h1>Results for {results.user.name}</h1>
      <p>Total Score: {results.overallMetrics.totalScore}</p>
      <p>Percentile: {results.overallMetrics.percentile}%</p>
      
      <h2>Dimensions</h2>
      {results.dimensions.map(dimension => (
        <div key={dimension.id}>
          <h3>{dimension.name}</h3>
          <p>Score: {dimension.userScore}/{dimension.maxScore}</p>
          <p>Average: {dimension.averageScore}</p>
        </div>
      ))}
    </div>
  )
}
`