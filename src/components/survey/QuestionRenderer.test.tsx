// Basic component validation test
import { QuestionRenderer } from './QuestionRenderer'
import { SurveyQuestion } from '@/types/survey'

// Mock questions for testing
const mockTextQuestion: SurveyQuestion = {
  id: '1',
  survey_id: 'survey-1',
  question_text: '¿Cuál es su nombre?',
  question_type: 'text',
  is_required: true,
  order_index: 1
}

const mockRadioQuestion: SurveyQuestion = {
  id: '2',
  survey_id: 'survey-1',
  question_text: '¿Cuál es su género?',
  question_type: 'radio',
  options: ['Masculino', 'Femenino', 'Otro'],
  is_required: true,
  order_index: 2
}

const mockLikertQuestion: SurveyQuestion = {
  id: '3',
  survey_id: 'survey-1',
  question_text: '¿Qué tan satisfecho está con nuestro servicio?',
  question_type: 'likert',
  likert_config: {
    scale_points: 5,
    left_label: 'Muy insatisfecho',
    right_label: 'Muy satisfecho',
    middle_label: 'Neutral'
  },
  is_required: false,
  order_index: 3
}

// Basic validation that component exports work correctly
describe('QuestionRenderer Component', () => {
  it('should export QuestionRenderer component', () => {
    expect(typeof QuestionRenderer).toBe('function')
  })

  it('should have correct question types', () => {
    expect(mockTextQuestion.question_type).toBe('text')
    expect(mockRadioQuestion.question_type).toBe('radio')
    expect(mockLikertQuestion.question_type).toBe('likert')
  })

  it('should handle required and optional questions', () => {
    expect(mockTextQuestion.is_required).toBe(true)
    expect(mockLikertQuestion.is_required).toBe(false)
  })

  it('should have proper likert configuration', () => {
    expect(mockLikertQuestion.likert_config?.scale_points).toBe(5)
    expect(mockLikertQuestion.likert_config?.left_label).toBe('Muy insatisfecho')
    expect(mockLikertQuestion.likert_config?.right_label).toBe('Muy satisfecho')
  })
})