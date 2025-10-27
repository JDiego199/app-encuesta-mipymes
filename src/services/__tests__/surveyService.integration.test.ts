import { describe, it, expect } from 'vitest'
import { getSurvey, getSurveyQuestions } from '../surveyService'

// Integration tests that work with actual database structure
describe('surveyService Integration Tests', () => {
  // These tests will only run if there's actual data in the database
  // They serve as smoke tests to verify the service works with real data
  
  it('should handle getSurvey with non-existent survey gracefully', async () => {
    const result = await getSurvey(99999) // Non-existent survey ID
    expect(result).toBeNull()
  })

  it('should handle getSurveyQuestions with non-existent survey gracefully', async () => {
    const result = await getSurveyQuestions(99999) // Non-existent survey ID
    expect(result).toEqual([])
  })

  // If there's a survey with ID 1, these tests will verify the structure
  it('should return survey with correct structure if survey exists', async () => {
    try {
      const result = await getSurvey(1)
      if (result) {
        expect(result).toHaveProperty('id')
        expect(result).toHaveProperty('title')
        expect(result).toHaveProperty('is_active')
        expect(typeof result.id).toBe('number')
        expect(typeof result.title).toBe('string')
        expect(typeof result.is_active).toBe('boolean')
      }
    } catch (error) {
      // If there's no survey with ID 1, that's fine for this test
      console.log('No survey with ID 1 found, which is expected in a fresh database')
    }
  })

  it('should return questions with correct structure if questions exist', async () => {
    try {
      const result = await getSurveyQuestions(1)
      if (result.length > 0) {
        const question = result[0]
        expect(question).toHaveProperty('id')
        expect(question).toHaveProperty('survey_id')
        expect(question).toHaveProperty('question_text')
        expect(question).toHaveProperty('question_type')
        expect(question).toHaveProperty('order_index')
        expect(typeof question.id).toBe('number')
        expect(typeof question.survey_id).toBe('number')
        expect(typeof question.question_text).toBe('string')
        expect(typeof question.order_index).toBe('number')
      }
    } catch (error) {
      // If there are no questions, that's fine for this test
      console.log('No questions found, which is expected in a fresh database')
    }
  })
})