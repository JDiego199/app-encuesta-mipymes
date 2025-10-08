import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line
} from 'recharts'
import { Metric } from '@/types/results'
import { Card } from '@/components/ui/card'

interface ComparisonChartProps {
  metrics: Metric[]
  chartType?: 'bar' | 'radar' | 'line'
  title?: string
  className?: string
}

export function ComparisonChart({ 
  metrics, 
  chartType = 'bar', 
  title,
  className 
}: ComparisonChartProps) {
  
  // Transform metrics data for charts
  const chartData = metrics.map(metric => ({
    name: metric.name.length > 15 ? `${metric.name.substring(0, 15)}...` : metric.name,
    fullName: metric.name,
    usuario: metric.userValue,
    promedio: metric.averageValue,
    maximo: metric.maxValue,
    category: metric.category,
    unit: metric.unit
  }))

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{data.fullName}</p>
          <div className="space-y-1">
            <p className="text-blue-600">
              <span className="font-medium">Tu puntuación:</span> {data.usuario}{data.unit}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Promedio:</span> {data.promedio}{data.unit}
            </p>
            <p className="text-gray-400">
              <span className="font-medium">Máximo:</span> {data.maximo}{data.unit}
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-2 px-2 py-1 bg-gray-100 rounded">
            {data.category}
          </p>
        </div>
      )
    }
    return null
  }

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
          interval={0}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="usuario" 
          fill="#3b82f6" 
          name="Tu puntuación"
          radius={[2, 2, 0, 0]}
        />
        <Bar 
          dataKey="promedio" 
          fill="#9ca3af" 
          name="Promedio general"
          radius={[2, 2, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )

  const renderRadarChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={chartData} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
        <PolarGrid stroke="#f0f0f0" />
        <PolarAngleAxis 
          dataKey="name" 
          tick={{ fontSize: 11, fill: '#374151' }}
        />
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, 'dataMax']} 
          tick={{ fontSize: 10, fill: '#6b7280' }}
        />
        <Radar
          name="Tu puntuación"
          dataKey="usuario"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.3}
          strokeWidth={2}
        />
        <Radar
          name="Promedio general"
          dataKey="promedio"
          stroke="#9ca3af"
          fill="#9ca3af"
          fillOpacity={0.1}
          strokeWidth={2}
          strokeDasharray="5 5"
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  )

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
          interval={0}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="usuario" 
          stroke="#3b82f6" 
          strokeWidth={3}
          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
          name="Tu puntuación"
        />
        <Line 
          type="monotone" 
          dataKey="promedio" 
          stroke="#9ca3af" 
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ fill: '#9ca3af', strokeWidth: 2, r: 3 }}
          name="Promedio general"
        />
      </LineChart>
    </ResponsiveContainer>
  )

  const renderChart = () => {
    switch (chartType) {
      case 'radar':
        return renderRadarChart()
      case 'line':
        return renderLineChart()
      default:
        return renderBarChart()
    }
  }

  return (
    <Card className={`p-6 ${className}`}>
      {title && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">
            Comparación entre tu desempeño y el promedio general
          </p>
        </div>
      )}
      
      <div className="w-full">
        {renderChart()}
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-600 rounded"></div>
          <span className="text-sm text-gray-700">Tu puntuación</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-400 rounded"></div>
          <span className="text-sm text-gray-700">Promedio general</span>
        </div>
      </div>
    </Card>
  )
}