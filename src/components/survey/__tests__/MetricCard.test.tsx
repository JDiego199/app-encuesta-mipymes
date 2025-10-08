import { render, screen } from '@testing-library/react'
import { MetricCard } from '../MetricCard'
import { Metric } from '@/types/results'

const mockMetric: Metric = {
  id: 'marco_institucional',
  name: 'Marco Institucional',
  description: 'Políticas públicas, instituciones de apoyo, regulación y coordinación interinstitucional',
  userValue: 16,
  averageValue: 14,
  maxValue: 20,
  unit: ' pts',
  category: 'Entorno Institucional'
}

describe('MetricCard', () => {
  it('renders metric information correctly', () => {
    render(<MetricCard metric={mockMetric} />)
    
    expect(screen.getByText('Marco Institucional')).toBeInTheDocument()
    expect(screen.getByText(/Políticas públicas, instituciones de apoyo/)).toBeInTheDocument()
    expect(screen.getByText('Entorno Institucional')).toBeInTheDocument()
    expect(screen.getByText('16 pts')).toBeInTheDocument()
    expect(screen.getByText('14 pts')).toBeInTheDocument()
  })

  it('shows above average indicator when user score is higher', () => {
    render(<MetricCard metric={mockMetric} />)
    
    expect(screen.getByText(/por encima del promedio/i)).toBeInTheDocument()
  })

  it('shows below average indicator when user score is lower', () => {
    const belowAverageMetric = {
      ...mockMetric,
      userValue: 12,
      averageValue: 16
    }
    
    render(<MetricCard metric={belowAverageMetric} />)
    
    expect(screen.getByText(/por debajo del promedio/i)).toBeInTheDocument()
  })

  it('displays progress bars correctly', () => {
    render(<MetricCard metric={mockMetric} />)
    
    // Check that progress indicators are present
    expect(screen.getByText('Tu progreso')).toBeInTheDocument()
    expect(screen.getByText('Promedio')).toBeInTheDocument()
    expect(screen.getByText('80.0%')).toBeInTheDocument() // 16/20 * 100
    expect(screen.getByText('70.0%')).toBeInTheDocument() // 14/20 * 100
  })
})