import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Target, CheckCircle, Building, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRUCValidation } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { RegistrationSuccess } from '@/components/RegistrationSuccess'

export function RegisterPage() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  
  // Datos del formulario simplificado para registro inicial
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    ruc: ''
  })
  
  const [validatedData, setValidatedData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [registrationComplete, setRegistrationComplete] = useState(false)
  
  const rucValidation = useRUCValidation()

  // Validación automática de RUC cuando se escribe
  const handleRucChange = async (ruc: string) => {
    const cleanRuc = ruc.replace(/\D/g, '').slice(0, 13)
    setFormData(prev => ({ ...prev, ruc: cleanRuc }))
    
    // Auto-validar cuando el RUC tiene 13 dígitos
    if (cleanRuc.length === 13) {
      try {
        const result = await rucValidation.mutateAsync(cleanRuc)
        if (result.valid) {
          if (result.contribuyente.estadoContribuyente !== 'ACTIVO') {
            toast.error('Solo se permiten contribuyentes en estado ACTIVO')
            setValidatedData(null)
            return
          }
          
          setValidatedData(result.contribuyente)
          toast.success('RUC validado correctamente con el SRI')
        } else {
          setValidatedData(null)
          toast.error('RUC no encontrado en el SRI')
        }
      } catch (error) {
        setValidatedData(null)
        // Error ya manejado por el hook
      }
    } else {
      setValidatedData(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validaciones básicas
    if (!formData.email.trim()) {
      toast.error('Por favor ingrese su email')
      return
    }
    
    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }
    
    if (!formData.ruc || formData.ruc.length !== 13) {
      toast.error('El RUC debe tener exactamente 13 dígitos')
      return
    }
    
    if (!validatedData) {
      toast.error('Debe validar el RUC con el SRI antes de continuar')
      return
    }

    setLoading(true)
    
    try {
      // Solo crear usuario en Supabase con metadata del RUC validado
      const signUpResult = await signUp(formData.email, formData.password)
      
      if (signUpResult.error) {
        throw signUpResult.error
      }

      // Guardar datos del RUC validado en el user metadata para uso posterior
      if (signUpResult.data?.user) {
        await supabase.auth.updateUser({
          data: {
            ruc: validatedData.ruc,
            razon_social: validatedData.razonSocial,
            estado_contribuyente: validatedData.estadoContribuyente,
            registration_completed: false
          }
        })
      }
      
      // Mostrar pantalla de confirmación
      setRegistrationComplete(true)
      
    } catch (error: any) {
      console.error('Registration error:', error)
      
      // Manejo de errores mejorado
      if (error.message?.includes('already registered') || error.message?.includes('User already registered')) {
        toast.error('Este email ya está registrado. Por favor, use otro email o inicie sesión.')
      } else if (error.message?.includes('Invalid email')) {
        toast.error('El formato del email no es válido.')
      } else if (error.message?.includes('Password')) {
        toast.error('La contraseña no cumple con los requisitos mínimos.')
      } else {
        toast.error(error.message || 'Error durante el registro. Por favor, intente nuevamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Mostrar pantalla de confirmación si el registro fue exitoso
  if (registrationComplete) {
    return (
      <RegistrationSuccess 
        email={formData.email}
        onContinue={() => {
          // Navigation will be handled by the ProtectedRoute component
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
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
              Registro Empresarial
            </CardTitle>
            <CardDescription className="text-lg text-bidata-gray">
              Cree su cuenta y valide su empresa para acceder al diagnóstico MIPYMES
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* SECCIÓN: DATOS DE REGISTRO */}
              <div className="bg-bidata-cyan/10 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-bidata-cyan rounded-full flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-bidata-dark">Crear Cuenta</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email" className="text-bidata-dark font-medium">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="correo@empresa.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="py-3"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-bidata-dark font-medium">Contraseña *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="py-3"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-bidata-dark font-medium">Confirmar Contraseña *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Repita su contraseña"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="py-3"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN: VALIDACIÓN RUC */}
              <div className="bg-bidata-cyan/10 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-bidata-cyan rounded-full flex items-center justify-center mr-3">
                    <Building className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-bidata-dark">Validación Empresarial</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ruc" className="text-bidata-dark font-medium">RUC de la Empresa *</Label>
                    <div className="relative">
                      <Input
                        id="ruc"
                        type="text"
                        placeholder="1234567890001"
                        value={formData.ruc}
                        onChange={(e) => handleRucChange(e.target.value)}
                        maxLength={13}
                        className={`text-lg font-mono pr-10 py-3 ${
                          validatedData ? 'border-green-500 bg-green-50' : 
                          formData.ruc.length === 13 ? 'border-red-500' : ''
                        }`}
                        required
                      />
                      {validatedData && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                      )}
                      {rucValidation.isPending && (
                        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 animate-spin text-bidata-cyan" />
                      )}
                    </div>
                    <p className="text-sm text-bidata-gray">
                      {validatedData ? (
                        <span className="text-green-600 font-medium">
                          ✓ RUC validado: {validatedData.razonSocial}
                        </span>
                      ) : (
                        'Ingrese el RUC de 13 dígitos para validar con el SRI'
                      )}
                    </p>
                  </div>
                  
                  {/* Mostrar información del SRI si está validada */}
                  {validatedData && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-semibold text-green-800">Empresa verificada con el SRI</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-700">
                        <div><strong>Razón Social:</strong> {validatedData.razonSocial}</div>
                        <div><strong>Estado:</strong> {validatedData.estadoContribuyente}</div>
                        {validatedData.sriData?.actividadEconomicaPrincipal && (
                          <div className="md:col-span-2">
                            <strong>Actividad Económica:</strong> {validatedData.sriData.actividadEconomicaPrincipal}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            
            <div className="px-6 pb-6 space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-bidata-cyan hover:bg-bidata-cyan/90 text-white text-lg py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={loading || !validatedData}
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
                    Creando cuenta...
                  </>
                ) : (
                  'Crear Cuenta'
                )}
              </Button>
              
              {!validatedData && formData.ruc.length === 13 && (
                <p className="text-sm text-red-600 text-center">
                  Debe validar el RUC con el SRI antes de continuar
                </p>
              )}
              
              <div className="text-center text-sm pt-2">
                <span className="text-bidata-gray">¿Ya tienes cuenta? </span>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-bidata-cyan hover:text-bidata-cyan/80 font-medium underline"
                >
                  Inicia sesión aquí
                </button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}