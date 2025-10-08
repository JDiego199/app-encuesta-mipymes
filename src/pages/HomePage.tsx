import { useAuth } from '@/contexts/AuthContext'
import { LandingPage } from '@/components/landing/LandingPage'
import { Dashboard } from '@/pages/Dashboard'
import { AppLayout } from '@/components/layout/AppLayout'
import { Navigate } from 'react-router-dom'

export function HomePage() {
  const { user, profile, loading, isProfileComplete } = useAuth()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bidata-cyan"></div>
      </div>
    )
  }

  // If no user, show landing page
  if (!user) {
    return <LandingPage />
  }

  // If user exists but profile is not complete, redirect to complete profile
  if (user && !isProfileComplete) {
    return <Navigate to="/complete-profile" replace />
  }

  // If user and complete profile exist, show dashboard
  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  )
}