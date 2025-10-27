import { createClient } from '@supabase/supabase-js'
import { surveyQuestions } from '../src/data/survey-questions.js'

// You'll need to replace these with your actual Supabase credentials
const supabaseUrl = 'https://idahoiszluzixfbkwfth.supabase.co'
const supabaseKey = 'your-service-role-key-here' // Use service role key for admin operations

const supabase = createClient(supabaseUrl, supabaseKey)

async function populateSurveyQuestions() {
  try {
    console.log(`Inserting ${surveyQuestions.length} questions...`)
    
    // First, ensure the survey exists
    const { data: survey, error: surveyError } = await supabase
      .from('surveys')
      .upsert({
        id: 'mipymes-diagnostico',
        title: 'Diagnóstico del Ecosistema Empresarial MIPYMES',
        description: 'Encuesta para evaluar el estado del ecosistema empresarial MIPYMES en Ecuador',
        is_active: true
      })
      .select()
      .single()

    if (surveyError) {
      console.error('Error creating/updating survey:', surveyError)
      return
    }

    console.log('Survey created/updated:', survey.title)

    // Insert questions in batches to avoid timeout
    const batchSize = 20
    for (let i = 0; i < surveyQuestions.length; i += batchSize) {
      const batch = surveyQuestions.slice(i, i + batchSize)
      
      // Prepare questions for insertion
      const questionsToInsert = batch.map(q => ({
        id: q.id,
        survey_id: survey.id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options || null,
        likert_config: q.likert_config || null,
        dimension: q.dimension || null,
        subdimension: q.subdimension || null,
        is_required: q.is_required,
        order_index: q.order_index
      }))

      const { error: insertError } = await supabase
        .from('survey_questions')
        .upsert(questionsToInsert, { onConflict: 'id' })

      if (insertError) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, insertError)
      } else {
        console.log(`Inserted batch ${i / batchSize + 1} (${batch.length} questions)`)
      }
    }

    console.log('✅ All questions inserted successfully!')
    
    // Verify insertion
    const { count, error: countError } = await supabase
      .from('survey_questions')
      .select('*', { count: 'exact', head: true })
      .eq('survey_id', survey.id)

    if (countError) {
      console.error('Error counting questions:', countError)
    } else {
      console.log(`Total questions in database: ${count}`)
    }

  } catch (error) {
    console.error('Error populating survey questions:', error)
  }
}

// Run the script
populateSurveyQuestions()