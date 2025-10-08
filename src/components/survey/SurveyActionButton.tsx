import React from 'react'
import { Button } from '@/components/ui/button'
import { LimeSurveyParticipantStatus } from '@/types/limesurvey'
import { Play, ArrowRight, BarChart3, Loader2 } from 'lucide-react'

interface SurveyActionButtonProps {
  status: LimeSurveyParticipantStatus['status']
  onClick: () => void
  isLoading?: boolean
}

const SurveyActionButton: React.FC<SurveyActionButtonProps> = ({
  status,
  onClick,
  isLoading = false
}) => {
  const getButtonConfig = () => {
    switch (status) {
      case 'not_found':
        return {
          text: 'Iniciar Diagnóstico',
          icon: <Play className="h-4 w-4" />,
          variant: 'default' as const,
          disabled: false
        }
      case 'pending':
        return {
          text: 'Continuar Encuesta',
          icon: <ArrowRight className="h-4 w-4" />,
          variant: 'default' as const,
          disabled: false
        }
      case 'completed':
        return {
          text: 'Ver Resultados',
          icon: <BarChart3 className="h-4 w-4" />,
          variant: 'secondary' as const,
          disabled: false
        }
      case 'loading':
        return {
          text: 'Cargando...',
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          variant: 'outline' as const,
          disabled: true
        }
      case 'error':
        return {
          text: 'Reintentar',
          icon: <ArrowRight className="h-4 w-4" />,
          variant: 'outline' as const,
          disabled: false
        }
      default:
        return {
          text: 'Acción no disponible',
          icon: null,
          variant: 'outline' as const,
          disabled: true
        }
    }
  }

  const config = getButtonConfig()

  return (
    <Button
      onClick={onClick}
      disabled={config.disabled || isLoading}
      variant={config.variant}
      size="lg"
      className="w-full sm:w-auto"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        config.icon && <span className="mr-2">{config.icon}</span>
      )}
      {isLoading ? 'Procesando...' : config.text}
    </Button>
  )
}

export default SurveyActionButton