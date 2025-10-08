import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type {
  LimeSurveyParticipantStatus,
  UseLimeSurveyValidationReturn,
  CheckParticipantResponse,
  EdgeFunctionError,
} from "@/types/limesurvey";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export function useLimeSurveyValidation(): UseLimeSurveyValidationReturn {
  const { user } = useAuth();
  const [participantStatus, setParticipantStatus] =
    useState<LimeSurveyParticipantStatus>({
      status: "loading",
    });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const processEdgeFunctionError = (error: any): EdgeFunctionError => {
    // Network or connection errors
    if (error.name === "TypeError" || error.message?.includes("fetch")) {
      return {
        type: "network",
        message: "Error de conexión. Verifique su conexión a internet.",
        retryable: true,
      };
    }

    // Authentication errors
    if (
      error.message?.includes("autenticado") ||
      error.message?.includes("authorization")
    ) {
      return {
        type: "authentication",
        message: "Error de autenticación. Por favor, inicie sesión nuevamente.",
        retryable: false,
      };
    }

    // LimeSurvey API errors
    if (
      error.message?.includes("LimeSurvey") ||
      error.message?.includes("session")
    ) {
      return {
        type: "limesurvey_api",
        message:
          "Error temporal del servicio de encuestas. Intente nuevamente.",
        retryable: true,
      };
    }

    // Default to validation error
    return {
      type: "validation",
      message: error.message || "Error desconocido al validar participación.",
      retryable: true,
    };
  };

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
      console.log("Checking LimeSurvey participant status for user:", user.id);

      const { data: responseData, error: functionError } =
        await supabase.functions.invoke("check-limesurvey-participant", {
          body: {},
        });

      if (functionError) {
        throw functionError;
      }

      if (!responseData) {
        throw new Error("No se recibió respuesta del servidor");
      }

      console.log("LimeSurvey participant status response:", responseData);

      // The Edge Function returns the data directly, not wrapped in a data object
      const data = responseData.data || responseData;

      if (data?.error) {
        const errorMessage =
          typeof data.error === "string"
            ? data.error
            : data.error.message || "Error desconocido";
        throw new Error(errorMessage);
      }

      // Process the response and update state
      const errorMessage = data.error
        ? typeof data.error === "string"
          ? data.error
          : data.error.message
        : undefined;

      const newStatus: LimeSurveyParticipantStatus = {
        status: data.status,
        completedDate: data.completedDate,
        usesLeft: data.usesLeft,
        error: errorMessage,
        participantData: data.participantData,
      };

      console.log("useLimeSurveyValidation - Setting new status:", newStatus);
      setParticipantStatus(newStatus);
      setRetryCount(0); // Reset retry count on success
    } catch (error: any) {
      console.error("Error checking LimeSurvey participant status:", error);

      const processedError = processEdgeFunctionError(error);

      setError(processedError.message);
      setParticipantStatus({
        status: "error",
        error: processedError.message,
      });

      // Show toast for non-retryable errors or after max retries
      if (!processedError.retryable || retryCount >= MAX_RETRIES) {
        toast.error(processedError.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, retryCount]);

  const retry = useCallback(async () => {
    if (retryCount >= MAX_RETRIES) {
      toast.error(
        "Se alcanzó el máximo número de reintentos. Por favor, recargue la página."
      );
      return;
    }

    setRetryCount((prev) => prev + 1);

    // Add delay before retry
    await new Promise((resolve) =>
      setTimeout(resolve, RETRY_DELAY * (retryCount + 1))
    );

    await checkParticipantStatus();
  }, [checkParticipantStatus, retryCount]);

  // Auto-retry for retryable errors
  useEffect(() => {
    if (
      participantStatus.status === "error" &&
      error &&
      retryCount < MAX_RETRIES
    ) {
      const processedError = processEdgeFunctionError(new Error(error));

      if (processedError.retryable) {
        console.log(
          `Auto-retrying in ${RETRY_DELAY * (retryCount + 1)}ms (attempt ${
            retryCount + 1
          }/${MAX_RETRIES})`
        );
        const timeoutId = setTimeout(() => {
          retry();
        }, RETRY_DELAY * (retryCount + 1));

        return () => clearTimeout(timeoutId);
      }
    }
  }, [participantStatus.status, error, retryCount, retry]);

  // Initial check when user is available
  useEffect(() => {
    if (user && participantStatus.status === "loading") {
      console.log(
        "useLimeSurveyValidation - Initial check triggered for user:",
        user.id
      );
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
