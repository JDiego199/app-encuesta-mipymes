import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SurveyNavigation } from '../SurveyNavigation'

describe('SurveyNavigation', () => {
  const defaultProps = {
    currentIndex: 0,
    totalQuestions: 5,
    canGoNext: true,
    canGoPrevious: false,
    isLastQuestion: false,
    onPrevious: vi.fn(),
    onNext: vi.fn(),
    onFinish: vi.fn(),
    isSaving: false
  }

  it('renders progress indicator correctly', () => {
    render(<SurveyNavigation {...defaultProps} />)
    
    expect(screen.getByText('Pregunta 1 de 5')).toBeInTheDocument()
    expect(screen.getByText('20% completado')).toBeInTheDocument()
  })

  it('disables previous button on first question', () => {
    render(<SurveyNavigation {...defaultProps} />)
    
    const previousButton = screen.getByRole('button', { name: /anterior/i })
    expect(previousButton).toBeDisabled()
  })

  it('enables previous button when not on first question', () => {
    render(<SurveyNavigation {...defaultProps} currentIndex={1} canGoPrevious={true} />)
    
    const previousButton = screen.getByRole('button', { name: /anterior/i })
    expect(previousButton).not.toBeDisabled()
  })

  it('shows next button when not on last question', () => {
    render(<SurveyNavigation {...defaultProps} />)
    
    expect(screen.getByRole('button', { name: /siguiente/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /finalizar encuesta/i })).not.toBeInTheDocument()
  })

  it('shows finish button on last question', () => {
    render(<SurveyNavigation {...defaultProps} isLastQuestion={true} />)
    
    expect(screen.getByRole('button', { name: /finalizar encuesta/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /siguiente/i })).not.toBeInTheDocument()
  })

  it('disables next button when canGoNext is false', () => {
    render(<SurveyNavigation {...defaultProps} canGoNext={false} />)
    
    const nextButton = screen.getByRole('button', { name: /siguiente/i })
    expect(nextButton).toBeDisabled()
  })

  it('shows required field message when canGoNext is false', () => {
    render(<SurveyNavigation {...defaultProps} canGoNext={false} />)
    
    expect(screen.getByText('* Complete la pregunta obligatoria para continuar')).toBeInTheDocument()
  })

  it('shows saving indicator when isSaving is true', () => {
    render(<SurveyNavigation {...defaultProps} isSaving={true} />)
    
    expect(screen.getByText('Guardando...')).toBeInTheDocument()
    expect(screen.getByText('Sus respuestas se guardan automáticamente')).toBeInTheDocument()
  })

  it('calls onPrevious when previous button is clicked', () => {
    const onPrevious = vi.fn()
    render(<SurveyNavigation {...defaultProps} currentIndex={1} canGoPrevious={true} onPrevious={onPrevious} />)
    
    fireEvent.click(screen.getByRole('button', { name: /anterior/i }))
    expect(onPrevious).toHaveBeenCalledTimes(1)
  })

  it('calls onNext when next button is clicked', () => {
    const onNext = vi.fn()
    render(<SurveyNavigation {...defaultProps} onNext={onNext} />)
    
    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }))
    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it('calls onFinish when finish button is clicked', () => {
    const onFinish = vi.fn()
    render(<SurveyNavigation {...defaultProps} isLastQuestion={true} onFinish={onFinish} />)
    
    fireEvent.click(screen.getByRole('button', { name: /finalizar encuesta/i }))
    expect(onFinish).toHaveBeenCalledTimes(1)
  })

  it('calculates progress percentage correctly', () => {
    render(<SurveyNavigation {...defaultProps} currentIndex={2} totalQuestions={10} />)
    
    expect(screen.getByText('Pregunta 3 de 10')).toBeInTheDocument()
    expect(screen.getByText('30% completado')).toBeInTheDocument()
  })
})