import React, { useState } from 'react'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePasswordReset } from '@/hooks/usePasswordManagement'
import { PasswordResetRequest } from '@/types/password'

interface ForgotPasswordFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function ForgotPasswordForm({ onSuccess, onCancel }: ForgotPasswordFormProps) {
  const [formData, setFormData] = useState<PasswordResetRequest>({
    email: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSuccess, setIsSuccess] = useState(false)

  const passwordResetMutation = usePasswordReset()

  const handleInputChange = (value: string) => {
    setFormData({ email: value })
    // Clear error when user starts typing
    if (errors.email) {
      setErrors({})
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      const result = await passwordResetMutation.mutateAsync(formData)
      
      if (result.success) {
        setIsSuccess(true)
        // Call onSuccess after a short delay to show the success message
        setTimeout(() => {
          onSuccess()
        }, 3000)
      } else if (result.error) {
        setErrors({ general: result.error.message })
      }
    } catch (error) {
      setErrors({ general: 'Ocurrió un error inesperado' })
    }
  }

  const handleCancel = () => {
    // Reset form when canceling
    setFormData({ email: '' })
    setErrors({})
    setIsSuccess(false)
    onCancel()
  }

  // Success state
  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-bidata-dark">Email Enviado</CardTitle>
          <CardDescription>
            Se ha enviado un email con instrucciones para recuperar tu contraseña a{' '}
            <span className="font-medium text-bidata-dark">{formData.email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                Revisa tu bandeja de entrada y sigue las instrucciones del email para restablecer tu contraseña.
                Si no ves el email, revisa tu carpeta de spam.
              </p>
            </div>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="w-full border-bidata-gray text-bidata-gray hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Login
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Form state
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-bidata-dark">
          <Mail className="h-5 w-5 text-bidata-cyan" />
          Recuperar Contraseña
        </CardTitle>
        <CardDescription>
          Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {errors.general}
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-bidata-dark">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange(e.target.value)}
              className={`${errors.email ? 'border-red-500 focus:border-red-500' : 'focus:border-bidata-cyan'}`}
              placeholder="tu@email.com"
              disabled={passwordResetMutation.isPending}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <Button
              type="submit"
              disabled={passwordResetMutation.isPending}
              className="w-full bg-bidata-cyan hover:bg-bidata-cyan/90 text-white"
            >
              {passwordResetMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Enviando...
                </div>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Email de Recuperación
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={passwordResetMutation.isPending}
              className="w-full border-bidata-gray text-bidata-gray hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Login
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}