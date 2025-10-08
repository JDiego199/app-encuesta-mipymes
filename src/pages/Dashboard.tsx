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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useLimeSurveyValidation } from "@/hooks/useLimeSurveyValidation";
import { toast } from "sonner";

export function Dashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Use new LimeSurvey validation hook
  const { participantStatus, checkParticipantStatus } =
    useLimeSurveyValidation();

  // Debug logging
  console.log("Dashboard - Current participant status:", participantStatus);

  const handleSurveyAction = async () => {
    console.log(
      "Dashboard - handleSurveyAction called with status:",
      participantStatus.status
    );
    setIsProcessing(true);
    console.log(participantStatus)
    try {
      switch (participantStatus.status) {
        case "not_found":
          console.log("Dashboard - Handling not_found status");
          console.log("Dashboard - About to call handleParticipantRegistration");
          // Automatically register participant and then navigate to survey
          await handleParticipantRegistration();
          console.log("Dashboard - handleParticipantRegistration completed");
          break;
        case "pending":
          console.log(
            "Dashboard - Handling pending status, redirecting to survey"
          );
          // Redirect directly to LimeSurvey
          window.location.href = `https://limesurvey.pruebasbidata.site/index.php/312585?token=${user?.id}`;
          break;
        case "completed":
          console.log(
            "Dashboard - Handling completed status, navigating to /dashboard/resultados"
          );
          // Navigate to results dashboard
          navigate("/dashboard/resultados");
          break;
        case "error":
          console.log("Dashboard - Handling error status, retrying");
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

  const handleParticipantRegistration = async () => {
    console.log("handleParticipantRegistration - Starting registration process");
    console.log("handleParticipantRegistration - User:", user?.id);
    console.log("handleParticipantRegistration - Profile:", profile);
    
    if (!user || !profile) {
      console.error("handleParticipantRegistration - Missing user or profile data");
      toast.error("Información de usuario no disponible");
      return;
    }

    try {
      console.log("handleParticipantRegistration - Calling add-limesurvey-participant Edge Function");

      const requestBody = {
        email: user.email,
        firstname:
          profile.nombre_persona || profile.razon_social || "Usuario",
        lastname: profile.razon_social ? "Empresa" : "Apellido",
      };
      
      console.log("handleParticipantRegistration - Request body:", requestBody);

      const { data, error } = await supabase.functions.invoke(
        "add-limesurvey-participant",
        {
          body: requestBody,
        }
      );

      console.log("handleParticipantRegistration - Edge Function response:", { data, error });

      if (error) {
        console.error("handleParticipantRegistration - Edge Function error:", error);
        throw error;
      }

      if (data?.error) {
        console.error("handleParticipantRegistration - Data error:", data.error);
        throw new Error(data.error.message || data.error);
      }

      console.log("handleParticipantRegistration - Participant registered successfully:", data);
      toast.success("Registro completado exitosamente");

      // Refresh participant status after registration
      console.log("handleParticipantRegistration - Refreshing participant status");
      await checkParticipantStatus();

      // Redirect directly to survey
      console.log("handleParticipantRegistration - Redirecting to survey");
      window.location.href = `https://limesurvey.pruebasbidata.site/index.php/312585?token=${user.id}`;
    } catch (error: any) {
      console.error("handleParticipantRegistration - Error:", error);
      const errorMessage = error.message || "Error al registrar participante";
      toast.error(errorMessage);
      throw error;
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
        return {
          text: "Iniciar Diagnóstico",
          icon: <FileText className="mr-2 h-5 w-5" />,
          disabled: false,
          description:
            "Participe en nuestro diagnóstico para evaluar el estado del ecosistema empresarial MIPYMES en su región",
        };
      case "pending":
        return {
          text: "Continuar Encuesta",
          icon: <Play className="mr-2 h-5 w-5" />,
          disabled: false,
          description:
            "Continúe con su diagnóstico del ecosistema empresarial MIPYMES",
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
