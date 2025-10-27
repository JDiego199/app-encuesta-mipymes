import { describe, it, expect, vi, beforeEach } from 'vitest'
import { supabase } from '../../lib/supabase'
import {
  getSurveyQuestions,
  getParticipantStatus,
  createParticipant,
  saveResponse,
  updateParticipantStatus,
  getParticipantResponses,
  getSurvey,
  calculateProgress
} from '../surveyService'

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn()
  }
}))

const mockSupabase = vi.mocked(supabase)

describe('surveyService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getSurveyQuestions', () => {
    it('should fetch questions ordered by order_index', async () => {
      const mockQuestions = [
        { id: 1, survey_id: 1, question_text: 'Question 1', order_index: 1 },
        { id: 2, survey_id: 1, question_text: 'Question 2', order_index: 2 }
      ]

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockQuestions, error: null })
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      const result = await getSurveyQuestions(1)

      expect(mockSupabase.from).toHaveBeenCalledWith('questions')
      expect(mockQuery.select).toHaveBeenCalledWith('*')
      expect(mockQuery.eq).toHaveBeenCalledWith('survey_id', 1)
      expect(mockQuery.order).toHaveBeenCalledWith('order_index', { ascending: true })
      expect(result).toEqual(mockQuestions)
    })

    it('should throw error when database query fails', async () => {
      const mockError = { message: 'Database error' }
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: mockError })
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      await expect(getSurveyQuestions(1)).rejects.toThrow('Failed to fetch survey questions: Database error')
    })
  })

  describe('getParticipantStatus', () => {
    it('should fetch participant status', async () => {
      const mockParticipant = {
        id: 1,
        user_id: 'user-123',
        survey_id: 1,
        status: 'in_progress' as const
      }

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockParticipant, error: null })
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      const result = await getParticipantStatus('user-123', 1)

      expect(mockSupabase.from).toHaveBeenCalledWith('survey_responses')
      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', 'user-123')
      expect(mockQuery.eq).toHaveBeenCalledWith('survey_id', 1)
      expect(result).toEqual(mockParticipant)
    })

    it('should return null when participant not found', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } })
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      const result = await getParticipantStatus('user-123', 1)

      expect(result).toBeNull()
    })
  })

  describe('createParticipant', () => {
    it('should create a new participant', async () => {
      const mockParticipant = {
        id: 1,
        user_id: 'user-123',
        survey_id: 1,
        status: 'in_progress' as const,
        started_at: '2024-01-01T00:00:00Z',
        progress_percentage: 0
      }

      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockParticipant, error: null })
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      const result = await createParticipant('user-123', 1)

      expect(mockSupabase.from).toHaveBeenCalledWith('survey_responses')
      expect(mockQuery.insert).toHaveBeenCalledWith({
        user_id: 'user-123',
        survey_id: 1,
        status: 'in_progress',
        started_at: expect.any(String),
        progress_percentage: 0
      })
      expect(result).toEqual(mockParticipant)
    })
  })

  describe('saveResponse', () => {
    it('should save text response', async () => {
      const mockResponse = {
        id: 1,
        survey_response_id: 1,
        question_id: 1,
        answer_text: 'Test answer'
      }

      const mockQuery = {
        upsert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockResponse, error: null })
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      const result = await saveResponse(1, 1, 'Test answer')

      expect(mockSupabase.from).toHaveBeenCalledWith('question_responses')
      expect(mockQuery.upsert).toHaveBeenCalledWith({
        survey_response_id: 1,
        question_id: 1,
        answer_text: 'Test answer'
      }, { onConflict: 'survey_response_id,question_id' })
      expect(result).toEqual(mockResponse)
    })

    it('should save number response', async () => {
      const mockResponse = {
        id: 1,
        survey_response_id: 1,
        question_id: 1,
        answer_number: 5
      }

      const mockQuery = {
        upsert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockResponse, error: null })
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      const result = await saveResponse(1, 1, 5)

      expect(mockQuery.upsert).toHaveBeenCalledWith({
        survey_response_id: 1,
        question_id: 1,
        answer_number: 5
      }, { onConflict: 'survey_response_id,question_id' })
      expect(result).toEqual(mockResponse)
    })

    it('should save boolean response', async () => {
      const mockResponse = {
        id: 1,
        survey_response_id: 1,
        question_id: 1,
        answer_boolean: true
      }

      const mockQuery = {
        upsert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockResponse, error: null })
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      const result = await saveResponse(1, 1, true)

      expect(mockQuery.upsert).toHaveBeenCalledWith({
        survey_response_id: 1,
        question_id: 1,
        answer_boolean: true
      }, { onConflict: 'survey_response_id,question_id' })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('updateParticipantStatus', () => {
    it('should update status to completed', async () => {
      const mockParticipant = {
        id: 1,
        status: 'completed' as const,
        completed_at: '2024-01-01T00:00:00Z',
        progress_percentage: 100
      }

      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockParticipant, error: null })
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      const result = await updateParticipantStatus(1, 'completed')

      expect(mockSupabase.from).toHaveBeenCalledWith('survey_responses')
      expect(mockQuery.update).toHaveBeenCalledWith({
        status: 'completed',
        updated_at: expect.any(String),
        completed_at: expect.any(String),
        progress_percentage: 100
      })
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 1)
      expect(result).toEqual(mockParticipant)
    })

    it('should update status to in_progress with custom progress', async () => {
      const mockParticipant = {
        id: 1,
        status: 'in_progress' as const,
        progress_percentage: 50
      }

      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockParticipant, error: null })
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      const result = await updateParticipantStatus(1, 'in_progress', 50)

      expect(mockQuery.update).toHaveBeenCalledWith({
        status: 'in_progress',
        updated_at: expect.any(String),
        progress_percentage: 50
      })
      expect(result).toEqual(mockParticipant)
    })
  })

  describe('getParticipantResponses', () => {
    it('should fetch all responses for a participant', async () => {
      const mockResponses = [
        { id: 1, survey_response_id: 1, question_id: 1, answer_text: 'Answer 1' },
        { id: 2, survey_response_id: 1, question_id: 2, answer_number: 5 }
      ]

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: mockResponses, error: null })
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      const result = await getParticipantResponses(1)

      expect(mockSupabase.from).toHaveBeenCalledWith('question_responses')
      expect(mockQuery.eq).toHaveBeenCalledWith('survey_response_id', 1)
      expect(result).toEqual(mockResponses)
    })
  })

  describe('getSurvey', () => {
    it('should fetch survey details', async () => {
      const mockSurvey = {
        id: 1,
        title: 'Test Survey',
        description: 'A test survey',
        is_active: true
      }

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockSurvey, error: null })
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      const result = await getSurvey(1)

      expect(mockSupabase.from).toHaveBeenCalledWith('surveys')
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 1)
      expect(result).toEqual(mockSurvey)
    })
  })

  describe('calculateProgress', () => {
    it('should calculate progress percentage', async () => {
      const mockResponses = [
        { id: 1, survey_response_id: 1, question_id: 1 },
        { id: 2, survey_response_id: 1, question_id: 2 }
      ]

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: mockResponses, error: null })
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      const result = await calculateProgress(1, 4)

      expect(result).toBe(50) // 2 out of 4 questions = 50%
    })

    it('should return 0 on error', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: null, error: { message: 'Error' } })
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      const result = await calculateProgress(1, 4)

      expect(result).toBe(0)
    })
  })
})