import React from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, CheckCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SurveyNavigationProps {
  currentIndex: number
  totalQuestions: number
  canGoNext: boolean
  canGoPrevious: boolean
  isLastQuestion: boolean
  onPrevious: () => void
  onNext: () => void
  onFinish: () => void
  isSaving?: boolean
  showOnlyProgress?: boolean
}

export function SurveyNavigation({
  currentIndex,
  totalQuestions,
  canGoNext,
  canGoPrevious,
  isLastQuestion,
  onPrevious,
  onNext,
  onFinish,
  isSaving = false,
  showOnlyProgress = false
}: SurveyNavigationProps) {
  const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100

  // If only showing progress, return just the progress bar
  if (showOnlyProgress) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm text-bidata-gray">
          <span>{/*Pregunta {currentIndex + 1} de {totalQuestions}*/}</span>
          <span>{Math.round(progressPercentage)}% completado</span>
        </div>
        <Progress 
          value={progressPercentage} 
          className="h-3"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Navigation Buttons */}
      <div className="flex justify-between items-center gap-4">
        {/* Previous Button */}
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious || isSaving}
          className={cn(
            "flex items-center gap-2 px-6 py-3 text-bidata-dark border-bidata-cyan",
            "hover:bg-bidata-cyan hover:text-white transition-colors duration-200",
            !canGoPrevious && "opacity-50 cursor-not-allowed"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>

        {/* Saving Indicator */}
        {isSaving && (
          <div className="flex items-center gap-2 text-sm text-bidata-gray">
            <Loader2 className="h-4 w-4 animate-spin" />
            Guardando...
          </div>
        )}

        {/* Next/Finish Button */}
        {isLastQuestion ? (
          <Button
            onClick={onFinish}
            disabled={!canGoNext || isSaving}
            className={cn(
              "flex items-center gap-2 px-6 py-3 bg-bidata-cyan text-white",
              "hover:bg-bidata-cyan/90 transition-colors duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <CheckCircle className="h-4 w-4" />
            Finalizar Encuesta
          </Button>
        ) : (
          <Button
            onClick={onNext}
            disabled={!canGoNext || isSaving}
            className={cn(
              "flex items-center gap-2 px-6 py-3 bg-bidata-cyan text-white",
              "hover:bg-bidata-cyan/90 transition-colors duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Help Text */}
      <div className="text-center">
        {!canGoNext && (
          <p className="text-sm text-red-500">
            * Complete la pregunta obligatoria para continuar
          </p>
        )}
        {isSaving && (
          <p className="text-xs text-bidata-gray">
            Sus respuestas se guardan automáticamente
          </p>
        )}
      </div>
    </div>
  )
}