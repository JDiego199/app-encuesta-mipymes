import { supabase } from '@/lib/supabase'
import { SurveyQuestion } from '@/types/survey'

export interface SurveyParticipant {
  id: string
  user_id: string
  survey_id: string
  status: 'in_progress' | 'completed'
  current_question_index: number
  started_at?: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface SurveyResponse {
  id: string
  participant_id: string
  question_id: string
  response_value: string
  response_data?: any
  created_at: string
  updated_at: string
}

export class InternalSurveyService {
  private static readonly SURVEY_ID = 'bfb4c2e2-ea0e-406a-b09c-226e883dd417' // UUID for the survey

  /**
   * Get or create a survey participant for the current user
   */
  static async getOrCreateParticipant(userId: string): Promise<SurveyParticipant> {
    try {
      // First, try to get existing participant
      const { data: existingParticipant, error: fetchError } = await supabase
        .from('survey_participants')
        .select('*')
        .eq('user_id', userId)
        .eq('survey_id', this.SURVEY_ID)
        .maybeSingle()

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError
      }

      if (existingParticipant) {
        return existingParticipant
      }

      // Create new participant
      const { data: newParticipant, error: createError } = await supabase
        .from('survey_participants')
        .insert({
          user_id: userId,
          survey_id: this.SURVEY_ID,
          status: 'in_progress',
          started_at: new Date().toISOString(),
          current_question_index: 0
        })
        .select()
        .single()

      if (createError) {
        throw createError
      }

      return newParticipant
    } catch (error) {
      console.error('Error getting/creating participant:', error)
      throw error
    }
  }

  /**
   * Update participant progress
   */
  static async updateParticipantProgress(
    participantId: string, 
    questionIndex: number, 
    status?: 'in_progress' | 'completed'
  ): Promise<void> {
    try {
      const updateData: any = {
        current_question_index: questionIndex,
        updated_at: new Date().toISOString()
      }

      if (status) {
        updateData.status = status
        
        if (status === 'completed') {
          updateData.completed_at = new Date().toISOString()
        }
      }

      const { error } = await supabase
        .from('survey_participants')
        .update(updateData)
        .eq('id', participantId)

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error updating participant progress:', error)
      throw error
    }
  }

  /**
   * Save a survey response
   */
  static async saveResponse(
    participantId: string,
    questionId: string,
    responseValue: any
  ): Promise<void> {
    try {
      let processedValue: string
      let responseData: any = null

      // Process different response types
      if (Array.isArray(responseValue)) {
        // For checkbox responses
        processedValue = responseValue.join(',')
        responseData = { selections: responseValue }
      } else if (typeof responseValue === 'object') {
        processedValue = JSON.stringify(responseValue)
        responseData = responseValue
      } else {
        processedValue = String(responseValue)
      }

      const { error } = await supabase
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

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error saving response:', error)
      throw error
    }
  }

  /**
   * Get all responses for a participant
   */
  static async getParticipantResponses(participantId: string): Promise<Record<string, any>> {
    try {
      const { data: responses, error } = await supabase
        .from('survey_responses')
        .select('question_id, response_value, response_data')
        .eq('participant_id', participantId)

      if (error) {
        throw error
      }

      const responseMap: Record<string, any> = {}
      
      responses?.forEach(response => {
        if (response.response_data?.selections) {
          // Checkbox responses
          responseMap[response.question_id] = response.response_data.selections
        } else if (response.response_data) {
          // Complex responses
          responseMap[response.question_id] = response.response_data
        } else {
          // Simple responses
          responseMap[response.question_id] = response.response_value
        }
      })

      return responseMap
    } catch (error) {
      console.error('Error getting participant responses:', error)
      throw error
    }
  }

  /**
   * Check if participant has completed the survey
   */
  static async isParticipantCompleted(userId: string): Promise<boolean> {
    try {
      const { data: participant, error } = await supabase
        .from('survey_participants')
        .select('status')
        .eq('user_id', userId)
        .eq('survey_id', this.SURVEY_ID)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      return participant?.status === 'completed'
    } catch (error) {
      console.error('Error checking participant completion:', error)
      return false
    }
  }

  /**
   * Get participant status for dashboard
   */
  static async getParticipantStatus(userId: string): Promise<{
    status: 'not_found' | 'not_started' | 'in_progress' | 'completed'
    currentQuestionIndex?: number
    totalQuestions?: number
    progressPercentage?: number
  }> {
    try {
      const { data: participant, error } = await supabase
        .from('survey_participants')
        .select('*')
        .eq('user_id', userId)
        .eq('survey_id', this.SURVEY_ID)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (!participant) {
        return { status: 'not_found' }
      }

      // Get total questions count
      const { count: totalQuestions } = await supabase
        .from('survey_questions')
        .select('*', { count: 'exact', head: true })
        .eq('survey_id', this.SURVEY_ID)

      const total = totalQuestions || 100
      const progressPercentage = Math.round((participant.current_question_index / total) * 100)

      return {
        status: participant.status as 'in_progress' | 'completed',
        currentQuestionIndex: participant.current_question_index,
        totalQuestions: total,
        progressPercentage
      }
    } catch (error) {
      console.error('Error getting participant status:', error)
      return { status: 'not_found' }
    }
  }
}