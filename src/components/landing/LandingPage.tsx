import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import { 
  CheckCircle, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building, 
  Lightbulb,
  Globe,
  Smartphone,
  ArrowRight,
  Target
} from 'lucide-react'

export function LandingPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          {/* Logo/Brand */}
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-bidata-cyan/10 rounded-full mb-6">
              <Target className="h-6 w-6 text-bidata-cyan mr-2" />
              <span className="text-bidata-cyan font-semibold">Proyecto de investigación Bi-DATA</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-bidata-dark mb-6">
            Diagnóstico del Ecosistema
            <span className="text-bidata-cyan"> Empresarial MIPYMES</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-bidata-gray mb-8 max-w-4xl mx-auto leading-relaxed">
            ¿Qué tan competitivo es tu ecosistema empresarial?
          </p>
          
          <div className="mb-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate('/login')}
              size="lg"
              className="bg-bidata-cyan hover:bg-bidata-cyan/90 text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Iniciar Sesión
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={() => navigate('/register')}
              size="lg"
              variant="outline"
              className="border-bidata-cyan text-bidata-cyan hover:bg-bidata-cyan hover:text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Registrarse
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          {/* Info del proyecto */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto border border-gray-200">
            <p className="text-sm text-bidata-gray">
              <strong>Proyecto:</strong>Desarrollo de herramientas de Business Intelligence y data analytics para fortalecer el ecosistema empresarial MIPYMES: caso Riobamba y Ambato
            </p>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-bidata-dark mb-4">
              ¿Por qué realizar el diagnóstico?
            </h2>
            <p className="text-lg text-bidata-gray max-w-3xl mx-auto">
              Obtén una evaluación integral del ecosistema empresarial para identificar oportunidades de mejora y fortalezas competitivas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-bidata-cyan/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-bidata-cyan" />
                </div>
                <CardTitle className="text-bidata-dark">Análisis Integral</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-bidata-gray text-center">
                  Evaluación completa de 8 dimensiones críticas del ecosistema empresarial
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-bidata-cyan/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-bidata-cyan" />
                </div>
                <CardTitle className="text-bidata-dark">Insights Valiosos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-bidata-gray text-center">
                  Reportes detallados con comparativas sectoriales y recomendaciones específicas
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-bidata-cyan/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-bidata-cyan" />
                </div>
                <CardTitle className="text-bidata-dark">Validación Oficial</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-bidata-gray text-center">
                  Integración directa con el SRI para validación automática de datos empresariales
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-bidata-dark mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-lg text-bidata-gray max-w-3xl mx-auto">
              Proceso simple y rápido para obtener tu diagnóstico empresarial
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-bidata-cyan rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                1
              </div>
              <h3 className="font-semibold text-bidata-dark mb-2">Registro</h3>
              <p className="text-bidata-gray text-sm">Validación automática con RUC del SRI</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-bidata-cyan rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                2
              </div>
              <h3 className="font-semibold text-bidata-dark mb-2">Diagnóstico</h3>
              <p className="text-bidata-gray text-sm">32 preguntas sobre 8 dimensiones clave</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-bidata-cyan rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                3
              </div>
              <h3 className="font-semibold text-bidata-dark mb-2">Análisis</h3>
              <p className="text-bidata-gray text-sm">Procesamiento automático de respuestas</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-bidata-cyan rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                4
              </div>
              <h3 className="font-semibold text-bidata-dark mb-2">Resultados</h3>
              <p className="text-bidata-gray text-sm">Reporte detallado con recomendaciones</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dimensiones Evaluadas */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-bidata-dark mb-4">
              Dimensiones Evaluadas
            </h2>
            <p className="text-lg text-bidata-gray max-w-3xl mx-auto">
              8 dimensiones críticas para el desarrollo empresarial
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <Building className="h-8 w-8 text-bidata-cyan mb-3" />
              <h3 className="font-semibold text-bidata-dark mb-2">Marco Institucional</h3>
              <p className="text-sm text-bidata-gray">Políticas públicas y apoyo institucional</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <CheckCircle className="h-8 w-8 text-bidata-cyan mb-3" />
              <h3 className="font-semibold text-bidata-dark mb-2">Entorno Operativo</h3>
              <p className="text-sm text-bidata-gray">Simplificación de procedimientos</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <TrendingUp className="h-8 w-8 text-bidata-cyan mb-3" />
              <h3 className="font-semibold text-bidata-dark mb-2">Financiamiento</h3>
              <p className="text-sm text-bidata-gray">Acceso a recursos financieros</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <Users className="h-8 w-8 text-bidata-cyan mb-3" />
              <h3 className="font-semibold text-bidata-dark mb-2">Desarrollo Empresarial</h3>
              <p className="text-sm text-bidata-gray">Servicios y compras públicas</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <Lightbulb className="h-8 w-8 text-bidata-cyan mb-3" />
              <h3 className="font-semibold text-bidata-dark mb-2">Innovación</h3>
              <p className="text-sm text-bidata-gray">Tecnología e I+D</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <BarChart3 className="h-8 w-8 text-bidata-cyan mb-3" />
              <h3 className="font-semibold text-bidata-dark mb-2">Transformación</h3>
              <p className="text-sm text-bidata-gray">Productividad y eficiencia</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <Globe className="h-8 w-8 text-bidata-cyan mb-3" />
              <h3 className="font-semibold text-bidata-dark mb-2">Mercados</h3>
              <p className="text-sm text-bidata-gray">Acceso e internacionalización</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <Smartphone className="h-8 w-8 text-bidata-cyan mb-3" />
              <h3 className="font-semibold text-bidata-dark mb-2">Digitalización</h3>
              <p className="text-sm text-bidata-gray">Competencias y herramientas digitales</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-bidata-cyan">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para conocer el estado de tu ecosistema empresarial?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            El diagnóstico es gratuito y solo toma 15 minutos completarlo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate('/login')}
              size="lg"
              className="bg-white text-bidata-cyan hover:bg-gray-50 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            >
              Iniciar Sesión
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={() => navigate('/register')}
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-bidata-cyan text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            >
              Registrarse
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-4 bg-bidata-dark">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white/70 mb-4">
            Proyecto de investigación Bi-DATA
          </p>
          <p className="text-white/50 text-sm">
            Desarrollo de herramientas de Business Intelligence y data analytics para fortalecer el ecosistema empresarial MIPYMES
          </p>
        </div>
      </footer>
    </div>
  )
}