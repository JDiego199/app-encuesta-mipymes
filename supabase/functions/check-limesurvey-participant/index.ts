import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const LIMESURVEY_URL = 'https://limesurvey.pruebasbidata.site/index.php/admin/remotecontrol'
const LIMESURVEY_USERNAME = 'admin'
const LIMESURVEY_PASSWORD = 'jBK£@7L64Gev'
const SURVEY_ID = 614997

// Types for LimeSurvey API responses
interface LimeSurveyParticipant {
  tid: number
  token: string
  participant_info: {
    firstname: string
    lastname: string
    email: string
  }
  completed: string | "N" // Date string or "N"
  usesleft: number
}

interface LimeSurveyListParticipantsResponse {
  id: number
  result: LimeSurveyParticipant[] | { status: string }
  error: { message: string; code?: number } | null
}

interface ParticipantStatus {
  status: 'not_found' | 'pending' | 'completed' | 'error'
  completedDate?: string
  usesLeft?: number
  error?: string
  participantData?: LimeSurveyParticipant
}

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

// Function to check participant status in LimeSurvey
async function checkParticipantStatus(sessionKey: string, userToken: string): Promise<ParticipantStatus> {
  const payload = {
    method: 'list_participants',
    params: [
      sessionKey,
      SURVEY_ID,
      0, // Start from first participant
      10, // Limit to 10 participants (should be enough for filtered query)
      false, // Don't get unused tokens only
      ["completed", "completed_date", "usesleft", "email"], // Fields to retrieve
      {"token": userToken} // Filter by specific token (user ID)
    ],
    id: 2
  }

  console.log('Checking participant with token:', userToken)

  const response = await fetch(LIMESURVEY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(`LimeSurvey API error: ${response.status}`)
  }

  const result: LimeSurveyListParticipantsResponse = await response.json()
  
  if (result.error) {
    return {
      status: 'error',
      error: result.error.message || 'Unknown LimeSurvey error'
    }
  }

  // Check if no participants found
  if (typeof result.result === 'object' && 'status' in result.result) {
    if (result.result.status === "No survey participants found.") {
      return {
        status: 'not_found'
      }
    }
  }

  // Check if we got participants array
  if (Array.isArray(result.result)) {
    // Since we filtered by token, we should get exactly one participant or empty array
    if (result.result.length === 0) {
      return {
        status: 'not_found'
      }
    }

    const participant = result.result[0] // Should be the only one due to token filter
    
    // Check if survey is completed
    if (participant.completed !== "N") {
      return {
        status: 'completed',
        completedDate: participant.completed,
        usesLeft: participant.usesleft,
        participantData: participant
      }
    }

    // Survey is pending
    return {
      status: 'pending',
      usesLeft: participant.usesleft,
      participantData: participant
    }
  }

  return {
    status: 'error',
    error: 'Unexpected response format from LimeSurvey'
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

    console.log('Checking participant status for user:', user.id)

    // Get LimeSurvey session key
    const sessionKey = await getLimeSurveySessionKey()
    console.log('Session key obtained')

    let participantStatus: ParticipantStatus
    try {
      // Check participant status using user ID as token
      participantStatus = await checkParticipantStatus(sessionKey, user.id)
      console.log('Participant status:', participantStatus)
    } finally {
      // Always release the session
      await releaseLimeSurveySession(sessionKey)
    }

    return new Response(
      JSON.stringify({ 
        data: participantStatus
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error checking LimeSurvey participant:', error)
    return new Response(
      JSON.stringify({ 
        error: { 
          message: error.message || 'Error interno del servidor',
          type: 'network'
        } 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})