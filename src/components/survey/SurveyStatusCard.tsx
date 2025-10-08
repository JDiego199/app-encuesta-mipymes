import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LimeSurveyParticipantStatus } from '@/types/limesurvey'
import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react'
import SurveyActionButton from './SurveyActionButton'

interface SurveyStatusCardProps {
  participantStatus: LimeSurveyParticipantStatus
  onActionClick: () => void
  isProcessing?: boolean
}

const SurveyStatusCard: React.FC<SurveyStatusCardProps> = ({
  participantStatus,
  onActionClick,
  isProcessing = false
}) => {
  const formatCompletedDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const getStatusIcon = () => {
    switch (participantStatus.status) {
      case 'loading':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      case 'not_found':
        return <AlertCircle className="h-5 w-5 text-orange-500" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusTitle = () => {
    switch (participantStatus.status) {
      case 'loading':
        return 'Verificando estado de la encuesta...'
      case 'not_found':
        return 'Listo para iniciar'
      case 'pending':
        return 'Encuesta Pendiente de Completar'
      case 'completed':
        return 'Encuesta Completada'
      case 'error':
        return 'Error al verificar estado'
      default:
        return 'Estado desconocido'
    }
  }

  const getStatusDescription = () => {
    switch (participantStatus.status) {
      case 'loading':
        return 'Consultando el estado de tu participación en la encuesta...'
      case 'not_found':
        return 'Te hemos registrado automáticamente. Ya puedes iniciar tu diagnóstico empresarial.'
      case 'pending':
        return `Tienes una encuesta pendiente de completar. ${
          participantStatus.usesLeft 
            ? `Intentos restantes: ${participantStatus.usesLeft}` 
            : ''
        }`
      case 'completed':
        return `Completaste la encuesta el ${
          participantStatus.completedDate 
            ? formatCompletedDate(participantStatus.completedDate)
            : 'fecha no disponible'
        }. Ya puedes ver tus resultados.`
      case 'error':
        return participantStatus.error || 'Ocurrió un error al verificar tu estado de participación.'
      default:
        return ''
    }
  }

  const getCardClassName = () => {
    const baseClasses = "transition-all duration-200"
    switch (participantStatus.status) {
      case 'loading':
        return `${baseClasses} border-blue-200 bg-blue-50/50`
      case 'not_found':
        return `${baseClasses} border-orange-200 bg-orange-50/50`
      case 'pending':
        return `${baseClasses} border-yellow-200 bg-yellow-50/50`
      case 'completed':
        return `${baseClasses} border-green-200 bg-green-50/50`
      case 'error':
        return `${baseClasses} border-red-200 bg-red-50/50`
      default:
        return baseClasses
    }
  }

  if (participantStatus.status === 'loading') {
    return (
      <Card className={getCardClassName()}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            {getStatusIcon()}
            {getStatusTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base">
            {getStatusDescription()}
          </CardDescription>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={getCardClassName()}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {getStatusIcon()}
          {getStatusTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-base">
          {getStatusDescription()}
        </CardDescription>
        
        {participantStatus.status !== 'error' && (
          <div className="pt-2">
            <SurveyActionButton
              status={participantStatus.status}
              onClick={onActionClick}
              isLoading={isProcessing}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default SurveyStatusCard