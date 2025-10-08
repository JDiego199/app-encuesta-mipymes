import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const LIMESURVEY_URL = 'https://limesurvey.pruebasbidata.site/index.php/admin/remotecontrol'
const LIMESURVEY_USERNAME = 'admin'
const LIMESURVEY_PASSWORD = 'jBK£@7L64Gev'
const SURVEY_ID = 614997

// Function to get LimeSurvey session key
async function getLimeSurveySessionKey(): Promise<string> {
  const payload = {
    method: 'get_session_key',
    params: [LIMESURVEY_USERNAME, LIMESURVEY_PASSWORD],
    id: 1
  }

  const response = await fetch(LIMESURVEY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(`Failed to get session key: ${response.status}`)
  }

  const result = await response.json()
  
  if (result.error) {
    throw new Error(`LimeSurvey session error: ${result.error.message || 'Unknown error'}`)
  }

  return result.result
}

// Function to release LimeSurvey session
async function releaseLimeSurveySession(sessionKey: string): Promise<void> {
  try {
    const payload = {
      method: 'release_session_key',
      params: [sessionKey],
      id: 999
    }

    await fetch(LIMESURVEY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })
  } catch (error) {
    console.error('Error releasing session:', error)
  }
}

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

    // Get the user from the auth header
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Usuario no autenticado')
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      throw new Error('Perfil de usuario no encontrado')
    }

    // Check if participant already exists
    const { data: existingParticipant } = await supabaseClient
      .from('limesurvey_participants')
      .select('*')
      .eq('user_id', user.id)
      .eq('survey_id', SURVEY_ID)
      .single()

    if (existingParticipant) {
      // Return existing participant data
      return new Response(
        JSON.stringify({ 
          data: { 
            success: true,
            participant: existingParticipant,
            surveyUrl: `https://limesurvey.pruebasbidata.site/index.php/${SURVEY_ID}?token=${existingParticipant.token}`
          } 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get LimeSurvey session key
    console.log('Getting LimeSurvey session key...')
    const sessionKey = await getLimeSurveySessionKey()
    console.log('Session key obtained:', sessionKey.substring(0, 10) + '...')

    let limeSurveyResult
    try {
      // Add participant to LimeSurvey
      const participantData = {
        firstname: profile.nombre_persona || profile.razon_social?.split(' ')[0] || 'Usuario',
        lastname: profile.nombre_persona ? profile.razon_social || 'Empresa' : profile.razon_social?.split(' ').slice(1).join(' ') || '',
        email: profile.email,
        language: 'es',
        token: user.id // Use Supabase user ID as token
      }

      const limeSurveyPayload = {
        method: 'add_participants',
        params: [
          sessionKey,
          SURVEY_ID,
          [participantData],
          false // Don't send invitation emails
        ],
        id: 4
      }

      console.log('Sending to LimeSurvey:', JSON.stringify({
        ...limeSurveyPayload,
        params: [
          'SESSION_KEY_HIDDEN',
          limeSurveyPayload.params[1],
          limeSurveyPayload.params[2],
          limeSurveyPayload.params[3]
        ]
      }, null, 2))

      const limeSurveyResponse = await fetch(LIMESURVEY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(limeSurveyPayload)
      })

      if (!limeSurveyResponse.ok) {
        throw new Error(`LimeSurvey API error: ${limeSurveyResponse.status}`)
      }

      limeSurveyResult = await limeSurveyResponse.json()
      console.log('LimeSurvey response:', JSON.stringify(limeSurveyResult, null, 2))

    } finally {
      // Always release the session
      await releaseLimeSurveySession(sessionKey)
    }

    if (limeSurveyResult.error) {
      throw new Error(`LimeSurvey error: ${limeSurveyResult.error.message || 'Unknown error'}`)
    }

    // Check if participant was added successfully or already exists
    let participantToken = user.id
    let participantStatus = 'added'
    
    if (limeSurveyResult.result && limeSurveyResult.result.length > 0) {
      const participant = limeSurveyResult.result[0]
      
      if (participant.errors && participant.errors.token) {
        // Participant already exists
        participantStatus = 'already_exists'
        console.log('Participant already exists in LimeSurvey')
      } else if (participant.token) {
        // Participant added successfully
        participantToken = participant.token
        participantStatus = 'added'
        console.log('Participant added successfully to LimeSurvey')
      }
    }

    // Store or update participant data in our database
    const participantData = {
      user_id: user.id,
      survey_id: SURVEY_ID,
      token: participantToken,
      firstname: profile.nombre_persona || profile.razon_social?.split(' ')[0] || 'Usuario',
      lastname: profile.nombre_persona ? profile.razon_social || 'Empresa' : profile.razon_social?.split(' ').slice(1).join(' ') || '',
      email: profile.email,
      status: participantStatus,
      limesurvey_response: limeSurveyResult
    }

    const { data: participant, error: participantError } = await supabaseClient
      .from('limesurvey_participants')
      .upsert(participantData, { 
        onConflict: 'user_id,survey_id',
        ignoreDuplicates: false 
      })
      .select()
      .single()

    if (participantError) {
      console.error('Error storing participant:', participantError)
      // Continue anyway, as the participant was processed in LimeSurvey
    }

    const surveyUrl = `https://limesurvey.pruebasbidata.site/index.php/${SURVEY_ID}?token=${participantToken}`

    return new Response(
      JSON.stringify({ 
        data: { 
          success: true,
          participant: participant || { token: participantToken },
          surveyUrl,
          status: participantStatus,
          message: participantStatus === 'already_exists' 
            ? 'Participante ya existe en la encuesta' 
            : 'Participante agregado exitosamente'
        } 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error adding LimeSurvey participant:', error)
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