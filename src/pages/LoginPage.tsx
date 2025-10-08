import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Target } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email.trim()) {
      toast.error('Por favor ingrese su email')
      return
    }
    
    if (!formData.password.trim()) {
      toast.error('Por favor ingrese su contraseña')
      return
    }

    setLoading(true)
    
    try {
      const result = await signIn(formData.email, formData.password)
      
      if (result.error) {
        toast.error(result.error.message || 'Error al iniciar sesión')
      } else {
        toast.success('Sesión iniciada exitosamente')
        // Navigation will be handled by the ProtectedRoute component
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  // Show forgot password form if requested
  if (showForgotPassword) {
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

          <ForgotPasswordForm 
            onSuccess={() => {
              setShowForgotPassword(false)
              toast.success('Revisa tu email para continuar con la recuperación')
            }}
            onCancel={() => setShowForgotPassword(false)}
          />
        </div>
      </div>
    )
  }

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
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-lg text-bidata-gray">
              Accede a tu diagnóstico empresarial MIPYMES
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-bidata-dark font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@empresa.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="text-lg py-3"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-bidata-dark font-medium">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Su contraseña"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="text-lg py-3"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-bidata-cyan hover:bg-bidata-cyan/90 text-white text-lg py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Iniciando sesión...</>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
              
              {/* Forgot Password Link */}
              <div className="text-center text-sm pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-bidata-cyan hover:text-bidata-cyan/80 font-medium underline"
                  disabled={loading}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              
              <div className="text-center text-sm pt-4 border-t border-gray-200 mt-4">
                <span className="text-bidata-gray">¿No tienes cuenta? </span>
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-bidata-cyan hover:text-bidata-cyan/80 font-medium underline"
                >
                  Regístrate aquí
                </button>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  )
}