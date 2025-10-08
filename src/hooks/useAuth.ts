import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export function useRUCValidation() {
  return useMutation({
    mutationFn: async (ruc: string) => {
      const { data, error } = await supabase.functions.invoke('validate-ruc', {
        body: { ruc }
      })
      
      if (error) throw error
      if (data?.error) throw new Error(data.error.message)
      
      return data.data
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error validando RUC')
    }
  })
}

export function useCreateProfile() {
  const queryClient = useQueryClient()
  const { refreshProfile } = useAuth()

  return useMutation({
    mutationFn: async (profileData: any) => {
      const { data, error } = await supabase.functions.invoke('create-profile', {
        body: profileData
      })
      
      if (error) throw error
      if (data?.error) throw new Error(data.error.message)
      
      return data.data
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error creando perfil')
    },
    onSuccess: async () => {
      toast.success('Perfil creado exitosamente')
      await refreshProfile()
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    }
  })
}

export function useSurveys() {
  return useQuery({
    queryKey: ['surveys'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  })
}

export function useAddLimeSurveyParticipant() {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('add-limesurvey-participant', {
        body: {}
      })
      
      if (error) throw error
      if (data?.error) throw new Error(data.error.message)
      
      return data.data
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error agregando participante a la encuesta')
    },
    onSuccess: () => {
      toast.success('¡Listo para iniciar la encuesta!')
    }
  })
}