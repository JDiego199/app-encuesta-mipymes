import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { InternalSurveyService } from "@/services/internalSurveyService";
import type {
  LimeSurveyParticipantStatus,
  UseLimeSurveyValidationReturn,
} from "@/types/limesurvey";

/**
 * TEMPORARY VERSION of useLimeSurveyValidation
 * 
 * This is a temporary implementation that bypasses LimeSurvey API calls
 * to avoid 500 errors while we complete the migration to the internal survey system.
 * 
 * This hook returns a "not_found" status to allow users to proceed with
 * the internal survey system instead of the failing LimeSurvey integration.
 */
export function useLimeSurveyValidation(): UseLimeSurveyValidationReturn {
  const { user } = useAuth();
  const [participantStatus, setParticipantStatus] =
    useState<LimeSurveyParticipantStatus>({
      status: "loading",
    });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkParticipantStatus = useCallback(async (): Promise<void> => {
    if (!user) {
      setParticipantStatus({
        status: "error",
        error: "Usuario no autenticado",
      });
      setError("Usuario no autenticado");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("TEMP: Checking internal survey status for user:", user.id);
      
      // Check internal survey status instead of LimeSurvey
      const internalStatus = await InternalSurveyService.getParticipantStatus(user.id);
      
      let status: LimeSurveyParticipantStatus["status"];
      
      switch (internalStatus.status) {
        case 'completed':
          status = 'completed';
          break;
        case 'in_progress':
          status = 'pending';
          break;
        case 'not_started':
        case 'not_found':
        default:
          status = 'not_found';
          break;
      }
      
      const newStatus: LimeSurveyParticipantStatus = {
        status,
        error: undefined,
      };

      console.log("TEMP: Internal survey status:", internalStatus, "-> LimeSurvey status:", status);
      setParticipantStatus(newStatus);
    } catch (error: any) {
      console.error("TEMP: Error checking internal survey status:", error);
      
      // If there's an error, set to not_found to allow progression
      setParticipantStatus({
        status: "not_found",
        error: undefined,
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const retry = useCallback(async () => {
    console.log("TEMP: Retry called - redirecting to checkParticipantStatus");
    await checkParticipantStatus();
  }, [checkParticipantStatus]);

  // Initial check when user is available
  useEffect(() => {
    if (user && participantStatus.status === "loading") {
      console.log("TEMP: Initial check triggered for user:", user.id);
      checkParticipantStatus();
    }
  }, [user, checkParticipantStatus]);

  return {
    participantStatus,
    checkParticipantStatus,
    isLoading,
    error,
    retry,
  };
}