import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://idahoiszluzixfbkwfth.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkYWhvaXN6bHV6aXhmYmt3ZnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3OTAxMjAsImV4cCI6MjA3MTM2NjEyMH0.NMEJwQOA5RqooRaJmoKf40fsafWICa1ANqeaif7U-eY'

const supabase = createClient(supabaseUrl, supabaseKey)

const surveyId = 'bfb4c2e2-ea0e-406a-b09c-226e883dd417'

// Preguntas basadas en el CSV - Primero las introductorias (sin dimensión/subdimensión)
const questions = [
  // Preguntas introductorias (h01-h04)
  {
    question_text: '¿Cuántos años tiene operando su empresa?',
    question_type: 'number',
    dimension: null,
    subdimension: null,
    is_required: true,
    order_index: 1
  },
  {
    question_text: '¿Ha tramitado permisos o licencias para su empresa en los últimos 12 meses?',
    question_type: 'radio',
    options: ['Sí', 'No'],
    dimension: null,
    subdimension: null,
    is_required: true,
    order_index: 2
  },
  {
    question_text: '¿Ha utilizado plataformas digitales municipales o estatales para realizar trámites en el último año?',
    question_type: 'radio',
    options: ['Sí', 'No', 'No sabe'],
    dimension: null,
    subdimension: null,
    is_required: true,
    order_index: 3
  },
  {
    question_text: '¿Sabe si su municipio o provincia dispone de trámites en línea aplicables a su actividad económica?',
    question_type: 'radio',
    options: ['Sí', 'No', 'No sabe'],
    dimension: null,
    subdimension: null,
    is_required: true,
    order_index: 4
  },

  // Preguntas del Marco Institucional - Políticas públicas locales y provinciales
  {
    question_text: 'Las autoridades locales/provinciales han publicado políticas o programas claros de fomento productivo o digitalización en los últimos 3 años.',
    question_type: 'likert',
    likert_config: {
      scale_points: 5,
      left_label: 'Muy bajo/Nunca/Totalmente en desacuerdo',
      right_label: 'Muy alto/Siempre/Totalmente de acuerdo'
    },
    dimension: 'Marco Institucional',
    subdimension: 'Políticas públicas locales y provinciales',
    is_required: true,
    order_index: 5
  },
  {
    question_text: 'En mi sector, estas políticas se aplican efectivamente y son accesibles para MIPYMES.',
    question_type: 'likert',
    likert_config: {
      scale_points: 5,
      left_label: 'Muy bajo/Nunca/Totalmente en desacuerdo',
      right_label: 'Muy alto/Siempre/Totalmente de acuerdo'
    },
    dimension: 'Marco Institucional',
    subdimension: 'Políticas públicas locales y provinciales',
    is_required: true,
    order_index: 6
  },
  {
    question_text: 'Conozco incentivos o programas locales (subsidios, líneas de crédito, capacitación) derivados de políticas territoriales.',
    question_type: 'likert',
    likert_config: {
      scale_points: 5,
      left_label: 'Muy bajo/Nunca/Totalmente en desacuerdo',
      right_label: 'Muy alto/Siempre/Totalmente de acuerdo'
    },
    dimension: 'Marco Institucional',
    subdimension: 'Políticas públicas locales y provinciales',
    is_required: true,
    order_index: 7
  },

  // Marco Institucional - Instituciones de apoyo empresarial
  {
    question_text: 'Mi empresa conoce los servicios de apoyo institucional disponibles en la zona (como capacitaciones, asesorías, financiamiento o asistencia técnica).',
    question_type: 'likert',
    likert_config: {
      scale_points: 5,
      left_label: 'Muy bajo/Nunca/Totalmente en desacuerdo',
      right_label: 'Muy alto/Siempre/Totalmente de acuerdo'
    },
    dimension: 'Marco Institucional',
    subdimension: 'Instituciones de apoyo empresarial',
    is_required: true,
    order_index: 8
  },
  {
    question_text: 'Los servicios que brindan estas instituciones son accesibles y de fácil uso para mi empresa.',
    question_type: 'likert',
    likert_config: {
      scale_points: 5,
      left_label: 'Muy bajo/Nunca/Totalmente en desacuerdo',
      right_label: 'Muy alto/Siempre/Totalmente de acuerdo'
    },
    dimension: 'Marco Institucional',
    subdimension: 'Instituciones de apoyo empresarial',
    is_required: true,
    order_index: 9
  },
  {
    question_text: 'He utilizado al menos un servicio (asesoría, capacitación, asesoría técnica) provisto por estas instituciones en los últimos 12 meses.',
    question_type: 'likert',
    likert_config: {
      scale_points: 5,
      left_label: 'Muy bajo/Nunca/Totalmente en desacuerdo',
      right_label: 'Muy alto/Siempre/Totalmente de acuerdo'
    },
    dimension: 'Marco Institucional',
    subdimension: 'Instituciones de apoyo empresarial',
    is_required: true,
    order_index: 10
  },

  // Marco Institucional - Regulación y normativas
  {
    question_text: 'Las normativas para registro, licencias y tributación son claras y comprensibles para mi empresa.',
    question_type: 'likert',
    likert_config: {
      scale_points: 5,
      left_label: 'Muy bajo/Nunca/Totalmente en desacuerdo',
      right_label: 'Muy alto/Siempre/Totalmente de acuerdo'
    },
    dimension: 'Marco Institucional',
    subdimension: 'Regulación y normativas',
    is_required: true,
    order_index: 11
  },
  {
    question_text: 'El tiempo estimado que informan las autoridades para obtener permisos o licencias se cumple en la práctica.',
    question_type: 'likert',
    likert_config: {
      scale_points: 5,
      left_label: 'Muy bajo/Nunca/Totalmente en desacuerdo',
      right_label: 'Muy alto/Siempre/Totalmente de acuerdo'
    },
    dimension: 'Marco Institucional',
    subdimension: 'Regulación y normativas',
    is_required: true,
    order_index: 12
  },
  {
    question_text: 'La interpretación y cumplimiento de las normativas no requiere de intermediarios o pagos informales.',
    question_type: 'likert',
    likert_config: {
      scale_points: 5,
      left_label: 'Muy bajo/Nunca/Totalmente en desacuerdo',
      right_label: 'Muy alto/Siempre/Totalmente de acuerdo'
    },
    dimension: 'Marco Institucional',
    subdimension: 'Regulación y normativas',
    is_required: true,
    order_index: 13
  },

  // Marco Institucional - Coordinación interinstitucional
  {
    question_text: 'En mi zona existe colaboración entre instituciones locales (públicas, privadas y académicas) para apoyar a las empresas.',
    question_type: 'likert',
    likert_config: {
      scale_points: 5,
      left_label: 'Muy bajo/Nunca/Totalmente en desacuerdo',
      right_label: 'Muy alto/Siempre/Totalmente de acuerdo'
    },
    dimension: 'Marco Institucional',
    subdimension: 'Coordinación interinstitucional',
    is_required: true,
    order_index: 14
  },
  {
    question_text: 'Mi empresa ha recibido o participado en iniciativas impulsadas por diferentes actores locales (públicos o privados) durante los últimos 2 años.',
    question_type: 'likert',
    likert_config: {
      scale_points: 5,
      left_label: 'Muy bajo/Nunca/Totalmente en desacuerdo',
      right_label: 'Muy alto/Siempre/Totalmente de acuerdo'
    },
    dimension: 'Marco Institucional',
    subdimension: 'Coordinación interinstitucional',
    is_required: true,
    order_index: 15
  },
  {
    question_text: 'Percibo que la coordinación interinstitucional facilita el acceso a recursos (financiamiento, asesoría) para MIPYMES.',
    question_type: 'likert',
    likert_config: {
      scale_points: 5,
      left_label: 'Muy bajo/Nunca/Totalmente en desacuerdo',
      right_label: 'Muy alto/Siempre/Totalmente de acuerdo'
    },
    dimension: 'Marco Institucional',
    subdimension: 'Coordinación interinstitucional',
    is_required: true,
    order_index: 16
  },

  // Entorno operativo - Trámites en línea y ventanilla única
  {
    question_text: 'Los trámites municipales/provinciales que necesito están disponibles en línea.',
    question_type: 'likert',
    likert_config: {
      scale_points: 5,
      left_label: 'Muy bajo/Nunca/Totalmente en desacuerdo',
      right_label: 'Muy alto/Siempre/Totalmente de acuerdo'
    },
    dimension: 'Entorno operativo / Simplificación de procedimientos',
    subdimension: 'Trámites en línea y ventanilla única',
    is_required: true,
    order_index: 17
  },
  {
    question_text: 'He utilizado la ventanilla única y los trámites en línea han reducido el tiempo de gestión.',
    question_type: 'likert',
    likert_config: {
      scale_points: 5,
      left_label: 'Muy bajo/Nunca/Totalmente en desacuerdo',
      right_label: 'Muy alto/Siempre/Totalmente de acuerdo'
    },
    dimension: 'Entorno operativo / Simplificación de procedimientos',
    subdimension: 'Trámites en línea y ventanilla única',
    is_required: true,
    order_index: 18
  },
  {
    question_text: 'La ventanilla única municipal funciona de forma confiable (documentación, citas, notificaciones electrónicas).',
    question_type: 'likert',
    likert_config: {
      scale_points: 5,
      left_label: 'Muy bajo/Nunca/Totalmente en desacuerdo',
      right_label: 'Muy alto/Siempre/Totalmente de acuerdo'
    },
    dimension: 'Entorno operativo / Simplificación de procedimientos',
    subdimension: 'Trámites en línea y ventanilla única',
    is_required: true,
    order_index: 19
  },

  // Entorno operativo - Tiempo y costo de trámites
  {
    question_text: 'El tiempo promedio para obtener permisos o licencias es adecuado al tamaño y capacidades de mi empresa.',
    question_type: 'likert',
    likert_config: {
      scale_points: 5,
      left_label: 'Muy bajo/Nunca/Totalmente en desacuerdo',
      right_label: 'Muy alto/Siempre/Totalmente de acuerdo'
    },
    dimension: 'Entorno operativo / Simplificación de procedimientos',
    subdimension: 'Tiempo y costo de trámites',
    is_required: true,
    order_index: 20
  }
]

