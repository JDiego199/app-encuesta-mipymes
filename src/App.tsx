import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { PublicRoute } from "@/components/routing/PublicRoute";
import { HomePage } from "@/pages/HomePage";
import { LandingPage } from "@/components/landing/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { CompleteProfilePage } from "@/pages/CompleteProfilePage";
import { Dashboard } from "@/pages/Dashboard";
import { ResultsDashboard } from "@/pages/ResultsDashboard";
import { SurveyPage } from "@/pages/SurveyPage";
import { InternalSurveyPage } from "@/pages/InternalSurveyPage";
import { ResetPasswordPage } from "@/pages/ResetPasswordPage";
import { AuthCallbackPage } from "@/pages/AuthCallbackPage";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Home Route - Landing for unauthenticated, Dashboard for authenticated */}
            <Route path="/" element={<HomePage />} />

            {/* Public Routes */}
            <Route
              path="/landing"
              element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />

            {/* Password Reset Route - accessible to all */}
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Auth Callback Route */}
            <Route path="/auth/callback" element={<AuthCallbackPage />} />

            {/* Complete Profile Route - for authenticated users without profile */}
            <Route
              path="/complete-profile"
              element={
                <ProtectedRoute requireProfile={false}>
                  <CompleteProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - require authentication and profile */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/encuesta"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <SurveyPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/survey/:surveyId"
              element={
                <ProtectedRoute>
                  <SurveyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/internal-survey"
              element={
                <ProtectedRoute>
                  <InternalSurveyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/resultados"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ResultsDashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
