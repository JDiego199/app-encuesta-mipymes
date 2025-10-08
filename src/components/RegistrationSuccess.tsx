import { CheckCircle, Mail, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'

interface RegistrationSuccessProps {
  email: string
  onContinue?: () => void
}

export function RegistrationSuccess({ email, onContinue }: RegistrationSuccessProps) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-bidata-dark">
              ¡Registro Exitoso!
            </CardTitle>
            <CardDescription className="text-bidata-gray">
              Su cuenta ha sido creada correctamente
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg mb-4">
                <Mail className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-blue-800 font-medium">Correo de confirmación enviado</span>
              </div>
              
              <p className="text-sm text-bidata-gray mb-2">
                Hemos enviado un correo de confirmación a:
              </p>
              <p className="font-semibold text-bidata-dark break-all">
                {email}
              </p>
            </div>
            
            <div className="bg-bidata-cyan/10 rounded-lg p-4">
              <h4 className="font-semibold text-bidata-dark mb-2">Próximos pasos:</h4>
              <ol className="text-sm text-bidata-gray space-y-1">
                <li>1. Revise su bandeja de entrada</li>
                <li>2. Haga clic en el enlace de confirmación</li>
                <li>3. Complete su perfil empresarial</li>
                <li>4. Acceda al diagnóstico MIPYMES</li>
              </ol>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-bidata-gray mb-4">
                ¿No recibió el correo? Revise su carpeta de spam o correo no deseado
              </p>
              
              {onContinue && (
                <Button 
                  onClick={() => navigate('/login')}
                  className="w-full bg-bidata-cyan hover:bg-bidata-cyan/90 text-white"
                >
                  Continuar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}