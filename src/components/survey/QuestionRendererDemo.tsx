import React, { useState } from 'react'
import { QuestionRenderer } from './QuestionRenderer'
import { SurveyQuestion } from '@/types/survey'

// Demo questions for testing
const demoQuestions: SurveyQuestion[] = [
  {
    id: '1',
    survey_id: 'demo',
    question_text: '¿Cuál es su nombre completo?',
    question_type: 'text',
    is_required: true,
    order_index: 1
  },
  {
    id: '2',
    survey_id: 'demo',
    question_text: 'Describa brevemente su experiencia con nuestra empresa',
    question_type: 'textarea',
    is_required: false,
    order_index: 2
  },
  {
    id: '3',
    survey_id: 'demo',
    question_text: '¿Cuál es su género?',
    question_type: 'radio',
    options: ['Masculino', 'Femenino', 'Otro', 'Prefiero no decir'],
    is_required: true,
    order_index: 3
  },
  {
    id: '4',
    survey_id: 'demo',
    question_text: '¿Qué servicios ha utilizado? (Seleccione todos los que apliquen)',
    question_type: 'checkbox',
    options: ['Consultoría', 'Capacitación', 'Auditoría', 'Soporte técnico', 'Otros'],
    is_required: false,
    order_index: 4
  },
  {
    id: '5',
    survey_id: 'demo',
    question_text: '¿En qué rango se encuentra su edad?',
    question_type: 'select',
    options: ['18-25', '26-35', '36-45', '46-55', '56-65', 'Más de 65'],
    is_required: true,
    order_index: 5
  },
  {
    id: '6',
    survey_id: 'demo',
    question_text: 'En una escala del 1 al 10, ¿qué tan probable es que recomiende nuestros servicios?',
    question_type: 'scale',
    options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    is_required: true,
    order_index: 6
  },
  {
    id: '7',
    survey_id: 'demo',
    question_text: '¿Qué tan satisfecho está con la calidad de nuestro servicio?',
    question_type: 'likert',
    likert_config: {
      scale_points: 5,
      left_label: 'Muy insatisfecho',
      right_label: 'Muy satisfecho',
      middle_label: 'Neutral'
    },
    is_required: true,
    order_index: 7
  },
  {
    id: '8',
    survey_id: 'demo',
    question_text: '¿Cuántos años de experiencia tiene en su área?',
    question_type: 'number',
    is_required: false,
    order_index: 8
  }
]

export function QuestionRendererDemo() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})

  const currentQuestion = demoQuestions[currentQuestionIndex]

  const handleResponseChange = (value: any) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }))
  }

  const goToNext = () => {
    if (currentQuestionIndex < demoQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-bidata-dark mb-2">
              Demo: Componente QuestionRenderer
            </h1>
            <div className="flex items-center justify-between text-sm text-bidata-gray">
              <span>Pregunta {currentQuestionIndex + 1} de {demoQuestions.length}</span>
              <div className="w-48 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-bidata-cyan h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / demoQuestions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <QuestionRenderer
              question={currentQuestion}
              value={responses[currentQuestion.id]}
              onChange={handleResponseChange}
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={goToPrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 border border-bidata-cyan text-bidata-cyan rounded-lg hover:bg-bidata-cyan hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>

            <div className="text-sm text-bidata-gray">
              Tipo: <span className="font-medium">{currentQuestion.question_type}</span>
            </div>

            <button
              onClick={goToNext}
              disabled={currentQuestionIndex === demoQuestions.length - 1}
              className="px-6 py-2 bg-bidata-cyan text-white rounded-lg hover:bg-bidata-cyan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestionIndex === demoQuestions.length - 1 ? 'Finalizar' : 'Siguiente'}
            </button>
          </div>

          {/* Debug info */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-bidata-dark mb-2">Respuestas actuales:</h3>
            <pre className="text-xs text-bidata-gray overflow-auto">
              {JSON.stringify(responses, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}