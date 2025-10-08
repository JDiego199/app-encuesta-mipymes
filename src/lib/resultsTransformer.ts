import { ArtificialResultsData, MetricsData, Metric } from '@/types/results'

/**
 * Transforms artificial results data to the format expected by visualization components
 */
export class ResultsTransformer {
  /**
   * Maps dimension IDs to appropriate categories
   */
  private static getDimensionCategory(dimensionId: string): string {
    const categoryMap: Record<string, string> = {
      'marco_institucional': 'Entorno Institucional',
      'entorno_operativo': 'Entorno Institucional',
      'acceso_financiamiento': 'Recursos y Financiamiento',
      'servicios_desarrollo_empresarial': 'Recursos y Financiamiento',
      'innovacion_tecnologia': 'Innovación y Tecnología',
      'digitalizacion': 'Innovación y Tecnología',
      'transformacion_productiva': 'Desarrollo Productivo',
      'acceso_mercados': 'Desarrollo Productivo'
    }
    
    return categoryMap[dimensionId] || 'Otros'
  }

  /**
   * Transforms ArtificialResultsData to MetricsData format for visualization components
   */
  public static transformToMetricsData(artificialData: ArtificialResultsData): MetricsData {
    // Extract unique categories
    const categorySet = new Set(artificialData.dimensions.map(dim => this.getDimensionCategory(dim.id)))
    const categories = Array.from(categorySet)
    
    // Transform dimensions to metrics
    const metrics: Metric[] = artificialData.dimensions.map(dimension => ({
      id: dimension.id,
      name: dimension.name,
      description: dimension.description,
      userValue: dimension.userScore,
      averageValue: dimension.averageScore,
      maxValue: dimension.maxScore,
      unit: ' pts', // Points unit for scores
      category: this.getDimensionCategory(dimension.id)
    }))

    // Transform overall metrics
    const overallScore = {
      user: artificialData.overallMetrics.totalScore,
      average: artificialData.overallMetrics.averageTotalScore,
      maxScore: artificialData.overallMetrics.maxTotalScore || 
                artificialData.dimensions.reduce((sum, dim) => sum + dim.maxScore, 0)
    }

    return {
      categories,
      metrics,
      overallScore,
      percentile: artificialData.overallMetrics.percentile,
      strongAreas: artificialData.overallMetrics.strongAreas,
      improvementAreas: artificialData.overallMetrics.improvementAreas
    }
  }

  /**
   * Creates sample metrics data for testing purposes using the new dimensions
   */
  public static createSampleMetricsData(): MetricsData {
    const sampleMetrics: Metric[] = [
      {
        id: 'marco_institucional',
        name: 'Marco Institucional',
        description: 'Políticas públicas, instituciones de apoyo, regulación y coordinación interinstitucional',
        userValue: 16,
        averageValue: 14.2,
        maxValue: 20,
        unit: ' pts',
        category: 'Entorno Institucional'
      },
      {
        id: 'entorno_operativo',
        name: 'Entorno Operativo / Simplificación de Procedimientos',
        description: 'Trámites en línea, tiempo y costo de procesos, carga regulatoria y digitalización administrativa',
        userValue: 14,
        averageValue: 13.8,
        maxValue: 20,
        unit: ' pts',
        category: 'Entorno Institucional'
      },
      {
        id: 'acceso_financiamiento',
        name: 'Acceso al Financiamiento',
        description: 'Oferta financiera local, requisitos, programas públicos/privados y educación financiera',
        userValue: 12,
        averageValue: 14.5,
        maxValue: 20,
        unit: ' pts',
        category: 'Recursos y Financiamiento'
      },
      {
        id: 'servicios_desarrollo_empresarial',
        name: 'Servicios de Desarrollo Empresarial (SDE) y Compras Públicas',
        description: 'Capacitación, asesoría, acceso a compras públicas, asistencia técnica y redes empresariales',
        userValue: 15,
        averageValue: 15.1,
        maxValue: 20,
        unit: ' pts',
        category: 'Recursos y Financiamiento'
      },
      {
        id: 'innovacion_tecnologia',
        name: 'Innovación y Tecnología',
        description: 'Adopción digital, inversión en I+D, vinculación universitaria y transformación digital interna',
        userValue: 18,
        averageValue: 13.9,
        maxValue: 20,
        unit: ' pts',
        category: 'Innovación y Tecnología'
      },
      {
        id: 'digitalizacion',
        name: 'Digitalización',
        description: 'Integración de herramientas digitales en la gestión empresarial',
        userValue: 17,
        averageValue: 12.8,
        maxValue: 20,
        unit: ' pts',
        category: 'Innovación y Tecnología'
      },
      {
        id: 'transformacion_productiva',
        name: 'Transformación Productiva',
        description: 'Diversificación, eficiencia operativa, sostenibilidad y adaptación al mercado',
        userValue: 16,
        averageValue: 15.3,
        maxValue: 20,
        unit: ' pts',
        category: 'Desarrollo Productivo'
      },
      {
        id: 'acceso_mercados',
        name: 'Acceso a Mercados e Internacionalización',
        description: 'Presencia local, exportación, marketing digital y alianzas comerciales',
        userValue: 13,
        averageValue: 14.7,
        maxValue: 20,
        unit: ' pts',
        category: 'Desarrollo Productivo'
      }
    ]

    const categories = ['Entorno Institucional', 'Recursos y Financiamiento', 'Innovación y Tecnología', 'Desarrollo Productivo']
    
    const totalUserScore = sampleMetrics.reduce((sum, metric) => sum + metric.userValue, 0)
    const totalAverageScore = sampleMetrics.reduce((sum, metric) => sum + metric.averageValue, 0)
    const totalMaxScore = sampleMetrics.reduce((sum, metric) => sum + metric.maxValue, 0)

    return {
      categories,
      metrics: sampleMetrics,
      overallScore: {
        user: totalUserScore,
        average: totalAverageScore,
        maxScore: totalMaxScore
      },
      percentile: 72,
      strongAreas: ['Innovación y Tecnología', 'Digitalización', 'Transformación Productiva'],
      improvementAreas: ['Acceso al Financiamiento', 'Acceso a Mercados e Internacionalización']
    }
  }
}