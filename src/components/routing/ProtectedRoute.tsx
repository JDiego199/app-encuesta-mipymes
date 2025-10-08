import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  requireProfile?: boolean
}

export function ProtectedRoute({ children, requireProfile = true }: ProtectedRouteProps) {
  const { user, loading, isProfileComplete } = useAuth()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bidata-cyan"></div>
      </div>
    )
  }

  // Redirect to login if no user
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Redirect to complete profile if user exists but profile is not complete and profile is required
  if (requireProfile && user && !isProfileComplete) {
    return <Navigate to="/complete-profile" replace />
  }

  return <>{children}</>
}