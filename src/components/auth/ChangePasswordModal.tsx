import React, { useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePasswordChange } from '@/hooks/usePasswordManagement'
import { PasswordChangeRequest } from '@/types/password'

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [formData, setFormData] = useState<PasswordChangeRequest>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const passwordChangeMutation = usePasswordChange()

  const handleInputChange = (field: keyof PasswordChangeRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'La contraseña actual es requerida'
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'La nueva contraseña es requerida'
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu nueva contraseña'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
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
      const result = await passwordChangeMutation.mutateAsync(formData)
      
      if (result.success) {
        // Reset form and close modal on success
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        setErrors({})
        onClose()
      } else if (result.error) {
        // Handle specific errors
        if (result.error.type === 'invalid_current_password') {
          setErrors({ currentPassword: result.error.message })
        } else {
          setErrors({ general: result.error.message })
        }
      }
    } catch (error) {
      setErrors({ general: 'Ocurrió un error inesperado' })
    }
  }

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-bidata-dark">
            <Lock className="h-5 w-5 text-bidata-cyan" />
            Cambiar Contraseña
          </DialogTitle>
          <DialogDescription>
            Ingresa tu contraseña actual y la nueva contraseña que deseas usar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {errors.general}
            </div>
          )}

          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-bidata-dark">
              Contraseña Actual
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                className={`pr-10 ${errors.currentPassword ? 'border-red-500 focus:border-red-500' : 'focus:border-bidata-cyan'}`}
                placeholder="Ingresa tu contraseña actual"
                disabled={passwordChangeMutation.isPending}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-bidata-gray hover:text-bidata-dark"
                disabled={passwordChangeMutation.isPending}
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-red-600">{errors.currentPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-bidata-dark">
              Nueva Contraseña
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                className={`pr-10 ${errors.newPassword ? 'border-red-500 focus:border-red-500' : 'focus:border-bidata-cyan'}`}
                placeholder="Ingresa tu nueva contraseña"
                disabled={passwordChangeMutation.isPending}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-bidata-gray hover:text-bidata-dark"
                disabled={passwordChangeMutation.isPending}
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-600">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-bidata-dark">
              Confirmar Nueva Contraseña
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`pr-10 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'focus:border-bidata-cyan'}`}
                placeholder="Confirma tu nueva contraseña"
                disabled={passwordChangeMutation.isPending}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-bidata-gray hover:text-bidata-dark"
                disabled={passwordChangeMutation.isPending}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={passwordChangeMutation.isPending}
              className="border-bidata-gray text-bidata-gray hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={passwordChangeMutation.isPending}
              className="bg-bidata-cyan hover:bg-bidata-cyan/90 text-white"
            >
              {passwordChangeMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Cambiando...
                </div>
              ) : (
                'Cambiar Contraseña'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}