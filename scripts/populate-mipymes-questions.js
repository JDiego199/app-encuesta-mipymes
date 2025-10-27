import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://idahoiszluzixfbkwfth.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkYWhvaXN6bHV6aXhmYmt3ZnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3OTAxMjAsImV4cCI6MjA3MTM2NjEyMH0.NMEJwQOA5RqooRaJmoKf40fsafWICa1ANqeaif7U-eY'

const supabase = createClient(supabaseUrl, supabaseKey)

const surveyId = 'bfb4c2e2-ea0e-406a-b09c-226e883dd417'

const questions = [
  // Información General de la Empresa
  {
    question_text: '¿Cuántos años tiene operando su empresa?',
    question_type: 'number',
    dimension: 'Información General',
    subdimension: 'Antigüedad',
    is_required: true,
    order_index: 1
  },
  {
    question_text: '¿Cuál es el sector económico principal de su empresa?',
    question_type: 'select',
    options: ['Agricultura', 'Manufactura', 'Comercio', 'Servicios', 'Construcción', 'Tecnología', 'Turismo', 'Otro'],
    dimension: 'Información General',
    subdimension: 'Sector Económico',
    is_required: true,
    order_index: 2
  },
  {
    question_text: '¿Cuántos empleados tiene actualmente su empresa?',
    question_type: 'select',
    options: ['1-5 empleados', '6-10 empleados', '11-20 empleados', '21-50 empleados', '51-100 empleados', 'Más de 100 empleados'],
    dimension: 'Información General',
    subdimension: 'Tamaño',
    is_required: true,
    order_index: 3
  },

  // Gestión Financiera
  {
    question_text: '¿Su empresa lleva registros contables formales?',
    question_type: 'radio',
    options: ['Sí, con contador profesional', 'Sí, registros básicos internos', 'No, solo registros informales', 'No lleva registros'],
    dimension: 'Gestión Financiera',
    subdimension: 'Contabilidad',
    is_required: true,
    order_index: 4
  },
  {
    question_text: '¿Con qué frecuencia revisa los estados financieros de su empresa?',
    question_type: 'radio',
    options: ['Mensualmente', 'Trimestralmente', 'Semestralmente', 'Anualmente', 'Nunca'],
    dimension: 'Gestión Financiera',
    subdimension: 'Control Financiero',
    is_required: true,
    order_index: 5
  },
  {
    question_text: '¿Ha solicitado financiamiento bancario en los últimos 2 años?',
    question_type: 'radio',
    options: ['Sí, y fue aprobado', 'Sí, pero fue rechazado', 'No, pero lo necesita', 'No, no lo necesita'],
    dimension: 'Gestión Financiera',
    subdimension: 'Acceso a Financiamiento',
    is_required: true,
    order_index: 6
  },

  // Tecnología e Innovación
  {
    question_text: '¿Su empresa utiliza sistemas digitales para la gestión?',
    question_type: 'checkbox',
    options: ['Sistema de facturación', 'Control de inventarios', 'Gestión de clientes (CRM)', 'Contabilidad digital', 'Ninguno'],
    dimension: 'Tecnología e Innovación',
    subdimension: 'Digitalización',
    is_required: true,
    order_index: 7
  },
  {
    question_text: '¿Qué tan importante considera la innovación para su empresa?',
    question_type: 'likert',
    likert_config: {
      scale_points: 5,
      left_label: 'Nada importante',
      right_label: 'Muy importante'
    },
    dimension: 'Tecnología e Innovación',
    subdimension: 'Cultura de Innovación',
    is_required: true,
    order_index: 8
  },
  {
    question_text: '¿Ha implementado alguna mejora o innovación en el último año?',
    question_type: 'radio',
    options: ['Sí, en productos/servicios', 'Sí, en procesos', 'Sí, en ambos', 'No'],
    dimension: 'Tecnología e Innovación',
    subdimension: 'Implementación de Innovaciones',
    is_required: true,
    order_index: 9
  },

  // Recursos Humanos
  {
    question_text: '¿Cuenta con procesos formales de selección de personal?',
    question_type: 'radio',
    options: ['Sí, muy estructurados', 'Sí, básicos', 'No, contratación informal', 'No aplica (no contrata)'],
    dimension: 'Recursos Humanos',
    subdimension: 'Selección de Personal',
    is_required: true,
    order_index: 10
  },
  {
    question_text: '¿Proporciona capacitación a sus empleados?',
    question_type: 'radio',
    options: ['Regularmente', 'Ocasionalmente', 'Solo cuando es necesario', 'Nunca'],
    dimension: 'Recursos Humanos',
    subdimension: 'Capacitación',
    is_required: true,
    order_index: 11
  },
  {
    question_text: '¿Cómo califica el nivel de satisfacción de sus empleados?',
    question_type: 'scale',
    options: ['1', '2', '3', '4', '5'],
    dimension: 'Recursos Humanos',
    subdimension: 'Clima Laboral',
    is_required: true,
    order_index: 12
  },

  // Marketing y Ventas
  {
    question_text: '¿Qué canales utiliza para promocionar sus productos/servicios?',
    question_type: 'checkbox',
    options: ['Redes sociales', 'Página web', 'Publicidad tradicional', 'Recomendaciones', 'Ferias/eventos', 'Ninguno específico'],
    dimension: 'Marketing y Ventas',
    subdimension: 'Canales de Promoción',
    is_required: true,
    order_index: 13
  },
  {
    question_text: '¿Conoce quiénes son sus principales competidores?',
    question_type: 'radio',
    options: ['Sí, los conozco muy bien', 'Sí, tengo idea general', 'No estoy seguro', 'No los conozco'],
    dimension: 'Marketing y Ventas',
    subdimension: 'Análisis de Competencia',
    is_required: true,
    order_index: 14
  },
  {
    question_text: '¿Realiza estudios de satisfacción de clientes?',
    question_type: 'radio',
    options: ['Regularmente', 'Ocasionalmente', 'Solo cuando hay problemas', 'Nunca'],
    dimension: 'Marketing y Ventas',
    subdimension: 'Satisfacción del Cliente',
    is_required: true,
    order_index: 15
  },

  // Planificación Estratégica
  {
    question_text: '¿Su empresa tiene un plan de negocios formal?',
    question_type: 'radio',
    options: ['Sí, actualizado anualmente', 'Sí, pero desactualizado', 'No, pero tengo planes informales', 'No tengo plan'],
    dimension: 'Planificación Estratégica',
    subdimension: 'Plan de Negocios',
    is_required: true,
    order_index: 16
  },
  {
    question_text: '¿Define objetivos y metas específicas para su empresa?',
    question_type: 'radio',
    options: ['Sí, objetivos claros y medibles', 'Sí, objetivos generales', 'Ocasionalmente', 'No defino objetivos'],
    dimension: 'Planificación Estratégica',
    subdimension: 'Definición de Objetivos',
    is_required: true,
    order_index: 17
  },
  {
    question_text: '¿Con qué frecuencia evalúa el desempeño de su empresa?',
    question_type: 'radio',
    options: ['Mensualmente', 'Trimestralmente', 'Semestralmente', 'Anualmente', 'Nunca'],
    dimension: 'Planificación Estratégica',
    subdimension: 'Evaluación de Desempeño',
    is_required: true,
    order_index: 18
  },

  // Sostenibilidad y Responsabilidad Social
  {
    question_text: '¿Su empresa implementa prácticas ambientalmente responsables?',
    question_type: 'checkbox',
    options: ['Reciclaje', 'Ahorro de energía', 'Uso eficiente del agua', 'Reducción de residuos', 'Ninguna'],
    dimension: 'Sostenibilidad',
    subdimension: 'Prácticas Ambientales',
    is_required: true,
    order_index: 19
  },
  {
    question_text: '¿Participa en actividades de responsabilidad social?',
    question_type: 'radio',
    options: ['Regularmente', 'Ocasionalmente', 'Solo cuando es requerido', 'Nunca'],
    dimension: 'Sostenibilidad',
    subdimension: 'Responsabilidad Social',
    is_required: true,
    order_index: 20
  }
]

async function populateQuestions() {
  console.log('Iniciando población de preguntas...')
  
  try {
    // Primero, eliminar las preguntas existentes para evitar duplicados
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
      
      const { data, error } = await supabase
        .from('survey_questions')
        .insert(questionData)
        .select()
      
      if (error) {
        console.error(`Error insertando pregunta ${question.order_index}:`, error)
      } else {
        console.log(`Pregunta ${question.order_index} insertada: ${question.question_text.substring(0, 50)}...`)
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