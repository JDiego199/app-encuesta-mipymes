import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  PasswordChangeRequest,
  PasswordResetRequest,
  PasswordResetConfirmation,
  PasswordChangeResponse,
  PasswordResetResponse,
  PasswordErrorType,
  passwordErrorMessages,
} from "@/types/password";
import {
  validatePasswordChangeForm,
  validateEmail,
  validatePasswordStrength,
  validatePasswordConfirmation,
} from "@/lib/passwordValidation";

// Helper function to map Supabase errors to our error types
function mapSupabaseError(error: any): PasswordErrorType {
  if (!error) return PasswordErrorType.UNKNOWN_ERROR;

  const errorMessage = error.message?.toLowerCase() || "";

  if (
    errorMessage.includes("invalid_credentials") ||
    errorMessage.includes("invalid login credentials")
  ) {
    return PasswordErrorType.INVALID_CURRENT_PASSWORD;
  }

  if (errorMessage.includes("password") && errorMessage.includes("weak")) {
    return PasswordErrorType.WEAK_PASSWORD;
  }

  if (errorMessage.includes("token") && errorMessage.includes("invalid")) {
    return PasswordErrorType.INVALID_TOKEN;
  }

  if (errorMessage.includes("token") && errorMessage.includes("expired")) {
    return PasswordErrorType.EXPIRED_TOKEN;
  }

  if (
    errorMessage.includes("user not found") ||
    errorMessage.includes("email not found")
  ) {
    return PasswordErrorType.EMAIL_NOT_FOUND;
  }

  if (errorMessage.includes("network") || errorMessage.includes("connection")) {
    return PasswordErrorType.NETWORK_ERROR;
  }

  return PasswordErrorType.UNKNOWN_ERROR;
}

// Validation functions
function validatePasswordChange(
  request: PasswordChangeRequest
): PasswordErrorType | null {
  const validation = validatePasswordChangeForm(
    request.currentPassword,
    request.newPassword,
    request.confirmPassword
  );

  return validation.isValid ? null : validation.error!.type;
}

function validatePasswordReset(
  request: PasswordResetRequest
): PasswordErrorType | null {
  const validation = validateEmail(request.email);
  return validation.isValid ? null : validation.error!.type;
}

function validatePasswordResetConfirmation(
  request: PasswordResetConfirmation
): PasswordErrorType | null {
  // Token is optional if user has an active session
  if (!request.token && request.token !== '') {
    return PasswordErrorType.INVALID_TOKEN;
  }

  const validation = validatePasswordChangeForm(
    "dummy",
    request.newPassword,
    request.confirmPassword
  );
  return validation.isValid ? null : validation.error!.type;
}

/**
 * Hook for changing user password
 * Validates current password and updates to new password
 */
export function usePasswordChange() {
  return useMutation<PasswordChangeResponse, Error, PasswordChangeRequest>({
    mutationFn: async (
      request: PasswordChangeRequest
    ): Promise<PasswordChangeResponse> => {
      try {
        // Client-side validation
        const validationError = validatePasswordChange(request);
        if (validationError) {
          return {
            success: false,
            error: {
              type: validationError,
              message: passwordErrorMessages[validationError],
            },
          };
        }

        // First, verify current password by attempting to sign in
        const { data: currentUser } = await supabase.auth.getUser();
        if (!currentUser.user?.email) {
          return {
            success: false,
            error: {
              type: PasswordErrorType.UNKNOWN_ERROR,
              message: passwordErrorMessages[PasswordErrorType.UNKNOWN_ERROR],
            },
          };
        }

        // Verify current password
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: currentUser.user.email,
          password: request.currentPassword,
        });

        if (signInError) {
          const errorType = mapSupabaseError(signInError);
          return {
            success: false,
            error: {
              type: errorType,
              message: passwordErrorMessages[errorType],
            },
          };
        }

        // Update password
        const { error: updateError } = await supabase.auth.updateUser({
          password: request.newPassword,
        });

        if (updateError) {
          const errorType = mapSupabaseError(updateError);
          return {
            success: false,
            error: {
              type: errorType,
              message: passwordErrorMessages[errorType],
            },
          };
        }

        return { success: true };
      } catch (error: any) {
        const errorType = mapSupabaseError(error);
        return {
          success: false,
          error: {
            type: errorType,
            message: passwordErrorMessages[errorType],
          },
        };
      }
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Contraseña actualizada exitosamente");
      } else if (response.error) {
        toast.error(response.error.message);
      }
    },
    onError: (error) => {
      toast.error("Error al cambiar la contraseña");
      console.error("Password change error:", error);
    },
  });
}

