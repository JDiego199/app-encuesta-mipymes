// Results dashboard types

export interface Metric {
  id: string
  name: string
  description: string
  userValue: number
  averageValue: number
  maxValue: number
  unit: string
  category: string
}

export interface MetricsData {
  categories: string[]
  metrics: Metric[]
  overallScore: {
    user: number
    average: number
    maxScore: number
  }
  percentile: number
  strongAreas: string[]
  improvementAreas: string[]
}

export interface SurveyQuestion {
  id: string
  text: string
  userAnswer: number
  averageAnswer: number
  maxAnswer?: number
}

export interface SurveyDimension {
  id: string
  name: string
  description: string
  userScore: number
  averageScore: number
  maxScore: number
  subdimensions: string[]
}

export interface OverallMetrics {
  totalScore: number
  averageTotalScore: number
  maxTotalScore?: number
  percentile: number
  strongAreas: string[]
  improvementAreas: string[]
}

export interface UserProfile {
  id: string
  nombre_persona?: string
  razon_social?: string
  ruc?: string
  ciudad?: string
}

export interface ArtificialResultsData {
  user: {
    id: string
    name: string
    company: string
    completedDate: string
  }
  dimensions: SurveyDimension[]
  overallMetrics: OverallMetrics
  generatedAt?: string
}