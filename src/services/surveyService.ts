import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

// Type aliases for the actual database structure
interface SurveyRow {
  id: string
  title: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

interface QuestionRow {
  id: string
  survey_id: string
  question_text: string
  question_type: string
  options: any
  is_required: boolean
  order_index: number
  created_at: string
}

interface SurveyParticipantRow {
  id: string
  user_id: string
  survey_id: string
  status: string
  current_question_index: number
  started_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

interface SurveyResponseRow {
  id: string
  participant_id: string
  question_id: string
  response_value: string
  response_data: any
  created_at: string
  updated_at: string
}

// Enhanced types for the service
export interface SurveyQuestion extends QuestionRow {
  options?: any
}

export interface SurveyParticipant extends SurveyParticipantRow {
  current_question_index?: number
}

export interface SurveyResponse extends SurveyResponseRow {
  response_value: string
  response_data?: any
}

/**
 * Get all questions for a survey, ordered by order_index
 * @param surveyId - The ID of the survey
 * @returns Promise with array of survey questions
 */
export async function getSurveyQuestions(surveyId: string): Promise<SurveyQuestion[]> {
  try {
    const { data, error } = await supabase
      .from('survey_questions')
      .select('*')
      .eq('survey_id', surveyId)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Error fetching survey questions:', error)
      throw new Error(`Failed to fetch survey questions: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error('Error in getSurveyQuestions:', error)
    throw error
  }
}

/**
 * Get participant status for a user and survey
 * @param userId - The user ID
 * @param surveyId - The survey ID
 * @returns Promise with participant status
 */
export async function getParticipantStatus(
  userId: string, 
  surveyId: string
): Promise<SurveyParticipant | null> {
  try {
    const { data, error } = await supabase
      .from('survey_participants')
      .select('*')
      .eq('user_id', userId)
      .eq('survey_id', surveyId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error fetching participant status:', error)
      throw new Error(`Failed to fetch participant status: ${error.message}`)
    }

    return data || null
  } catch (error) {
    console.error('Error in getParticipantStatus:', error)
    throw error
  }
}

/**
 * Create a new participant for a survey
 * @param userId - The user ID
 * @param surveyId - The survey ID
 * @returns Promise with created participant data
 */
export async function createParticipant(
  userId: string, 
  surveyId: string
): Promise<SurveyParticipant> {
  try {
    const { data, error } = await supabase
      .from('survey_participants')
      .insert({
        user_id: userId,
        survey_id: surveyId,
        status: 'in_progress',
        started_at: new Date().toISOString(),
        current_question_index: 0
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating participant:', error)
      throw new Error(`Failed to create participant: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Error in createParticipant:', error)
    throw error
  }
}

/**
 * Save a response to a specific question
 * @param participantId - The participant ID
 * @param questionId - The question ID
 * @param value - The response value
 * @returns Promise with saved response data
 */
export async function saveResponse(
  participantId: string,
  questionId: string,
  value: any
): Promise<SurveyResponseRow> {
  try {
    let processedValue: string
    let responseData: any = null

    // Process different response types
    if (Array.isArray(value)) {
      // For checkbox responses
      processedValue = value.join(',')
      responseData = { selections: value }
    } else if (typeof value === 'object') {
      processedValue = JSON.stringify(value)
      responseData = value
    } else {
      processedValue = String(value)
    }

    // Use upsert to handle both insert and update cases
    const { data, error } = await supabase
      .from('survey_responses')
      .upsert({
        participant_id: participantId,
        question_id: questionId,
        response_value: processedValue,
        response_data: responseData,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'participant_id,question_id'
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving response:', error)
      throw new Error(`Failed to save response: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Error in saveResponse:', error)
    throw error
  }
}

/**
 * Update participant status
 * @param participantId - The participant ID
 * @param status - The new status
 * @param currentQuestionIndex - Optional current question index
 * @returns Promise with updated participant data
 */
export async function updateParticipantStatus(
  participantId: string,
  status: 'in_progress' | 'completed',
  currentQuestionIndex?: number
): Promise<SurveyParticipant> {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }

    if (currentQuestionIndex !== undefined) {
      updateData.current_question_index = currentQuestionIndex
    }

    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('survey_participants')
      .update(updateData)
      .eq('id', participantId)
      .select()
      .single()

    if (error) {
      console.error('Error updating participant status:', error)
      throw new Error(`Failed to update participant status: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Error in updateParticipantStatus:', error)
    throw error
  }
}

/**
 * Get all responses for a participant
 * @param participantId - The participant ID
 * @returns Promise with array of survey responses
 */
export async function getParticipantResponses(
  participantId: string
): Promise<SurveyResponseRow[]> {
  try {
    const { data, error } = await supabase
      .from('survey_responses')
      .select('*')
      .eq('participant_id', participantId)

    if (error) {
      console.error('Error fetching participant responses:', error)
      throw new Error(`Failed to fetch participant responses: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error('Error in getParticipantResponses:', error)
    throw error
  }
}

/**
 * Get survey details
 * @param surveyId - The survey ID
 * @returns Promise with survey data
 */
export async function getSurvey(surveyId: string): Promise<SurveyRow | null> {
  try {
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .eq('id', surveyId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching survey:', error)
      throw new Error(`Failed to fetch survey: ${error.message}`)
    }

    return data || null
  } catch (error) {
    console.error('Error in getSurvey:', error)
    throw error
  }
}

/**
 * Calculate progress percentage based on answered questions
 * @param participantId - The participant ID
 * @param totalQuestions - Total number of questions in the survey
 * @returns Promise with progress percentage
 */
export async function calculateProgress(
  participantId: string,
  totalQuestions: number
): Promise<number> {
  try {
    const responses = await getParticipantResponses(participantId)
    const answeredQuestions = responses.length
    return Math.round((answeredQuestions / totalQuestions) * 100)
  } catch (error) {
    console.error('Error calculating progress:', error)
    return 0
  }
}