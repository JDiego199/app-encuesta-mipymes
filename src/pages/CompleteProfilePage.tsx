import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, CheckCircle, AlertCircle, User, Building2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface RUCValidationResult {
  valid: boolean
  contribuyente?: {
    ruc: string
    razonSocial: string
    estadoContribuyente: string
    actividadEconomica: string
    tipoContribuyente: string
    regimen: string
    obligadoLlevarContabilidad: string
    sriData: any
  }
  message?: string
}

export function CompleteProfilePage() {
  const { user, refreshProfile, isProfileComplete } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    ruc: '',
    nombre_persona: '',
    nombre_empresa: '',
    sector: '',
    ciudad: '',
    telefono: ''
  })
  const [rucValidation, setRucValidation] = useState<RUCValidationResult | null>(null)
  const [isValidatingRuc, setIsValidatingRuc] = useState(false)
  const [isCreatingProfile, setIsCreatingProfile] = useState(false)

  // Redirect if profile is already complete
  useEffect(() => {
    if (isProfileComplete) {
      navigate('/', { replace: true })
    }
  }, [isProfileComplete, navigate])

  const sectores = [
    'Agricultura, ganadería, silvicultura y pesca',
    'Explotación de minas y canteras',
    'Industrias manufactureras',
    'Suministro de electricidad, gas, vapor y aire acondicionado',
    'Distribución de agua; alcantarillado, gestión de desechos y actividades de saneamiento',
    'Construcción',
    'Comercio al por mayor y al por menor; reparación de vehículos automotores y motocicletas',
    'Transporte y almacenamiento',
    'Actividades de alojamiento y de servicio de comidas',
    'Información y comunicación',
    'Actividades financieras y de seguros',
    'Actividades inmobiliarias',
    'Actividades profesionales, científicas y técnicas',
    'Actividades de servicios administrativos y de apoyo',
    'Administración pública y defensa; planes de seguridad social de afiliación obligatoria',
    'Enseñanza',
    'Actividades de atención de la salud humana y de asistencia social',
    'Artes, entretenimiento y recreación',
    'Otras actividades de servicios',
    'Actividades de los hogares como empleadores'
  ]

  const ciudades = [
    'Quito', 'Guayaquil', 'Cuenca', 'Santo Domingo', 'Machala', 'Durán', 'Manta', 
    'Portoviejo', 'Loja', 'Ambato', 'Esmeraldas', 'Riobamba', 'Milagro', 'Ibarra',
    'La Libertad', 'Babahoyo', 'Quevedo', 'Tulcán', 'Pasaje', 'Macas'
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateRUC = async () => {
    if (!formData.ruc || formData.ruc.length !== 13) {
      toast.error('El RUC debe tener exactamente 13 dígitos')
      return
    }

    setIsValidatingRuc(true)
    setRucValidation(null)

    try {
      const { data, error } = await supabase.functions.invoke('validate-ruc', {
        body: { ruc: formData.ruc }
      })

      if (error) {
        throw new Error(error.message)
      }

      setRucValidation(data.data)

      if (data.data.valid) {
        toast.success('RUC válido - Datos del SRI cargados')
        // Auto-fill company name from SRI data
        setFormData(prev => ({
          ...prev,
          nombre_empresa: data.data.contribuyente.razonSocial
        }))
      } else {
        toast.error(data.data.message || 'RUC no válido')
      }
    } catch (error) {
      console.error('Error validating RUC:', error)
      toast.error('Error al validar el RUC')
    } finally {
      setIsValidatingRuc(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!rucValidation?.valid) {
      toast.error('Debe validar un RUC válido antes de continuar')
      return
    }

    if (!formData.nombre_persona || !formData.sector || !formData.ciudad) {
      toast.error('Por favor complete todos los campos requeridos')
      return
    }

    setIsCreatingProfile(true)

    try {
      const profileData = {
        email: user?.email,
        ruc: formData.ruc,
        razonSocial: rucValidation.contribuyente!.razonSocial,
        actividadEconomica: rucValidation.contribuyente!.actividadEconomica,
        estadoContribuyente: rucValidation.contribuyente!.estadoContribuyente,
        direccion: 'No disponible',
        telefono: formData.telefono,
        nombrePersona: formData.nombre_persona,
        nombreEmpresa: formData.nombre_empresa,
        sector: formData.sector,
        ciudad: formData.ciudad,
        sriData: rucValidation.contribuyente!.sriData
      }

      const { data, error } = await supabase.functions.invoke('create-profile', {
        body: profileData
      })

      if (error) {
        throw new Error(error.message)
      }

      toast.success('Perfil creado exitosamente')
      
      // Refresh the profile in the auth context
      await refreshProfile()
      
      // Navigate to dashboard after successful profile creation
      navigate('/', { replace: true })
      
    } catch (error: any) {
      console.error('Error creating profile:', error)
      toast.error(error.message || 'Error al crear el perfil')
    } finally {
      setIsCreatingProfile(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-bidata-cyan/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-bidata-cyan" />
          </div>
          <CardTitle className="text-2xl text-bidata-dark">
            Completar Perfil
          </CardTitle>
          <CardDescription className="text-base">
            Para acceder al sistema, necesitamos completar la información de tu perfil empresarial
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* RUC Validation Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-5 w-5 text-bidata-cyan" />
                <Label className="text-base font-medium">Información Empresarial</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ruc">RUC de la Empresa *</Label>
                <div className="flex gap-2">
                  <Input
                    id="ruc"
                    type="text"
                    placeholder="1234567890001"
                    value={formData.ruc}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 13)
                      handleInputChange('ruc', value)
                      setRucValidation(null)
                    }}
                    className="flex-1"
                    maxLength={13}
                  />
                  <Button
                    type="button"
                    onClick={validateRUC}
                    disabled={isValidatingRuc || formData.ruc.length !== 13}
                    variant="outline"
                  >
                    {isValidatingRuc ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Validar'
                    )}
                  </Button>
                </div>
                
                {rucValidation && (
                  <div className={`flex items-center gap-2 p-3 rounded-md ${
                    rucValidation.valid 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {rucValidation.valid ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <span className="text-sm">
                      {rucValidation.valid 
                        ? `✓ ${rucValidation.contribuyente?.razonSocial} - ${rucValidation.contribuyente?.estadoContribuyente}`
                        : rucValidation.message
                      }
                    </span>
                  </div>
                )}
              </div>

              {rucValidation?.valid && (
                <div className="space-y-2">
                  <Label htmlFor="nombre_empresa">Nombre de la Empresa</Label>
                  <Input
                    id="nombre_empresa"
                    type="text"
                    value={formData.nombre_empresa}
                    onChange={(e) => handleInputChange('nombre_empresa', e.target.value)}
                    placeholder="Nombre comercial de la empresa"
                  />
                </div>
              )}
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-bidata-cyan" />
                <Label className="text-base font-medium">Información Personal</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nombre_persona">Nombre Completo *</Label>
                <Input
                  id="nombre_persona"
                  type="text"
                  value={formData.nombre_persona}
                  onChange={(e) => handleInputChange('nombre_persona', e.target.value)}
                  placeholder="Juan Pérez"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
                  placeholder="0999999999"
                />
              </div>
            </div>

            {/* Business Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sector">Sector Económico *</Label>
                <Select value={formData.sector} onValueChange={(value) => handleInputChange('sector', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el sector de su empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectores.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ciudad">Ciudad *</Label>
                <Select value={formData.ciudad} onValueChange={(value) => handleInputChange('ciudad', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione su ciudad" />
                  </SelectTrigger>
                  <SelectContent>
                    {ciudades.map((ciudad) => (
                      <SelectItem key={ciudad} value={ciudad}>
                        {ciudad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!rucValidation?.valid || isCreatingProfile}
              className="w-full bg-bidata-cyan hover:bg-bidata-cyan/90 text-white py-6 text-lg"
            >
              {isCreatingProfile ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creando perfil...
                </>
              ) : (
                'Completar Perfil'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}