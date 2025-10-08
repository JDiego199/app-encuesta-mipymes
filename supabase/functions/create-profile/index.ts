import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Create admin client for potential rollback
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the user from the auth header
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Usuario no autenticado')
    }

    const profileData = await req.json()

    // Validar datos requeridos
    const requiredFields = ['email', 'ruc', 'razonSocial']
    const missingFields = requiredFields.filter(field => !profileData[field])
    
    if (missingFields.length > 0) {
      throw new Error(`Faltan datos requeridos: ${missingFields.join(', ')}`)
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(profileData.email)) {
      throw new Error('Formato de email inválido')
    }
    
    // Validar formato de RUC
    if (!/^\d{13}$/.test(profileData.ruc)) {
      throw new Error('RUC debe tener exactamente 13 dígitos numéricos')
    }

    // Verificar si ya existe un perfil para este usuario
    const { data: existingProfile } = await supabaseClient
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()

    if (existingProfile) {
      throw new Error('Ya existe un perfil para este usuario')
    }

    // Crear el perfil en la base de datos
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .insert({
        id: user.id,
        email: profileData.email,
        ruc: profileData.ruc,
        razon_social: profileData.razonSocial,
        actividad_economica: profileData.actividadEconomica,
        estado_contribuyente: profileData.estadoContribuyente,
        direccion: profileData.direccion || '',
        telefono: profileData.telefono || '',
        role: 'usuario',
        nombre_persona: profileData.nombrePersona,
        nombre_empresa: profileData.nombreEmpresa,
        sector: profileData.sector,
        ciudad: profileData.ciudad,
        sri_data: profileData.sriData
      })
      .select()
      .single()

    if (profileError) {
      console.error('Error creating profile:', profileError)
      
      // Si falla la creación del perfil, intentar eliminar el usuario (rollback)
      if (profileData.rollbackOnFailure) {
        try {
          console.log('Attempting rollback: deleting user', user.id)
          const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)
          if (deleteError) {
            console.error('Rollback failed:', deleteError)
            throw new Error('Error creando el perfil y no se pudo revertir la creación del usuario. Contacte al administrador.')
          } else {
            console.log('Rollback successful: user deleted')
            throw new Error('Error creando el perfil. El registro ha sido cancelado automáticamente.')
          }
        } catch (rollbackError) {
          console.error('Rollback error:', rollbackError)
          throw new Error('Error creando el perfil y error durante el rollback. Contacte al administrador.')
        }
      } else {
        throw new Error('Error creando el perfil: ' + profileError.message)
      }
    }

    return new Response(
      JSON.stringify({ 
        data: { 
          success: true, 
          profile 
        } 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error creating profile:', error)
    return new Response(
      JSON.stringify({ 
        error: { message: error.message || 'Error interno del servidor' } 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})