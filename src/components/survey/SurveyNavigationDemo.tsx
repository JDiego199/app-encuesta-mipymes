import React, { useState } from 'react'
import { SurveyNavigation } from './SurveyNavigation'

export function SurveyNavigationDemo() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const totalQuestions = 5

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleNext = () => {
    setIsSaving(true)
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false)
      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex(currentIndex + 1)
      }
    }, 1000)
  }

  const handleFinish = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      alert('Encuesta finalizada!')
    }, 1000)
  }

  const canGoNext = true // In real implementation, this would depend on question validation
  const canGoPrevious = currentIndex > 0
  const isLastQuestion = currentIndex === totalQuestions - 1

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-bidata-dark mb-4">
          Demo: Navegación de Encuesta
        </h2>
        
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-bidata-dark mb-2">
            Pregunta {currentIndex + 1}
          </h3>
          <p className="text-bidata-gray">
            Esta es una pregunta de demostración para mostrar la navegación.
          </p>
        </div>

        <SurveyNavigation
          currentIndex={currentIndex}
          totalQuestions={totalQuestions}
          canGoNext={canGoNext}
          canGoPrevious={canGoPrevious}
          isLastQuestion={isLastQuestion}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onFinish={handleFinish}
          isSaving={isSaving}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">Estado Actual:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>Pregunta actual: {currentIndex + 1}</li>
          <li>Total preguntas: {totalQuestions}</li>
          <li>Puede ir atrás: {canGoPrevious ? 'Sí' : 'No'}</li>
          <li>Puede ir adelante: {canGoNext ? 'Sí' : 'No'}</li>
          <li>Es última pregunta: {isLastQuestion ? 'Sí' : 'No'}</li>
          <li>Guardando: {isSaving ? 'Sí' : 'No'}</li>
        </ul>
      </div>
    </div>
  )
}