/**
 * Hook for requesting password reset
 * Sends password reset email to user
 */
export function usePasswordReset() {
  return useMutation<PasswordResetResponse, Error, PasswordResetRequest>({
    mutationFn: async (
      request: PasswordResetRequest
    ): Promise<PasswordResetResponse> => {
      try {
        // Client-side validation
        const validationError = validatePasswordReset(request);
        if (validationError) {
          return {
            success: false,
            error: {
              type: validationError,
              message: passwordErrorMessages[validationError],
            },
          };
        }

        // Send password reset email
        const { error } = await supabase.auth.resetPasswordForEmail(
          request.email,
          {
            redirectTo: `${window.location.origin}/reset-password`,
          }
        );

        if (error) {
          const errorType = mapSupabaseError(error);
          return {
            success: false,
            error: {
              type: errorType,
              message: passwordErrorMessages[errorType],
            },
          };
        }

        return { success: true };
      } catch (error: any) {
        const errorType = mapSupabaseError(error);
        return {
          success: false,
          error: {
            type: errorType,
            message: passwordErrorMessages[errorType],
          },
        };
      }
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success(
          "Se ha enviado un email con instrucciones para recuperar tu contraseña"
        );
      } else if (response.error) {
        toast.error(response.error.message);
      }
    },
    onError: (error) => {
      toast.error("Error al solicitar recuperación de contraseña");
      console.error("Password reset error:", error);
    },
  });
}

/**
 * Hook for confirming password reset
 * Used when user clicks the reset link and sets new password
 */
export function usePasswordResetConfirmation() {
  return useMutation<PasswordResetResponse, Error, PasswordResetConfirmation>({
    mutationFn: async (
      request: PasswordResetConfirmation
    ): Promise<PasswordResetResponse> => {
      try {
        // Validate password fields
        console.log('Validating password fields...', { 
          newPassword: request.newPassword?.length, 
          confirmPassword: request.confirmPassword?.length 
        })
        
        const passwordValidation = validatePasswordStrength(request.newPassword);
        if (!passwordValidation.isValid) {
          console.log('Password validation failed:', passwordValidation.error)
          return {
            success: false,
            error: passwordValidation.error!,
          };
        }

        const confirmationValidation = validatePasswordConfirmation(request.newPassword, request.confirmPassword);
        if (!confirmationValidation.isValid) {
          console.log('Password confirmation validation failed:', confirmationValidation.error)
          return {
            success: false,
            error: confirmationValidation.error!,
          };
        }

        // Check if user has a valid session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log('Password reset - checking session:', { session: !!session, error: sessionError })
        
        if (sessionError || !session) {
          console.error('No valid session for password reset:', sessionError)
          return {
            success: false,
            error: {
              type: PasswordErrorType.INVALID_TOKEN,
              message: 'Sesión inválida. Por favor, use un enlace de recuperación válido.',
            },
          };
        }

        // Update the password using the active session
        console.log('Attempting to update password...')
        const { error: updateError } = await supabase.auth.updateUser({
          password: request.newPassword,
        });

        if (updateError) {
          console.error('Password update error:', updateError)
          const errorType = mapSupabaseError(updateError);
          return {
            success: false,
            error: {
              type: errorType,
              message: passwordErrorMessages[errorType],
            },
          };
        }

        console.log('Password updated successfully')
        return { success: true };
      } catch (error: any) {
        console.error('Unexpected error in password reset:', error)
        const errorType = mapSupabaseError(error);
        return {
          success: false,
          error: {
            type: errorType,
            message: passwordErrorMessages[errorType],
          },
        };
      }
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Contraseña restablecida exitosamente");
      } else if (response.error) {
        toast.error(response.error.message);
      }
    },
    onError: (error) => {
      toast.error("Error al restablecer la contraseña");
      console.error("Password reset confirmation error:", error);
    },
  });
}
