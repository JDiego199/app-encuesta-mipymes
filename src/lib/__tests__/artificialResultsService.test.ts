import { describe, it, expect } from 'vitest'
import { ArtificialResultsService } from '../artificialResultsService'
import { UserProfile } from '@/types/results'

describe('ArtificialResultsService', () => {
  const mockUserProfile: UserProfile = {
    id: 'test-user-123',
    email: 'test@example.com',
    ruc: '1234567890001',
    razon_social: 'Test Company S.A.',
    nombre_persona: 'Juan Pérez',
    nombre_empresa: 'Test Company',
    ciudad: 'Quito',
    sector: 'Tecnología'
  }

  const completedDate = '2025-08-30 20:52'

  it('should generate consistent results for the same user', () => {
    const results1 = ArtificialResultsService.generateResults(mockUserProfile, completedDate)
    const results2 = ArtificialResultsService.generateResults(mockUserProfile, completedDate)

    expect(results1.dimensions).toEqual(results2.dimensions)
    expect(results1.overallMetrics.totalScore).toBe(results2.overallMetrics.totalScore)
  })

  it('should generate different results for different users', () => {
    const user2: UserProfile = { ...mockUserProfile, id: 'different-user-456' }
    
    const results1 = ArtificialResultsService.generateResults(mockUserProfile, completedDate)
    const results2 = ArtificialResultsService.generateResults(user2, completedDate)

    expect(results1.overallMetrics.totalScore).not.toBe(results2.overallMetrics.totalScore)
  })

  it('should generate exactly 8 dimensions', () => {
    const results = ArtificialResultsService.generateResults(mockUserProfile, completedDate)
    
    expect(results.dimensions).toHaveLength(8)
  })

  it('should have all required dimension properties', () => {
    const results = ArtificialResultsService.generateResults(mockUserProfile, completedDate)
    
    results.dimensions.forEach(dimension => {
      expect(dimension).toHaveProperty('id')
      expect(dimension).toHaveProperty('name')
      expect(dimension).toHaveProperty('description')
      expect(dimension).toHaveProperty('userScore')
      expect(dimension).toHaveProperty('averageScore')
      expect(dimension).toHaveProperty('maxScore')
      expect(dimension).toHaveProperty('questions')
      
      expect(dimension.questions.length).toBeGreaterThan(0)
      expect(dimension.userScore).toBeGreaterThan(0)
      expect(dimension.userScore).toBeLessThanOrEqual(dimension.maxScore)
    })
  })

  it('should generate valid question data', () => {
    const results = ArtificialResultsService.generateResults(mockUserProfile, completedDate)
    
    results.dimensions.forEach(dimension => {
      dimension.questions.forEach(question => {
        expect(question).toHaveProperty('id')
        expect(question).toHaveProperty('text')
        expect(question).toHaveProperty('userAnswer')
        expect(question).toHaveProperty('averageAnswer')
        expect(question).toHaveProperty('maxAnswer')
        
        expect(question.userAnswer).toBeGreaterThanOrEqual(1)
        expect(question.userAnswer).toBeLessThanOrEqual(5)
        expect(question.averageAnswer).toBeGreaterThan(0)
        expect(question.maxAnswer).toBe(5)
      })
    })
  })

  it('should generate valid overall metrics', () => {
    const results = ArtificialResultsService.generateResults(mockUserProfile, completedDate)
    
    expect(results.overallMetrics).toHaveProperty('totalScore')
    expect(results.overallMetrics).toHaveProperty('averageTotalScore')
    expect(results.overallMetrics).toHaveProperty('maxTotalScore')
    expect(results.overallMetrics).toHaveProperty('percentile')
    expect(results.overallMetrics).toHaveProperty('strongAreas')
    expect(results.overallMetrics).toHaveProperty('improvementAreas')
    
    expect(results.overallMetrics.totalScore).toBeGreaterThan(0)
    expect(results.overallMetrics.percentile).toBeGreaterThanOrEqual(5)
    expect(results.overallMetrics.percentile).toBeLessThanOrEqual(95)
    expect(Array.isArray(results.overallMetrics.strongAreas)).toBe(true)
    expect(Array.isArray(results.overallMetrics.improvementAreas)).toBe(true)
  })

  it('should include user information correctly', () => {
    const results = ArtificialResultsService.generateResults(mockUserProfile, completedDate)
    
    expect(results.user.id).toBe(mockUserProfile.id)
    expect(results.user.name).toBe(mockUserProfile.nombre_persona)
    expect(results.user.company).toBe(mockUserProfile.razon_social)
    expect(results.user.completedDate).toBe(completedDate)
  })

  it('should handle user profile with only razon_social', () => {
    const profileWithoutPersonName: UserProfile = {
      ...mockUserProfile,
      nombre_persona: null
    }
    
    const results = ArtificialResultsService.generateResults(profileWithoutPersonName, completedDate)
    
    expect(results.user.name).toBe(profileWithoutPersonName.razon_social)
  })

  it('should generate results with proper data structure', () => {
    const results = ArtificialResultsService.generateResults(mockUserProfile, completedDate)
    
    expect(results).toHaveProperty('user')
    expect(results).toHaveProperty('dimensions')
    expect(results).toHaveProperty('overallMetrics')
    expect(results).toHaveProperty('generatedAt')
    
    expect(new Date(results.generatedAt)).toBeInstanceOf(Date)
  })
})