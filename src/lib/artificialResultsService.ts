import { ArtificialResultsData, SurveyDimension, SurveyQuestion, OverallMetrics, UserProfile } from '@/types/results'

/**
 * Service for generating artificial survey results data
 * Generates consistent, user-specific data that varies but remains stable per user
 */
export class ArtificialResultsService {
  private static readonly DIMENSIONS_CONFIG = [
    {
      id: 'marco_institucional',
      name: 'Marco Institucional',
      description: 'Políticas públicas, instituciones de apoyo, regulación y coordinación interinstitucional',
      questions: [
        'Políticas públicas locales y provinciales de fomento productivo y digitalización',
        'Instituciones de apoyo empresarial (Cámaras, universidades, GADs)',
        'Regulación y normativas para registro, licencias y tributación',
        'Coordinación interinstitucional entre ESPOCH, Universidad Indoamérica, cámaras y municipios'
      ]
    },
    {
      id: 'entorno_operativo',
      name: 'Entorno Operativo / Simplificación de Procedimientos',
      description: 'Trámites en línea, tiempo y costo de procesos, carga regulatoria y digitalización administrativa',
      questions: [
        'Trámites en línea y ventanilla única disponibles para MIPYMES',
        'Tiempo y costo de trámites para permisos, licencias y registros comerciales',
        'Percepción sobre barreras burocráticas que afectan la operación',
        'Adopción de sistemas municipales o estatales digitales para procesos'
      ]
    },
    {
      id: 'acceso_financiamiento',
      name: 'Acceso al Financiamiento',
      description: 'Oferta financiera local, requisitos, programas públicos/privados y educación financiera',
      questions: [
        'Disponibilidad de créditos para MIPYMES en cooperativas y bancos regionales',
        'Dificultad para cumplir requisitos y garantías de acceso',
        'Conocimiento y acceso a fondos concursables, capital semilla y líneas de crédito productivo',
        'Nivel de capacitación en planificación financiera y gestión de deuda'
      ]
    },
    {
      id: 'servicios_desarrollo_empresarial',
      name: 'Servicios de Desarrollo Empresarial (SDE) y Compras Públicas',
      description: 'Capacitación, asesoría, acceso a compras públicas, asistencia técnica y redes empresariales',
      questions: [
        'Disponibilidad de programas de fortalecimiento empresarial en Riobamba y Ambato',
        'Participación de MIPYMES locales en procesos del portal del SERCOP',
        'Programas específicos para comercio, manufactura, turismo y agroindustria',
        'Existencia de redes, asociaciones o clústeres locales'
      ]
    },
    {
      id: 'innovacion_tecnologia',
      name: 'Innovación y Tecnología',
      description: 'Adopción digital, inversión en I+D, vinculación universitaria y transformación digital interna',
      questions: [
        'Uso de BI, analítica de datos, comercio electrónico y ERP',
        'Capacidad para desarrollar nuevos productos o procesos (I+D)',
        'Proyectos conjuntos de innovación con ESPOCH y otras instituciones',
        'Automatización de procesos y digitalización de la gestión interna'
      ]
    },
    {
      id: 'transformacion_productiva',
      name: 'Transformación Productiva',
      description: 'Diversificación, eficiencia operativa, sostenibilidad y adaptación al mercado',
      questions: [
        'Cambio hacia productos/servicios con mayor valor agregado',
        'Optimización de procesos productivos y logísticos',
        'Incorporación de prácticas ecoeficientes y economía circular',
        'Capacidad de respuesta ante variaciones en demanda y tendencias del mercado'
      ]
    },
    {
      id: 'acceso_mercados',
      name: 'Acceso a Mercados e Internacionalización',
      description: 'Presencia local, exportación, marketing digital y alianzas comerciales',
      questions: [
        'Posicionamiento en ferias, plataformas y canales regionales',
        'Participación en mercados internacionales y cumplimiento de estándares',
        'Estrategias online para captar clientes fuera de la zona',
        'Vinculación con distribuidores, clientes corporativos y redes internacionales'
      ]
    },
    {
      id: 'digitalizacion',
      name: 'Digitalización',
      description: 'Integración de herramientas digitales en la gestión empresarial',
      questions: [
        'Nivel de adopción de sistemas de gestión (ERP, CRM, POS)',
        'Comercio electrónico y marketing digital (ventas online, redes sociales, publicidad digital)',
        'Implementación de medidas de ciberseguridad',
        'Capacitación en competencias digitales del personal'
      ]
    }
  ]

  /**
   * Generates a pseudo-random number based on a seed (user ID)
   * This ensures consistent results for the same user
   */
  private static seededRandom(seed: string, index: number = 0): number {
    const hash = this.hashString(seed + index.toString())
    return (hash % 1000) / 1000
  }

