import { Card } from '@/components/ui/card'
import { Metric } from '@/types/results'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MetricCardProps {
  metric: Metric
  className?: string
}

export function MetricCard({ metric, className }: MetricCardProps) {
  const { name, description, userValue, averageValue, maxValue, unit, category } = metric
  
  // Calculate percentages for progress bars
  const userPercentage = (userValue / maxValue) * 100
  const averagePercentage = (averageValue / maxValue) * 100
  
  // Determine if user is above, below, or at average
  const comparison = userValue > averageValue ? 'above' : userValue < averageValue ? 'below' : 'equal'
  
  // Get comparison icon and color
  const getComparisonIcon = () => {
    switch (comparison) {
      case 'above':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'below':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }
  
  const getComparisonText = () => {
    const difference = Math.abs(userValue - averageValue)
    const percentageDiff = ((difference / averageValue) * 100).toFixed(1)
    
    switch (comparison) {
      case 'above':
        return `${percentageDiff}% por encima del promedio`
      case 'below':
        return `${percentageDiff}% por debajo del promedio`
      default:
        return 'En el promedio'
    }
  }
  
  const getComparisonColor = () => {
    switch (comparison) {
      case 'above':
        return 'text-green-600'
      case 'below':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-2">
              {category}
            </span>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            {getComparisonIcon()}
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {userValue}{unit}
            </div>
            <div className="text-sm text-gray-600">Tu puntuación</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {averageValue}{unit}
            </div>
            <div className="text-sm text-gray-600">Promedio general</div>
          </div>
        </div>

        {/* Progress bars */}
        <div className="space-y-3">
          {/* User progress bar */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700">Tu progreso</span>
              <span className="text-blue-600 font-medium">{userPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(userPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Average progress bar */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700">Promedio</span>
              <span className="text-gray-600 font-medium">{averagePercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gray-400 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(averagePercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Comparison text */}
        <div className={`text-sm font-medium ${getComparisonColor()} flex items-center space-x-1`}>
          <span>{getComparisonText()}</span>
        </div>
      </div>
    </Card>
  )
}