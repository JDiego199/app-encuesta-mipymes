import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { QuestionRenderer } from '@/components/survey/QuestionRenderer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, CheckCircle, Target, Loader2 } from 'lucide-react'
import { useInternalSurvey } from '@/hooks/useInternalSurvey'
import { toast } from 'sonner'

// Import real survey questions from Excel
import { surveyQuestions } from '@/data/survey-questions'

export function InternalSurveyPage() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [isCompleted, setIsCompleted] = useState(false)
  
  // Use the internal survey hook
  const {
    participant,
    currentQuestionIndex,
    responses,
    isLoading,
    error,
    saveResponse,
    goToNext: hookGoToNext,
    goToPrevious,
    completeSurvey,
    loadParticipantData
  } = useInternalSurvey(surveyQuestions)

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
  }, [user, navigate])

  const currentQuestion = surveyQuestions[currentQuestionIndex]
  const totalQuestions = surveyQuestions.length
  const progressPercentage = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)

  const handleResponseChange = async (value: any) => {
    if (!currentQuestion) return
    
    try {
      await saveResponse(currentQuestion.id, value)
    } catch (error) {
      // Error is already handled in the hook
    }
  }

  const canGoNext = () => {
    if (!currentQuestion?.is_required) return true
    const response = responses[currentQuestion.id]
    
    if (currentQuestion.question_type === 'checkbox') {
      return Array.isArray(response) && response.length > 0
    }
    
    return response !== undefined && response !== null && response !== ''
  }

  const handleGoToNext = async () => {
    if (!canGoNext()) {
      toast.error('Por favor responda la pregunta antes de continuar')
      return
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      await hookGoToNext()
    } else {
      await handleSurveyCompletion()
    }
  }

  const handleSurveyCompletion = async () => {
    try {
      await completeSurvey()
      setIsCompleted(true)
      
      // Redirect to results after a brief delay
      setTimeout(() => {
        navigate('/dashboard/resultados')
      }, 2000)
    } catch (error) {
      // Error is already handled in the hook
    }
  }

  const handleBackToDashboard = () => {
    navigate('/')
  }

  if (!user) {
    return null // Will redirect to login
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto text-center shadow-lg">
          <CardContent className="p-8">
            <Loader2 className="h-8 w-8 animate-spin text-bidata-cyan mx-auto mb-4" />
            <p className="text-bidata-gray">Cargando encuesta...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto text-center shadow-lg">
          <CardContent className="p-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadParticipantData} className="bg-bidata-cyan hover:bg-bidata-cyan/90">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto text-center shadow-lg">
          <CardContent className="p-8">
            <p className="text-bidata-gray">No hay preguntas disponibles</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Volver al Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto text-center shadow-lg">
          <CardHeader>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-bidata-dark">
              ¡Encuesta Completada!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-bidata-gray mb-6">
              Gracias por participar en nuestro diagnóstico del ecosistema empresarial MIPYMES.
              Sus respuestas nos ayudarán a generar insights valiosos.
            </p>
            <p className="text-sm text-bidata-gray mb-4">
              Redirigiendo a sus resultados...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-bidata-cyan rounded-full flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-bidata-dark">
                  Diagnóstico MIPYMES
                </h1>
                <p className="text-sm text-bidata-gray">
                  {profile?.razon_social}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleBackToDashboard}
              className="text-bidata-gray hover:text-bidata-dark"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-sm text-bidata-gray mb-2">
            <span>Pregunta {currentQuestionIndex + 1} de {totalQuestions}</span>
            <span>{progressPercentage}% completado</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-bidata-cyan h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-6">
        <Card className="shadow-lg">
          <CardContent className="p-8">
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
              <Button
                variant="outline"
                onClick={goToPrevious}
                disabled={currentQuestionIndex === 0}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>

              <div className="text-sm text-bidata-gray">
                {currentQuestion.is_required && !canGoNext() && (
                  <span className="text-red-500">* Respuesta requerida</span>
                )}
              </div>

              <Button
                onClick={handleGoToNext}
                disabled={!canGoNext() || isLoading}
                className="bg-bidata-cyan hover:bg-bidata-cyan/90 text-white flex items-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : currentQuestionIndex === totalQuestions - 1 ? (
                  <>
                    Finalizar
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    Siguiente
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Debug Info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="mt-6 bg-gray-50">
            <CardContent className="p-4">
              <h3 className="font-semibold text-bidata-dark mb-2">Debug - Respuestas:</h3>
              <pre className="text-xs text-bidata-gray overflow-auto">
                {JSON.stringify(responses, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}