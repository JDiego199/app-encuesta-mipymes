import { MetricsData } from '@/types/results'
import { MetricCard } from './MetricCard'
import { ComparisonChart } from './ComparisonChart'
import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Award, Target } from 'lucide-react'

interface ResultsMetricsProps {
  metricsData: MetricsData
  className?: string
}

export function ResultsMetrics({ metricsData, className }: ResultsMetricsProps) {
  const { metrics, categories, overallScore, percentile, strongAreas, improvementAreas } = metricsData

  // Group metrics by category
  const metricsByCategory = categories.reduce((acc, category) => {
    acc[category] = metrics.filter(metric => metric.category === category)
    return acc
  }, {} as Record<string, typeof metrics>)

  // Calculate overall performance indicator
  const overallPerformance = overallScore.user > overallScore.average ? 'above' : 
                            overallScore.user < overallScore.average ? 'below' : 'equal'

  const getPerformanceColor = () => {
    switch (overallPerformance) {
      case 'above':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'below':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getPerformanceIcon = () => {
    switch (overallPerformance) {
      case 'above':
        return <TrendingUp className="h-6 w-6" />
      case 'below':
        return <TrendingDown className="h-6 w-6" />
      default:
        return <Award className="h-6 w-6" />
    }
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Overall Score Summary */}
      <Card className="p-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Resumen General</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Score */}
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">
                {overallScore.user}/{overallScore.maxScore}
              </div>
              <div className="text-sm text-gray-600">Tu Puntuación Total</div>
            </div>

            {/* Percentile */}
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-600">
                {percentile}%
              </div>
              <div className="text-sm text-gray-600">Percentil</div>
              <div className="text-xs text-gray-500">
                Mejor que el {percentile}% de participantes
              </div>
            </div>

            {/* Performance Indicator */}
            <div className={`p-4 rounded-lg border ${getPerformanceColor()}`}>
              <div className="flex items-center justify-center space-x-2 mb-2">
                {getPerformanceIcon()}
                <span className="font-semibold">
                  {overallPerformance === 'above' ? 'Por Encima del Promedio' :
                   overallPerformance === 'below' ? 'Por Debajo del Promedio' :
                   'En el Promedio'}
                </span>
              </div>
              <div className="text-sm">
                Promedio general: {overallScore.average}/{overallScore.maxScore}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Strong Areas and Improvement Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strong Areas */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Áreas Fuertes</h3>
          </div>
          <div className="space-y-2">
            {strongAreas.length > 0 ? (
              strongAreas.map((area, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{area}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">
                No se identificaron áreas particularmente fuertes
              </p>
            )}
          </div>
        </Card>

        {/* Improvement Areas */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Áreas de Mejora</h3>
          </div>
          <div className="space-y-2">
            {improvementAreas.length > 0 ? (
              improvementAreas.map((area, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{area}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">
                No se identificaron áreas específicas de mejora
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Visual Comparison Chart */}
      <ComparisonChart 
        metrics={metrics}
        chartType="bar"
        title="Comparación Visual de Todas las Métricas"
        className="mb-8"
      />

      {/* Metrics by Category */}
      {categories.map(category => {
        const categoryMetrics = metricsByCategory[category]
        if (!categoryMetrics || categoryMetrics.length === 0) return null

        return (
          <div key={category} className="space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h3 className="text-xl font-semibold text-gray-900">{category}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {categoryMetrics.length} métrica{categoryMetrics.length !== 1 ? 's' : ''} en esta categoría
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {categoryMetrics.map(metric => (
                <MetricCard 
                  key={metric.id} 
                  metric={metric}
                />
              ))}
            </div>

            {/* Category-specific chart if more than 2 metrics */}
            {categoryMetrics.length > 2 && (
              <ComparisonChart 
                metrics={categoryMetrics}
                chartType="radar"
                title={`Análisis Detallado - ${category}`}
                className="mt-6"
              />
            )}
          </div>
        )
      })}



      {/* Global Radar Chart - Comparison of All Dimensions */}
      {categories.length > 1 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-center text-gray-900 mb-4">
            Comparativo General entre Dimensiones
          </h3>
          <div className="w-full h-[400px]">
            <ComparisonChart
              metrics={categories.map(cat => {
                const dimMetrics = metricsByCategory[cat];
                const totalUser = dimMetrics.reduce((sum, m) => sum + m.userValue, 0);
                const totalAvg = dimMetrics.reduce((sum, m) => sum + m.averageValue, 0);
                const totalMax = dimMetrics.reduce((sum, m) => sum + m.maxValue, 0);

                return {
                  id: `dim_${cat}`,
                  name: cat,
                  category: cat,
                  userValue: +(totalUser / dimMetrics.length).toFixed(1),
                  averageValue: +(totalAvg / dimMetrics.length).toFixed(1),
                  maxValue: +(totalMax / dimMetrics.length).toFixed(1),
                  description: `Comparativo general de la dimensión ${cat}`,
                  
                };
              })}
              chartType="radar"
              title="Análisis Comparativo de Dimensiones Principales"
              className="mt-4"
            />
          </div>
        </Card>
      )}





      {/* Additional Insights */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Insights Adicionales</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>
            • Tu puntuación total de <strong>{overallScore.user}</strong> te coloca en el percentil <strong>{percentile}</strong>
          </p>
          <p>
            • Tienes <strong>{strongAreas.length}</strong> área{strongAreas.length !== 1 ? 's' : ''} fuerte{strongAreas.length !== 1 ? 's' : ''} identificada{strongAreas.length !== 1 ? 's' : ''}
          </p>
          <p>
            • Se identificaron <strong>{improvementAreas.length}</strong> área{improvementAreas.length !== 1 ? 's' : ''} de oportunidad para el desarrollo
          </p>
          <p>
            • El análisis incluye <strong>{metrics.length}</strong> métricas distribuidas en <strong>{categories.length}</strong> categorías
          </p>
        </div>
      </Card>
    </div>
  )
}