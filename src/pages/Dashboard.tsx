import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Loader2, Target, Play, BarChart3 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { InternalSurveyService } from "@/services/internalSurveyService";
import { toast } from "sonner";

export function Dashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [participantStatus, setParticipantStatus] = useState<{
    status: 'loading' | 'not_found' | 'not_started' | 'in_progress' | 'completed' | 'error';
    error?: string;
    currentQuestionIndex?: number;
    progressPercentage?: number;
  }>({ status: 'loading' });

  // Debug logging
  console.log("Dashboard - Current participant status:", participantStatus);

  // Check participant status using internal survey service
  const checkParticipantStatus = useCallback(async () => {
    if (!user) {
      setParticipantStatus({ status: 'error', error: 'Usuario no autenticado' });
      return;
    }

    try {
      console.log("Dashboard - Checking participant status for user:", user.id);
      const status = await InternalSurveyService.getParticipantStatus(user.id);
      console.log("Dashboard - Participant status:", status);
      
      setParticipantStatus({
        status: status.status,
        currentQuestionIndex: status.currentQuestionIndex,
        progressPercentage: status.progressPercentage
      });
    } catch (error) {
      console.error("Dashboard - Error checking participant status:", error);
      setParticipantStatus({ 
        status: 'error', 
        error: 'Error al verificar estado de participación' 
      });
    }
  }, [user]);

  // Load participant status on component mount
  useEffect(() => {
    if (user) {
      checkParticipantStatus();
    }
  }, [user, checkParticipantStatus]);

  const handleSurveyAction = async () => {
    console.log(
      "Dashboard - handleSurveyAction called with status:",
      participantStatus.status
    );
    setIsProcessing(true);
    
    try {
      switch (participantStatus.status) {
        case "not_found":
        case "not_started":
          console.log("Dashboard - Starting new survey");
          // Navigate to survey page with default survey ID
          navigate("/survey/bfb4c2e2-ea0e-406a-b09c-226e883dd417");
          break;
        case "in_progress":
          console.log("Dashboard - Continuing survey in progress");
          // Navigate to survey page to continue with default survey ID
          navigate("/survey/bfb4c2e2-ea0e-406a-b09c-226e883dd417");
          break;
        case "completed":
          console.log("Dashboard - Navigating to results");
          // Navigate to results dashboard
          navigate("/dashboard/resultados");
          break;
        case "error":
          console.log("Dashboard - Retrying status check");
          await checkParticipantStatus();
          break;
        default:
          console.warn(
            "Unexpected status for survey action:",
            participantStatus.status
          );
      }
    } catch (error) {
      console.error("Error handling survey action:", error);
      toast.error("Error al procesar la acción. Intente nuevamente.");
    } finally {
      setIsProcessing(false);
    }
  };



  // Get button configuration based on participant status
  const getButtonConfig = () => {
    console.log(
      "Dashboard - getButtonConfig called with status:",
      participantStatus.status
    );
    switch (participantStatus.status) {
      case "loading":
        return {
          text: "Verificando estado...",
          icon: <Loader2 className="mr-2 h-5 w-5 animate-spin" />,
          disabled: true,
          description: "Verificando su estado de participación...",
        };
      case "not_found":
      case "not_started":
        return {
          text: "Iniciar Diagnóstico",
          icon: <FileText className="mr-2 h-5 w-5" />,
          disabled: false,
          description:
            "Participe en nuestro diagnóstico interno para evaluar el estado del ecosistema empresarial MIPYMES en su región",
        };
      case "in_progress":
        return {
          text: "Continuar Encuesta",
          icon: <Play className="mr-2 h-5 w-5" />,
          disabled: false,
          description: participantStatus.progressPercentage 
            ? `Continúe con su diagnóstico del ecosistema empresarial MIPYMES (${participantStatus.progressPercentage}% completado)`
            : "Continúe con su diagnóstico del ecosistema empresarial MIPYMES",
        };
      case "completed":
        return {
          text: "Ver Resultados",
          icon: <BarChart3 className="mr-2 h-5 w-5" />,
          disabled: false,
          description:
            "Ya completó el diagnóstico. Puede ver sus resultados cuando guste",
        };
      case "error":
        return {
          text: "Error - Reintentar",
          icon: <FileText className="mr-2 h-5 w-5" />,
          disabled: false,
          description:
            participantStatus.error ||
            "Ocurrió un error al verificar su estado de participación",
        };
      default:
        return {
          text: "Iniciar Diagnóstico",
          icon: <FileText className="mr-2 h-5 w-5" />,
          disabled: false,
          description:
            "Participe en nuestro diagnóstico para evaluar el estado del ecosistema empresarial MIPYMES en su región",
        };
    }
  };

  const buttonConfig = getButtonConfig();
  console.log("Dashboard - Button config:", buttonConfig);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* Welcome Section */}
          <div className="mb-12">
            <div className="w-20 h-20 bg-bidata-cyan rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-bidata-dark mb-4">
              Bienvenido, {profile?.nombre_persona || profile?.razon_social}
            </h1>
            <p className="text-xl text-bidata-gray mb-2">
              {profile?.razon_social}
            </p>
            <p className="text-lg text-bidata-gray">
              RUC: {profile?.ruc} • {profile?.ciudad}
            </p>
          </div>

          {/* Survey Card */}
          <Card className="max-w-lg mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-bidata-cyan/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-bidata-cyan" />
              </div>
              <CardTitle className="text-2xl text-bidata-dark mb-2">
                Diagnóstico del Ecosistema Empresarial
              </CardTitle>
              <CardDescription className="text-base text-bidata-gray">
                {buttonConfig.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-sm text-bidata-gray">
                  <div className="w-2 h-2 bg-bidata-cyan rounded-full mr-3"></div>
                  <span>32 preguntas sobre 8 dimensiones clave</span>
                </div>
                <div className="flex items-center text-sm text-bidata-gray">
                  <div className="w-2 h-2 bg-bidata-cyan rounded-full mr-3"></div>
                  <span>Tiempo estimado: 15-20 minutos</span>
                </div>
                <div className="flex items-center text-sm text-bidata-gray">
                  <div className="w-2 h-2 bg-bidata-cyan rounded-full mr-3"></div>
                  <span>Resultados inmediatos al completar</span>
                </div>
              </div>

              <Button
                onClick={handleSurveyAction}
                disabled={buttonConfig.disabled || isProcessing}
                className="w-full bg-bidata-cyan hover:bg-bidata-cyan/90 text-white text-lg py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    {buttonConfig.icon}
                    {buttonConfig.text}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Info Section */}
          <div className="mt-12 text-center">
            <p className="text-sm text-bidata-gray mb-2">
              <strong>Proyecto:</strong>Desarrollo de herramientas de
              Business Intelligence y data analytics para fortalecer el
              ecosistema empresarial MIPYMES
            </p>
            <p className="text-xs text-bidata-gray">
              Sus respuestas son confidenciales y serán utilizadas únicamente
              para fines de investigación académica
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
