// Survey-related types for the internal survey system

export interface LikertConfig {
  scale_points: number
  left_label: string
  right_label: string
  middle_label?: string
}

export interface SurveyQuestion {
  id: string
  survey_id: string
  question_text: string
  question_type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'select' | 'scale' | 'number' | 'likert'
  options?: string[]
  likert_config?: LikertConfig
  is_required: boolean
  order_index: number
  dimension?: string
  subdimension?: string
}

export interface SurveyParticipant {
  id: string
  user_id: string
  survey_id: string
  status: 'not_started' | 'in_progress' | 'completed'
  current_question_index: number
  started_at?: string
  completed_at?: string
}

export interface SurveyResponse {
  id: string
  participant_id: string
  question_id: string
  response_value: string
  response_data?: any // For complex responses (multiple selections, etc.)
}

export interface QuestionRendererProps {
  question: SurveyQuestion
  value: any
  onChange: (value: any) => void
  disabled?: boolean
}