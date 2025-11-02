import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { QuestionRenderer } from '@/components/survey/QuestionRenderer'
import { SurveyNavigation } from '@/components/survey/SurveyNavigation'
import { useSurvey } from '@/hooks/useSurvey'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Target, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function SurveyPage() {
  const navigate = useNavigate()
  const { surveyId } = useParams<{ surveyId: string }>()
  const { user, profile } = useAuth()
  
  // Parse survey ID from URL params or use default
  const parsedSurveyId = surveyId || 'bfb4c2e2-ea0e-406a-b09c-226e883dd417'
  // Note: participantId is optional since the system creates/finds participants automatically
  
  // Use the survey hook with the survey ID
  const {
    questions,
    currentQuestion,
    currentIndex,
    responses,
    participant,
    isLoading,
    isSaving,
    error,
    canGoNext,
    canGoPrevious,
    isLastQuestion,
    progressPercentage,
    goToNext,
    goToPrevious,
    updateResponse,
    finishSurvey,
    retryLoad
  } = useSurvey({ surveyId: parsedSurveyId })

  // Redirect if user is not authenticated or missing required parameters
  React.useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    
    // Validate that we have required URL parameters
    if (!surveyId) {
      toast.error('ID de encuesta requerido')
      navigate('/dashboard')
      return
    }
  }, [user, navigate, surveyId])

  // Additional security check: ensure participant belongs to current user
  React.useEffect(() => {
    if (participant && user && participant.user_id !== user.id) {
      toast.error('No tienes permisos para acceder a esta encuesta')
      navigate('/dashboard')
      return
    }
  }, [participant, user, navigate])

  // Handle response changes with auto-save
  const handleResponseChange = React.useCallback(async (value: any) => {
    try {
      await updateResponse(value)
    } catch (error) {
      console.error('Error updating response:', error)
      toast.error('Error al guardar respuesta')
    }
  }, [updateResponse])

  // Handle navigation to next question
  const handleGoToNext = React.useCallback(async () => {
    if (!canGoNext) {
      toast.error('Por favor complete la pregunta antes de continuar')
      return
    }

    try {
      await goToNext()
    } catch (error) {
      console.error('Error navigating to next question:', error)
      toast.error('Error al avanzar a la siguiente pregunta')
    }
  }, [canGoNext, goToNext])

  // Handle survey completion
  const handleFinishSurvey = React.useCallback(async () => {
    if (!canGoNext) {
      toast.error('Por favor complete la pregunta antes de finalizar')
      return
    }

    try {
      await finishSurvey()
      toast.success('¡Encuesta completada exitosamente!')
      
      // Redirect to results after a brief delay
      setTimeout(() => {
        navigate('/dashboard/resultados')
      }, 2000)
    } catch (error) {
      console.error('Error finishing survey:', error)
      toast.error('Error al finalizar la encuesta')
    }
  }, [canGoNext, finishSurvey, navigate])

  // Handle back to dashboard
  const handleBackToDashboard = () => {
    navigate('/')
  }

  // Don't render if user is not authenticated (will redirect)
  if (!user) {
    return null
  }

  // Loading state
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



  // No questions available
  if (!currentQuestion || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto text-center shadow-lg">
          <CardContent className="p-8">
            <p className="text-bidata-gray mb-4">No hay preguntas disponibles</p>
            <Button onClick={handleBackToDashboard} className="bg-bidata-cyan hover:bg-bidata-cyan/90">
              Volver al Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Survey completed state
  if (participant?.status === 'completed') {
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
            <Button 
              onClick={() => navigate('/dashboard/resultados')}
              className="w-full bg-bidata-cyan hover:bg-bidata-cyan/90"
            >
              Ver Resultados
            </Button>
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

      {/* Progress Bar - Below header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <SurveyNavigation
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
            isLastQuestion={isLastQuestion}
            onPrevious={goToPrevious}
            onNext={handleGoToNext}
            onFinish={handleFinishSurvey}
            isSaving={isSaving}
            showOnlyProgress={true}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto p-6">
        <Card className="shadow-lg">
          <CardContent className="p-8">
            {/* Question */}
            <div className="mb-8">
              <QuestionRenderer
                question={currentQuestion}
                value={responses.get(currentQuestion.id)}
                onChange={handleResponseChange}
                disabled={isSaving}
              />
            </div>

            {/* Navigation */}
            <SurveyNavigation
              currentIndex={currentIndex}
              totalQuestions={questions.length}
              canGoNext={canGoNext}
              canGoPrevious={canGoPrevious}
              isLastQuestion={isLastQuestion}
              onPrevious={goToPrevious}
              onNext={handleGoToNext}
              onFinish={handleFinishSurvey}
              isSaving={isSaving}
              showOnlyProgress={false}
            />
          </CardContent>
        </Card>

        {/* Auto-save indicator */}
        {isSaving && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-bidata-gray bg-white px-4 py-2 rounded-full shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando automáticamente...
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
