import { ResultsTransformer } from '../resultsTransformer'
import { ArtificialResultsData } from '@/types/results'

const mockArtificialData: ArtificialResultsData = {
  user: {
    id: 'test-user-123',
    name: 'Test User',
    company: 'Test Company',
    completedDate: '2024-01-15T10:30:00Z'
  },
  dimensions: [
    {
      id: 'marco_institucional',
      name: 'Marco Institucional',
      description: 'Políticas públicas, instituciones de apoyo, regulación y coordinación interinstitucional',
      userScore: 16,
      averageScore: 14.2,
      maxScore: 20,
      questions: [
        {
          id: 'marco_institucional_q1',
          text: 'Políticas públicas locales y provinciales',
          userAnswer: 4,
          averageAnswer: 3.5
        }
      ]
    },
    {
      id: 'digitalizacion',
      name: 'Digitalización',
      description: 'Integración de herramientas digitales en la gestión empresarial',
      userScore: 18,
      averageScore: 13.8,
      maxScore: 20,
      questions: [
        {
          id: 'digitalizacion_q1',
          text: 'Nivel de adopción de sistemas de gestión',
          userAnswer: 5,
          averageAnswer: 3.2
        }
      ]
    }
  ],
  overallMetrics: {
    totalScore: 34,
    averageTotalScore: 28.0,
    percentile: 75,
    strongAreas: ['Digitalización'],
    improvementAreas: ['Marco Institucional']
  }
}

describe('ResultsTransformer', () => {
  describe('transformToMetricsData', () => {
    it('transforms artificial data to metrics format correctly', () => {
      const result = ResultsTransformer.transformToMetricsData(mockArtificialData)
      
      expect(result.metrics).toHaveLength(2)
      expect(result.categories).toContain('Entorno Institucional')
      expect(result.categories).toContain('Innovación y Tecnología')
      
      const marcoMetric = result.metrics.find(m => m.id === 'marco_institucional')
      expect(marcoMetric).toBeDefined()
      expect(marcoMetric?.name).toBe('Marco Institucional')
      expect(marcoMetric?.userValue).toBe(16)
      expect(marcoMetric?.averageValue).toBe(14.2)
      expect(marcoMetric?.maxValue).toBe(20)
      expect(marcoMetric?.unit).toBe(' pts')
      expect(marcoMetric?.category).toBe('Entorno Institucional')
    })

    it('transforms overall metrics correctly', () => {
      const result = ResultsTransformer.transformToMetricsData(mockArtificialData)
      
      expect(result.overallScore.user).toBe(34)
      expect(result.overallScore.average).toBe(28.0)
      expect(result.percentile).toBe(75)
      expect(result.strongAreas).toContain('Digitalización')
      expect(result.improvementAreas).toContain('Marco Institucional')
    })
  })

  describe('createSampleMetricsData', () => {
    it('creates sample data with all 8 dimensions', () => {
      const result = ResultsTransformer.createSampleMetricsData()
      
      expect(result.metrics).toHaveLength(8)
      expect(result.categories).toHaveLength(4)
      
      // Check that all expected categories are present
      expect(result.categories).toContain('Entorno Institucional')
      expect(result.categories).toContain('Recursos y Financiamiento')
      expect(result.categories).toContain('Innovación y Tecnología')
      expect(result.categories).toContain('Desarrollo Productivo')
      
      // Check that all dimensions are present
      const dimensionIds = result.metrics.map(m => m.id)
      expect(dimensionIds).toContain('marco_institucional')
      expect(dimensionIds).toContain('entorno_operativo')
      expect(dimensionIds).toContain('acceso_financiamiento')
      expect(dimensionIds).toContain('servicios_desarrollo_empresarial')
      expect(dimensionIds).toContain('innovacion_tecnologia')
      expect(dimensionIds).toContain('digitalizacion')
      expect(dimensionIds).toContain('transformacion_productiva')
      expect(dimensionIds).toContain('acceso_mercados')
    })

    it('has consistent data structure', () => {
      const result = ResultsTransformer.createSampleMetricsData()
      
      result.metrics.forEach(metric => {
        expect(metric.id).toBeDefined()
        expect(metric.name).toBeDefined()
        expect(metric.description).toBeDefined()
        expect(metric.userValue).toBeGreaterThan(0)
        expect(metric.averageValue).toBeGreaterThan(0)
        expect(metric.maxValue).toBe(20)
        expect(metric.unit).toBe(' pts')
        expect(metric.category).toBeDefined()
      })
      
      expect(result.overallScore.user).toBeGreaterThan(0)
      expect(result.overallScore.average).toBeGreaterThan(0)
      expect(result.overallScore.maxScore).toBe(160) // 8 dimensions * 20 points each
      expect(result.percentile).toBeGreaterThan(0)
      expect(result.percentile).toBeLessThanOrEqual(100)
    })
  })
})