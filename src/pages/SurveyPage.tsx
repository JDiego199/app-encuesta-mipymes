import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddLimeSurveyParticipant } from "@/hooks/useAuth";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function SurveyPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const addParticipant = useAddLimeSurveyParticipant();
  const [surveyUrl, setSurveyUrl] = useState<string | null>(null);
  const [isExistingParticipant, setIsExistingParticipant] = useState<
    boolean | null
  >(null);
  const [isCheckingParticipant, setIsCheckingParticipant] = useState(true);

  // Check if user is already a participant
  useEffect(() => {
    const checkParticipantStatus = async () => {
      if (!user) return;

      setIsCheckingParticipant(true);
      try {
        const { data: participant, error } = await supabase
          .from("limesurvey_participants")
          .select("*")
          .eq("user_id", user.id)
          .eq("survey_id", 614997)
          .maybeSingle();

        if (error) {
          console.error("Error checking participant status:", error);
          setIsExistingParticipant(false);
        } else {
          setIsExistingParticipant(!!participant);
        }
      } catch (error) {
        console.error("Error checking participant status:", error);
        setIsExistingParticipant(false);
      } finally {
        setIsCheckingParticipant(false);
      }
    };

    checkParticipantStatus();
  }, [user]);

  // Initialize survey when component mounts
  useEffect(() => {
    const initializeSurvey = async () => {
      if (!user || isCheckingParticipant) return;

      try {
        if (isExistingParticipant) {
          // User is already a participant, redirect directly to survey
          const directSurveyUrl = `https://limesurvey.pruebasbidata.site/index.php/312585?token=${user.id}`;
          window.location.href = directSurveyUrl;
        } else {
          // User is not a participant, add them first
          await addParticipant.mutateAsync();
          // After adding participant, redirect to survey
          const directSurveyUrl = `https://limesurvey.pruebasbidata.site/index.php/312585?token=${user.id}`;
          window.location.href = directSurveyUrl;
        }
      } catch (error) {
        console.error("Error initializing survey:", error);
        // Redirect back to dashboard on error
        navigate("/");
      }
    };

    if (!isCheckingParticipant && isExistingParticipant !== null) {
      initializeSurvey();
    }
  }, [
    user,
    isExistingParticipant,
    isCheckingParticipant,
    addParticipant,
    navigate,
  ]);

  const handleBackToDashboard = () => {
    navigate("/");
  };

  // Loading state
  if (isCheckingParticipant || !surveyUrl) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-bidata-cyan mx-auto mb-4" />
          <p className="text-bidata-gray">
            {isCheckingParticipant
              ? "Verificando estado..."
              : "Cargando encuesta..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-bidata-cyan mx-auto mb-4" />
        <p className="text-bidata-gray">Redirigiendo a la encuesta...</p>
        <Button
          variant="outline"
          onClick={handleBackToDashboard}
          className="mt-4"
        >
          ← Volver al Dashboard
        </Button>
      </div>
    </div>
  );
}
