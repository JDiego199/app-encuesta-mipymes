import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

export function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          throw error
        }

        if (data.session) {
          setStatus('success')
          setMessage('Email confirmado exitosamente. Redirigiendo...')
          
          // Redirigir después de un breve delay
          setTimeout(() => {
            window.location.href = '/'
          }, 2000)
        } else {
          throw new Error('No se pudo confirmar el email')
        }
      } catch (error: any) {
        console.error('Auth callback error:', error)
        setStatus('error')
        setMessage(error.message || 'Error confirmando el email')
      }
    }

    handleAuthCallback()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="text-center py-8">
          {status === 'loading' && (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-bidata-cyan mx-auto mb-4" />
              <p className="text-bidata-gray">Confirmando su email...</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-4" />
              <p className="text-green-800 font-medium">{message}</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <XCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
              <p className="text-red-800 font-medium">{message}</p>
              <p className="text-sm text-bidata-gray mt-2">
                Por favor, intente nuevamente o contacte soporte.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}