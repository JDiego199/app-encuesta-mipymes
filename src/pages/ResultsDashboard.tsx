import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader2, BarChart3, Calendar, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResultsMetrics } from "@/components/survey/ResultsMetrics";
import { PDFDownload } from "@/components/survey/PDFDownload";
import { useResultsData } from "@/hooks/useResultsData";

export function ResultsDashboard() {
  const { profile } = useAuth();
  const { metricsData, isLoading, isCompleted, participantStatus } = useResultsData();

  // Navigation guard - only allow access if survey is completed
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-bidata-cyan mx-auto mb-4" />
          <p className="text-bidata-gray">Verificando estado de la encuesta...</p>
        </div>
      </div>
    );
  }

  // Redirect if survey is not completed
  if (!isCompleted) {
    return <Navigate to="/dashboard" replace />;
  }

  // Format completion date
  const formatCompletionDate = (dateString?: string) => {
    if (!dateString) return 'Fecha no disponible';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-bidata-cyan rounded-full flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-bidata-dark">
                    Resultados del Diagnóstico
                  </h1>
                  <p className="text-bidata-gray mt-1">
                    Diagnóstico del Ecosistema Empresarial MIPYMES
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {metricsData && profile && (
                  <PDFDownload
                    userData={{
                      id: profile.id || '',
                      nombre_persona: profile.nombre_persona,
                      razon_social: profile.razon_social,
                      ruc: profile.ruc,
                      ciudad: profile.ciudad
                    }}
                    metricsData={metricsData}
                    completedDate={participantStatus.completedDate || new Date().toISOString()}
                    variant="button"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* User Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-bidata-cyan" />
                Información del Participante
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-bidata-gray">Nombre/Razón Social</p>
                <p className="font-medium text-bidata-dark">
                  {profile?.nombre_persona || profile?.razon_social || 'No disponible'}
                </p>
              </div>
              {profile?.razon_social && profile?.nombre_persona && (
                <div>
                  <p className="text-sm text-bidata-gray">Empresa</p>
                  <p className="font-medium text-bidata-dark">{profile.razon_social}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-bidata-gray">RUC</p>
                <p className="font-medium text-bidata-dark">{profile?.ruc || 'No disponible'}</p>
              </div>
              <div>
                <p className="text-sm text-bidata-gray">Ciudad</p>
                <p className="font-medium text-bidata-dark">{profile?.ciudad || 'No disponible'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-bidata-cyan" />
                Información de Completado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-bidata-gray">Fecha de Completado</p>
                <p className="font-medium text-bidata-dark">
                  {formatCompletionDate(participantStatus.completedDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-bidata-gray">Estado</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="font-medium text-green-700">Completado</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-bidata-gray">Encuesta</p>
                <p className="font-medium text-bidata-dark">
                  Diagnóstico del Ecosistema Empresarial MIPYMES
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Visualization Section */}
        {metricsData ? (
          <ResultsMetrics 
            metricsData={metricsData}
            className="mb-8"
          />
        ) : (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Métricas de Resultados</CardTitle>
                <CardDescription>
                  Sus resultados comparados con el promedio general
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Loader2 className="h-16 w-16 animate-spin text-bidata-cyan mx-auto mb-4" />
                  <p className="text-bidata-gray text-lg mb-2">
                    Generando resultados...
                  </p>
                  <p className="text-bidata-gray/70 text-sm">
                    Procesando sus datos del diagnóstico
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* PDF Download Section */}
        {metricsData && profile && (
          <PDFDownload
            userData={{
              id: profile.id || '',
              nombre_persona: profile.nombre_persona,
              razon_social: profile.razon_social,
              ruc: profile.ruc,
              ciudad: profile.ciudad
            }}
            metricsData={metricsData}
            completedDate={participantStatus.completedDate || new Date().toISOString()}
            variant="card"
            className="mb-8"
          />
        )}

        {/* Footer Info */}
        <div className="text-center text-sm text-bidata-gray">
          <p className="mb-1">
            <strong>Proyecto:</strong>Desarrollo de herramientas de Business Intelligence y data analytics para fortalecer el ecosistema empresarial MIPYMES
          </p>
          <p>
            Sus datos son confidenciales y utilizados únicamente para fines de investigación académica
          </p>
        </div>
      </div>
    </div>
  );
}