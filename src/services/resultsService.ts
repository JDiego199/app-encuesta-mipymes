import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'
import { MetricsData, Metric, SurveyDimension, SurveyQuestion, OverallMetrics } from '@/types/results'

// Type aliases for the actual database structure
interface QuestionRow {
  id: string
  survey_id: string
  question_text: string
  question_type: string
  options: any
  is_required: boolean
  order_index: number
  created_at: string
  dimension: string | null
  subdimension: string | null
  likert_config?: any | null
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

interface QuestionWithResponses extends QuestionRow {
  survey_responses: SurveyResponseRow[]
}

interface SurveyResultsData {
  questions: QuestionWithResponses[]
  userResponses: SurveyResponseRow[]
  totalParticipants: number
}

/**
 * Get survey results data from Supabase
 * @param surveyId - The survey ID
 * @param userId - The user ID to get individual responses
 * @returns Promise with survey results data
 */
export async function getSurveyResults(
  surveyId: string,
  userId: string
): Promise<SurveyResultsData> {
  try {
    // Get all questions for the survey
    const { data: questions, error: questionsError } = await supabase
      .from('survey_questions')
      .select(`
        *,
        survey_responses (*)
      `)
      .eq('survey_id', surveyId)
      .order('order_index', { ascending: true })

    if (questionsError) {
      console.error('Error fetching questions:', questionsError)
      throw new Error(`Failed to fetch questions: ${questionsError.message}`)
    }

    // Get user's participant ID
    const { data: userParticipant, error: userParticipantError } = await supabase
      .from('survey_participants')
      .select('id')
      .eq('user_id', userId)
      .eq('survey_id', surveyId)
      .eq('status', 'completed')
      .single()

    if (userParticipantError) {
      console.error('Error fetching user participant:', userParticipantError)
      throw new Error(`Failed to fetch user participant: ${userParticipantError.message}`)
    }

    // Get user's individual responses
    const { data: userResponses, error: userResponsesError } = await supabase
      .from('survey_responses')
      .select('*')
      .eq('participant_id', userParticipant.id)

    if (userResponsesError) {
      console.error('Error fetching user responses:', userResponsesError)
      throw new Error(`Failed to fetch user responses: ${userResponsesError.message}`)
    }

    // Get total number of completed participants
    const { count: totalParticipants, error: countError } = await supabase
      .from('survey_participants')
      .select('*', { count: 'exact', head: true })
      .eq('survey_id', surveyId)
      .eq('status', 'completed')

    if (countError) {
      console.error('Error counting participants:', countError)
      throw new Error(`Failed to count participants: ${countError.message}`)
    }

    return {
      questions: questions as QuestionWithResponses[],
      userResponses: userResponses || [],
      totalParticipants: totalParticipants || 0
    }
  } catch (error) {
    console.error('Error in getSurveyResults:', error)
    throw error
  }
}

/**
 * Calculate average value for a question based on its type
 * @param question - The question data
 * @param responses - All responses for this question
 * @returns Average value
 */
function calculateQuestionAverage(
  question: QuestionRow,
  responses: SurveyResponseRow[]
): number {
  if (responses.length === 0) return 0

  switch (question.question_type) {
    case 'scale':
    case 'likert':
    case 'number':
      // For numeric questions, calculate arithmetic mean
      const numericValues = responses
        .map(r => {
          const val = parseFloat(r.response_value)
          return isNaN(val) ? null : val
        })
        .filter((val): val is number => val !== null)
      
      if (numericValues.length === 0) return 0
      return numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length

    case 'radio':
    case 'select':
      // For single choice, find the most common option (mode)
      const choiceValues = responses
        .map(r => r.response_value)
        .filter((val): val is string => val !== null && val !== undefined)
      
      if (choiceValues.length === 0) return 0
      
      // Count occurrences of each option
      const counts: Record<string, number> = {}
      choiceValues.forEach(val => {
        counts[val] = (counts[val] || 0) + 1
      })
      
      // Find the most common option and return its index + 1
      const mostCommon = Object.entries(counts)
        .sort(([,a], [,b]) => b - a)[0]?.[0]
      
      if (!mostCommon || !question.options) return 0
      
      const options = Array.isArray(question.options) ? question.options : []
      const index = options.indexOf(mostCommon)
      return index >= 0 ? index + 1 : 0

    case 'checkbox':
      // For checkboxes, calculate average number of selected options
      const checkboxValues = responses
        .map(r => {
          if (r.response_data?.selections && Array.isArray(r.response_data.selections)) {
            return r.response_data.selections.length
          }
          // Fallback: count comma-separated values
          return r.response_value ? r.response_value.split(',').length : 0
        })
      
      if (checkboxValues.length === 0) return 0
      
      return checkboxValues.reduce((sum, count) => sum + count, 0) / checkboxValues.length

    case 'text':
    case 'textarea':
      // For text questions, return percentage of non-empty responses
      const textValues = responses
        .filter(r => r.response_value && r.response_value.trim() !== '')
      
      return (textValues.length / responses.length) * 5 // Scale to 1-5 range

    default:
      return 0
  }
}

/**
 * Get user's response value for a question
 * @param question - The question data
 * @param userResponse - User's response for this question
 * @returns User's response value as a number
 */
function getUserResponseValue(
  question: QuestionRow,
  userResponse: SurveyResponseRow | undefined
): number {
  if (!userResponse) return 0

  switch (question.question_type) {
    case 'scale':
    case 'likert':
    case 'number':
      const numVal = parseFloat(userResponse.response_value)
      return isNaN(numVal) ? 0 : numVal

    case 'radio':
    case 'select':
      if (!userResponse.response_value || !question.options) return 0
      
      const options = Array.isArray(question.options) ? question.options : []
      const index = options.indexOf(userResponse.response_value)
      return index >= 0 ? index + 1 : 0

    case 'checkbox':
      if (userResponse.response_data?.selections && Array.isArray(userResponse.response_data.selections)) {
        return userResponse.response_data.selections.length
      }
      // Fallback: count comma-separated values
      return userResponse.response_value ? userResponse.response_value.split(',').length : 0

    case 'text':
    case 'textarea':
      const hasText = userResponse.response_value && userResponse.response_value.trim() !== ''
      return hasText ? 5 : 0 // Binary: 5 if answered, 0 if not

    default:
      return 0
  }
}

/**
 * Get maximum possible value for a question
 * @param question - The question data
 * @returns Maximum possible value
 */
function getQuestionMaxValue(question: QuestionRow): number {
  switch (question.question_type) {
    case 'scale':
      // Extract scale from options or default to 5
      if (question.options && typeof question.options === 'object' && 'scale_max' in question.options) {
        return question.options.scale_max as number
      }
      return 5

    case 'likert':
      // Extract scale points from options or default to 5
      if (question.options && typeof question.options === 'object' && 'scale_points' in question.options) {
        return question.options.scale_points as number
      }
      return 5

    case 'number':
      // For number inputs, we might have a max value in options
      if (question.options && typeof question.options === 'object' && 'max' in question.options) {
        return question.options.max as number
      }
      return 100 // Default max for number inputs

    case 'radio':
    case 'select':
      // Number of options
      if (Array.isArray(question.options)) {
        return question.options.length
      }
      return 5 // Default

    case 'checkbox':
      // Maximum number of options that can be selected
      if (Array.isArray(question.options)) {
        return question.options.length
      }
      return 5 // Default

    case 'text':
    case 'textarea':
      return 5 // Binary scale: 5 for answered, 0 for not answered

    default:
      return 5
  }
}

/**
 * Group questions by category based on their order and content
 * This maps to the dimensions from the artificial results service
 */
function categorizeQuestions(questions: QuestionWithResponses[]): Record<string, QuestionWithResponses[]> {
  const categories: Record<string, QuestionWithResponses[]> = {
    'Marco Institucional': [],
    'Entorno Operativo / Simplificación de Procedimientos': [],
    'Acceso al Financiamiento': [],
    'Servicios de Desarrollo Empresarial (SDE) y Compras Públicas': [],
    'Innovación y Tecnología': [],
    'Transformación Productiva': [],
    'Acceso a Mercados e Internacionalización': [],
    'Digitalización': []
  }

  // Distribute questions evenly across categories based on order
  const questionsPerCategory = Math.ceil(questions.length / Object.keys(categories).length)
  const categoryNames = Object.keys(categories)

  questions.forEach((question, index) => {
    const categoryIndex = Math.floor(index / questionsPerCategory)
    const categoryName = categoryNames[categoryIndex] || categoryNames[categoryNames.length - 1]
    categories[categoryName].push(question)
  })

  return categories
}

/**
 * Transform survey results data into MetricsData format
 * @param resultsData - Raw survey results data
 * @returns Transformed metrics data
 */

export function transformSurveyResultsToMetrics(resultsData: SurveyResultsData): MetricsData {
  const { questions, userResponses } = resultsData;

  // Crear un mapa rápido de respuestas por ID de pregunta
  const userResponseMap = new Map<string, SurveyResponseRow>();
  userResponses.forEach(response => {
    userResponseMap.set(response.question_id, response);
  });

  // Agrupar preguntas por categoría (dimensión)
  const categorizedQuestions = categorizeQuestions(questions);
  const categories = Object.keys(categorizedQuestions)
    .filter(cat => cat && categorizedQuestions[cat].length > 0 && cat !== 'null'); // 👈 evita categorías vacías o "null"

  // Crear métricas y dimensiones
  const metrics: Metric[] = [];
  const dimensions: SurveyDimension[] = [];

  categories.forEach(categoryName => {
    const categoryQuestions = categorizedQuestions[categoryName];

    // 🔹 Agrupar preguntas por subdimensión dentro de la categoría
    const subdimensionGroups: Record<string, QuestionRow[]> = {};
    categoryQuestions.forEach(question => {
      if (!question.subdimension) return; // 👈 ignora las preguntas sin subdimensión
      const sub = question.subdimension.trim();
      if (!sub) return; // 👈 ignora texto vacío
      if (!subdimensionGroups[sub]) subdimensionGroups[sub] = [];
      subdimensionGroups[sub].push(question);
    });

    const subdimensions = Object.keys(subdimensionGroups);
    if (subdimensions.length === 0) return; // 👈 evita mostrar categorías sin subdimensiones válidas

    // 🔹 Calcular puntajes totales por categoría
    let categoryUserScore = 0;
    let categoryAverageScore = 0;
    let categoryMaxScore = 0;

    // 🔹 Crear una métrica por cada SUBDIMENSIÓN
    subdimensions.forEach(sub => {
      const subQuestions = subdimensionGroups[sub];
      let subUserTotal = 0;
      let subAverageTotal = 0;
      let subMaxTotal = 0;

      subQuestions.forEach(question => {
        const userResponse = userResponseMap.get(question.id);
        const userValue = getUserResponseValue(question, userResponse);
        const averageValue = calculateQuestionAverage(question, (question as any).survey_responses);
        const maxValue = getQuestionMaxValue(question);

        subUserTotal += userValue;
        subAverageTotal += averageValue;
        subMaxTotal += maxValue;
      });

      const count = subQuestions.length || 1;
      const subUserAvg = +(subUserTotal / count).toFixed(1);    
      const subAvg = +(subAverageTotal / count).toFixed(1);     
      const subMax = +(subMaxTotal / count).toFixed(1);         

      metrics.push({
        id: `metric_${categoryName}_${sub}`.replace(/\s+/g, '_'),
        name: sub,
        description: sub, 
        userValue: subUserAvg,
        averageValue: subAvg,
        maxValue: subMax,
        unit: 'puntos',
        category: categoryName
      });

      // Sumar al total de la categoría
      categoryUserScore += subUserAvg;
      categoryAverageScore += subAvg;
      categoryMaxScore += subMax;
    });

    // Crear la dimensión basada en las subdimensiones
    if (subdimensions.length > 0) {
      dimensions.push({
        id: categoryName.toLowerCase().replace(/\s+/g, '_'),
        name: categoryName,
        description: `Análisis de ${categoryName.toLowerCase()}`,
        userScore: +categoryUserScore.toFixed(1),
        averageScore: +categoryAverageScore.toFixed(1),
        maxScore: +categoryMaxScore.toFixed(1),
        subdimensions
      });
    }
  });

  // 🔹 Calcular métricas generales
  const totalUserScore = +metrics.reduce((sum, m) => sum + m.userValue, 0).toFixed(1);
  const totalAverageScore = +metrics.reduce((sum, m) => sum + m.averageValue, 0).toFixed(1);
  const totalMaxScore = +metrics.reduce((sum, m) => sum + m.maxValue, 0).toFixed(1);

  const userPercentage = totalMaxScore > 0 ? (totalUserScore / totalMaxScore) * 100 : 0;
  const percentile = Math.min(95, Math.max(5, Math.round(userPercentage)));

  // 🔹 Identificar áreas fuertes y de mejora
  const strongAreas: string[] = [];
  const improvementAreas: string[] = [];

  dimensions.forEach(dimension => {
    const userPct = dimension.maxScore > 0 ? (dimension.userScore / dimension.maxScore) * 100 : 0;
    const avgPct = dimension.maxScore > 0 ? (dimension.averageScore / dimension.maxScore) * 100 : 0;

    if (userPct > avgPct + 10) strongAreas.push(dimension.name);
    else if (userPct < avgPct - 10) improvementAreas.push(dimension.name);
  });

  if (strongAreas.length === 0 && dimensions.length > 0) {
    const bestDimension = dimensions.reduce((best, current) =>
      (current.userScore / current.maxScore) > (best.userScore / best.maxScore) ? current : best
    );
    strongAreas.push(bestDimension.name);
  }

  if (improvementAreas.length === 0 && dimensions.length > 0) {
    const worstDimension = dimensions.reduce((worst, current) =>
      (current.userScore / current.maxScore) < (worst.userScore / worst.maxScore) ? current : worst
    );
    improvementAreas.push(worstDimension.name);
  }

  return {
    categories,
    metrics,
    overallScore: {
      user: totalUserScore,
      average: totalAverageScore,
      maxScore: totalMaxScore
    },
    percentile,
    strongAreas: strongAreas.slice(0, 3),
    improvementAreas: improvementAreas.slice(0, 3)
  };
}


/**
 * Get participant status for results display
 * @param userId - The user ID
 * @param surveyId - The survey ID
 * @returns Promise with participant status
 */
export async function getParticipantStatusForResults(
  userId: string,
  surveyId: string
): Promise<{
  status: 'not_started' | 'in_progress' | 'completed' | 'loading' | 'error'
  completedDate?: string
  error?: string
}> {
  try {
    const { data, error } = await supabase
      .from('survey_participants')
      .select('status, completed_at')
      .eq('user_id', userId)
      .eq('survey_id', surveyId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error fetching participant status:', error)
      return {
        status: 'error',
        error: `Failed to fetch participant status: ${error.message}`
      }
    }

    if (!data) {
      return { status: 'not_started' }
    }

    return {
      status: data.status as 'not_started' | 'in_progress' | 'completed',
      completedDate: data.completed_at || undefined
    }
  } catch (error) {
    console.error('Error in getParticipantStatusForResults:', error)
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}