  /**
   * Simple hash function for string to number conversion
   */
  private static hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  /**
   * Generates a score within a range based on seeded random
   */
  private static generateScore(
    userId: string, 
    dimensionId: string, 
    questionIndex: number,
    min: number = 1,
    max: number = 5
  ): number {
    const seed = `${userId}_${dimensionId}_${questionIndex}`
    const random = this.seededRandom(seed)
    
    // Apply some bias towards middle-high scores (more realistic)
    const biasedRandom = Math.pow(random, 0.7)
    
    return Math.round(min + (biasedRandom * (max - min)))
  }

  /**
   * Generates average scores that are consistent across all users
   */
  private static generateAverageScore(dimensionId: string, questionIndex: number): number {
    const seed = `avg_${dimensionId}_${questionIndex}`
    const random = this.seededRandom(seed)
    
    // Average scores tend to be in the middle range (2.5-4.0)
    return Math.round(25 + (random * 15)) / 10 // Results in 2.5-4.0 range
  }

  /**
   * Generates artificial survey results for a specific user
   */
  public static generateResults(
    userProfile: UserProfile,
    completedDate: string
  ): ArtificialResultsData {
    const dimensions: SurveyDimension[] = this.DIMENSIONS_CONFIG.map((config, dimIndex) => {
      const questions: SurveyQuestion[] = config.questions.map((questionText, qIndex) => {
        const userAnswer = this.generateScore(userProfile.id, config.id, qIndex, 1, 5)
        const averageAnswer = this.generateAverageScore(config.id, qIndex)
        
        return {
          id: `${config.id}_q${qIndex + 1}`,
          text: questionText,
          userAnswer,
          averageAnswer,
          maxAnswer: 5
        }
      })

      // Calculate dimension scores
      const userScore = questions.reduce((sum, q) => sum + q.userAnswer, 0)
      const averageScore = Math.round(questions.reduce((sum, q) => sum + q.averageAnswer, 0) * 10) / 10
      const maxScore = questions.length * 5

      return {
        id: config.id,
        name: config.name,
        description: config.description,
        userScore,
        averageScore,
        maxScore,
        questions
      }
    })

    // Calculate overall metrics
    const overallMetrics = this.calculateOverallMetrics(dimensions, userProfile.id)

    return {
      user: {
        id: userProfile.id,
        name: userProfile.nombre_persona || userProfile.razon_social,
        company: userProfile.razon_social,
        completedDate
      },
      dimensions,
      overallMetrics,
      generatedAt: new Date().toISOString()
    }
  }

  /**
   * Calculates overall metrics based on dimension scores
   */
  private static calculateOverallMetrics(
    dimensions: SurveyDimension[],
    userId: string
  ): OverallMetrics {
    const totalScore = dimensions.reduce((sum, dim) => sum + dim.userScore, 0)
    const averageTotalScore = Math.round(dimensions.reduce((sum, dim) => sum + dim.averageScore, 0) * 10) / 10
    const maxTotalScore = dimensions.reduce((sum, dim) => sum + dim.maxScore, 0)

    // Calculate percentile based on comparison with average
    const percentile = Math.min(95, Math.max(5, Math.round((totalScore / maxTotalScore) * 100)))

    // Identify strong areas (above average) and improvement areas (below average)
    const strongAreas: string[] = []
    const improvementAreas: string[] = []

    dimensions.forEach(dim => {
      const userPercentage = (dim.userScore / dim.maxScore) * 100
      const avgPercentage = (dim.averageScore / dim.maxScore) * 100
      
      if (userPercentage > avgPercentage + 5) {
        strongAreas.push(dim.name)
      } else if (userPercentage < avgPercentage - 5) {
        improvementAreas.push(dim.name)
      }
    })

    // Ensure we have at least some areas identified
    if (strongAreas.length === 0) {
      // Find the highest scoring dimension
      const bestDimension = dimensions.reduce((best, current) => 
        (current.userScore / current.maxScore) > (best.userScore / best.maxScore) ? current : best
      )
      strongAreas.push(bestDimension.name)
    }

    if (improvementAreas.length === 0) {
      // Find the lowest scoring dimension
      const worstDimension = dimensions.reduce((worst, current) => 
        (current.userScore / current.maxScore) < (worst.userScore / worst.maxScore) ? current : worst
      )
      improvementAreas.push(worstDimension.name)
    }

    return {
      totalScore,
      averageTotalScore,
      maxTotalScore,
      percentile,
      strongAreas: strongAreas.slice(0, 3), // Limit to top 3
      improvementAreas: improvementAreas.slice(0, 3) // Limit to top 3
    }
  }

  /**
   * Gets cached results or generates new ones
   * In a real implementation, this would check a cache/database
   */
  public static getOrGenerateResults(
    userProfile: UserProfile,
    completedDate: string
  ): ArtificialResultsData {
    // For now, always generate fresh results
    // In a real implementation, you might want to cache these results
    return this.generateResults(userProfile, completedDate)
  }
}