async function populateQuestions() {
  console.log('Iniciando población de preguntas correctas...')
  
  try {
    // Primero, eliminar las preguntas existentes
    console.log('Eliminando preguntas existentes...')
    const { error: deleteError } = await supabase
      .from('survey_questions')
      .delete()
      .eq('survey_id', surveyId)
    
    if (deleteError) {
      console.error('Error eliminando preguntas existentes:', deleteError)
      return
    }
    
    console.log('Preguntas existentes eliminadas')
    
    // Insertar las nuevas preguntas
    for (const question of questions) {
      const questionData = {
        survey_id: surveyId,
        question_text: question.question_text,
        question_type: question.question_type,
        options: question.options || null,
        likert_config: question.likert_config || null,
        is_required: question.is_required,
        order_index: question.order_index,
        dimension: question.dimension,
        subdimension: question.subdimension
      }
      
      console.log(`Insertando pregunta ${question.order_index}: ${question.question_text.substring(0, 60)}...`)
      
      // Usar función RPC para evitar problemas de RLS
      const { data, error } = await supabase.rpc('insert_survey_question', {
        p_survey_id: surveyId,
        p_question_text: question.question_text,
        p_question_type: question.question_type,
        p_order_index: question.order_index,
        p_options: question.options,
        p_likert_config: question.likert_config,
        p_is_required: question.is_required,
        p_dimension: question.dimension,
        p_subdimension: question.subdimension
      })
      
      if (error) {
        console.error(`Error insertando pregunta ${question.order_index}:`, error)
        // Continuar con la siguiente pregunta
      } else {
        console.log(`✓ Pregunta ${question.order_index} insertada`)
      }
    }
    
    console.log('¡Población de preguntas completada!')
    
    // Verificar el total de preguntas
    const { data: count, error: countError } = await supabase
      .from('survey_questions')
      .select('id', { count: 'exact' })
      .eq('survey_id', surveyId)
    
    if (countError) {
      console.error('Error contando preguntas:', countError)
    } else {
      console.log(`Total de preguntas en la base de datos: ${count.length}`)
    }
    
  } catch (error) {
    console.error('Error general:', error)
  }
}

// Ejecutar el script
populateQuestions()