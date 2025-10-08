import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Target, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react'
import { usePasswordResetConfirmation } from '@/hooks/usePasswordManagement'
import { validatePasswordStrength, validatePasswordConfirmation } from '@/lib/passwordValidation'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { PasswordErrorType } from '@/types/password'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [tokenStatus, setTokenStatus] = useState<'loading' | 'valid' | 'invalid'>('loading')
  const [isSuccess, setIsSuccess] = useState(false)
  
  const resetPasswordMutation = usePasswordResetConfirmation()

  // Handle password reset callback from email
  useEffect(() => {
    const handlePasswordResetCallback = async () => {
      try {
        // Check if we have hash parameters (from Supabase email redirect)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type')

        if (type === 'recovery' && accessToken && refreshToken) {
          console.log('Found recovery tokens in URL, setting session...')
          // Set the session using the tokens from the URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })

          if (error) {
            console.error('Error setting session:', error)
            setTokenStatus('invalid')
            toast.error('Enlace de recuperación inválido o expirado')
            return
          }

          if (data.session) {
            console.log('Session set successfully for password reset')
            setToken('session_based')
            setTokenStatus('valid')
            // Clean up the URL hash to remove tokens
            window.history.replaceState({}, document.title, window.location.pathname)
            return
          }
        }

        // Fallback: check if we already have a valid session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          setToken('session_based')
          setTokenStatus('valid')
        } else {
          setTokenStatus('invalid')
          toast.error('Enlace de recuperación inválido o expirado')
        }
      } catch (error) {
        console.error('Error handling password reset callback:', error)
        setTokenStatus('invalid')
        toast.error('Error procesando el enlace de recuperación')
      }
    }

    handlePasswordResetCallback()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      toast.error('Token de recuperación no válido')
      return
    }
    
    // Validate password strength
    const passwordValidation = validatePasswordStrength(formData.newPassword)
    if (!passwordValidation.isValid) {
      toast.error(passwordValidation.error!.message)
      return
    }
    
    // Validate password confirmation
    const confirmationValidation = validatePasswordConfirmation(formData.newPassword, formData.confirmPassword)
    if (!confirmationValidation.isValid) {
      toast.error(confirmationValidation.error!.message)
      return
    }

    try {
      const result = await resetPasswordMutation.mutateAsync({
        token: token || '', // Pass empty string if no token (session-based)
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      })
      
      if (result.success) {
        setIsSuccess(true)
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } else if (result.error) {
        // Handle specific error types
        if (result.error.type === PasswordErrorType.INVALID_TOKEN || 
            result.error.type === PasswordErrorType.EXPIRED_TOKEN) {
          setTokenStatus('invalid')
        }
        toast.error(result.error.message)
      }
    } catch (error: any) {
      toast.error('Error al restablecer la contraseña')
      console.error('Reset password error:', error)
    }
  }

  const handleCancel = () => {
    navigate('/landing')
  }

  // Loading state while checking token
  if (tokenStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-bidata-cyan mx-auto mb-4" />
            <p className="text-bidata-gray">Verificando enlace de recuperación...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Invalid token state
  if (tokenStatus === 'invalid') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-bidata-cyan/10 rounded-full mb-6">
              <Target className="h-6 w-6 text-bidata-cyan mr-2" />
              <span className="text-bidata-cyan font-semibold">Proyecto de investigación Bi-DATA</span>
            </div>
          </div>

          <Card className="w-full shadow-lg">
            <CardContent className="text-center py-8">
              <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-bidata-dark mb-2">
                Enlace Inválido
              </h2>
              <p className="text-bidata-gray mb-6">
                El enlace de recuperación es inválido o ha expirado. 
                Por favor, solicite un nuevo enlace de recuperación.
              </p>
              <Button 
                onClick={handleCancel}
                className="w-full bg-bidata-cyan hover:bg-bidata-cyan/90 text-white"
              >
                Volver al Inicio
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-bidata-cyan/10 rounded-full mb-6">
              <Target className="h-6 w-6 text-bidata-cyan mr-2" />
              <span className="text-bidata-cyan font-semibold">Proyecto de investigación Bi-DATA</span>
            </div>
          </div>

          <Card className="w-full shadow-lg">
            <CardContent className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-bidata-dark mb-2">
                ¡Contraseña Restablecida!
              </h2>
              <p className="text-bidata-gray mb-6">
                Su contraseña ha sido restablecida exitosamente. 
                Será redirigido al inicio de sesión en unos segundos.
              </p>
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-bidata-cyan mr-2" />
                <span className="text-sm text-bidata-gray">Redirigiendo...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Main reset password form
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-bidata-cyan/10 rounded-full mb-6">
            <Target className="h-6 w-6 text-bidata-cyan mr-2" />
            <span className="text-bidata-cyan font-semibold">Proyecto de investigación Bi-DATA</span>
          </div>
        </div>

        <Card className="w-full shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-bidata-dark mb-2">
              Nueva Contraseña
            </CardTitle>
            <CardDescription className="text-lg text-bidata-gray">
              Ingrese su nueva contraseña para restablecer el acceso
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-bidata-dark font-medium">
                  Nueva Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingrese su nueva contraseña"
                    value={formData.newPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="text-lg py-3 pr-12"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-bidata-gray hover:text-bidata-dark"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-sm text-bidata-gray">
                  La contraseña debe tener al menos 6 caracteres
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-bidata-dark font-medium">
                  Confirmar Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme su nueva contraseña"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="text-lg py-3 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-bidata-gray hover:text-bidata-dark"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  type="submit" 
                  className="w-full bg-bidata-cyan hover:bg-bidata-cyan/90 text-white text-lg py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={resetPasswordMutation.isPending}
                >
                  {resetPasswordMutation.isPending ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Restableciendo...</>
                  ) : (
                    'Restablecer Contraseña'
                  )}
                </Button>
                
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="w-full text-bidata-gray border-bidata-gray/30 hover:bg-bidata-gray/5"
                  disabled={resetPasswordMutation.isPending}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  )
}