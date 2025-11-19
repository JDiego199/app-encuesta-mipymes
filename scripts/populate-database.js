import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// Read survey questions from JSON file
const surveyQuestions = JSON.parse(fs.readFileSync('./src/data/survey-questions.json', 'utf8'))

const supabaseUrl = 'https://idahoiszluzixfbkwfth.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkYWhvaXN6bHV6aXhmYmt3ZnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3OTAxMjAsImV4cCI6MjA3MTM2NjEyMH0.NMEJwQOA5RqooRaJmoKf40fsafWICa1ANqeaif7U-eY'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function populateDatabase() {
  try {
    console.log('Starting database population...')
    
    // 1. Create/update the survey
    console.log('Creating survey...')
    const { data: survey, error: surveyError } = await supabase
      .from('surveys')
      .upsert({
        id: 1,
        title: 'Diagnóstico del Ecosistema Empresarial MIPYMES',
        description: 'Encuesta para evaluar el estado del ecosistema empresarial MIPYMES en Ecuador',
        is_active: true
      })
      .select()
      .single()

    if (surveyError) {
      console.error('Error creating survey:', surveyError)
      return
    }

    console.log('Survey created:', survey.title)

    // 2. Insert questions in batches
    console.log(`Inserting ${surveyQuestions.length} questions...`)
    
    const batchSize = 10
    for (let i = 0; i < surveyQuestions.length; i += batchSize) {
      const batch = surveyQuestions.slice(i, i + batchSize)
      
      // Transform questions to match database schema
      const questionsToInsert = batch.map(q => ({
        id: i + batch.indexOf(q) + 1, // Generate numeric ID
        survey_id: 1, // Use numeric survey ID
        question_text: q.question_text,
        question_type: mapQuestionType(q.question_type),
        options: q.options || q.likert_config || null,
        is_required: q.is_required,
        order_index: q.order_index
      }))

      const { error: insertError } = await supabase
        .from('questions')
        .upsert(questionsToInsert, { onConflict: 'id' })

      if (insertError) {
        console.error(`Error inserting batch ${Math.floor(i / batchSize) + 1}:`, insertError)
      } else {
        console.log(`Inserted batch ${Math.floor(i / batchSize) + 1} (${batch.length} questions)`)
      }
    }

    console.log('✅ Database population completed!')
    
    // Verify insertion
    const { count, error: countError } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('survey_id', 1)

    if (countError) {
      console.error('Error counting questions:', countError)
    } else {
      console.log(`Total questions in database: ${count}`)
    }

  } catch (error) {
    console.error('Error populating database:', error)
  }
}

// Map question types to match database schema
function mapQuestionType(type) {
  switch (type) {
    case 'likert':
      return 'scale'
    case 'radio':
      return 'multiple_choice'
    case 'number':
      return 'scale'
    default:
      return type
  }
}

// Run the script
populateDatabase()