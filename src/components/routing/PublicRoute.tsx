import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface PublicRouteProps {
  children: ReactNode
  redirectTo?: string
}

export function PublicRoute({ children, redirectTo = '/' }: PublicRouteProps) {
  const { user, loading, isProfileComplete } = useAuth()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bidata-cyan"></div>
      </div>
    )
  }

  // If user is authenticated and has complete profile, redirect to dashboard
  if (user && isProfileComplete) {
    return <Navigate to={redirectTo} replace />
  }

  // If user is authenticated but profile is not complete, redirect to complete profile
  if (user && !isProfileComplete) {
    return <Navigate to="/complete-profile" replace />
  }

  return <>{children}</>
}