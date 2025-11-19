import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://idahoiszluzixfbkwfth.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkYWhvaXN6bHV6aXhmYmt3ZnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3OTAxMjAsImV4cCI6MjA3MTM2NjEyMH0.NMEJwQOA5RqooRaJmoKf40fsafWICa1ANqeaif7U-eY'

const supabase = createClient(supabaseUrl, supabaseKey)

const surveyId = 'bfb4c2e2-ea0e-406a-b09c-226e883dd417'

// Función para determinar el tipo de pregunta basado en la escala
function getQuestionType(escala) {
  if (escala.includes('Número entero')) return 'number'
  if (escala.includes('Opción:')) return 'radio'
  if (escala.includes('Likert')) return 'likert'
  return 'text'
}

// Función para extraer opciones de radio
function getRadioOptions(escala) {
  if (!escala.includes('Opción:')) return null
  const optionsText = escala.replace('Opción:', '').trim()
  return optionsText.split('/').map(opt => opt.trim())
}

// Todas las 100 preguntas del CSV
const questions = [
  // Preguntas introductorias (h01-h04) - SIN dimensión ni subdimensión
  {
    id_item: 'h01',
    question_text: '¿Cuántos años tiene operando su empresa?',
    dimension: null,
    subdimension: null,
    escala: 'Número entero (años)',
    order_index: 1
  },
  {
    id_item: 'h02',
    question_text: '¿Ha tramitado permisos o licencias para su empresa en los últimos 12 meses?',
    dimension: null,
    subdimension: null,
    escala: 'Opción: Sí / No',
    order_index: 2
  },
  {
    id_item: 'h03',
    question_text: '¿Ha utilizado plataformas digitales municipales o estatales para realizar trámites en el último año?',
    dimension: null,
    subdimension: null,
    escala: 'Opción: Sí / No / No sabe',
    order_index: 3
  },
  {
    id_item: 'h04',
    question_text: '¿Sabe si su municipio o provincia dispone de trámites en línea aplicables a su actividad económica?',
    dimension: null,
    subdimension: null,
    escala: 'Opción: Sí / No / No sabe',
    order_index: 4
  },

  // Preguntas I001-I096 - CON dimensión y subdimensión
  {
    id_item: 'I001',
    question_text: 'Las autoridades locales/provinciales han publicado políticas o programas claros de fomento productivo o digitalización en los últimos 3 años.',
    dimension: 'Marco Institucional',
    subdimension: 'Políticas públicas locales y provinciales',
    escala: 'Likert 1-5',
    order_index: 5
  },
  {
    id_item: 'I002',
    question_text: 'En mi sector, estas políticas se aplican efectivamente y son accesibles para MIPYMES.',
    dimension: 'Marco Institucional',
    subdimension: 'Políticas públicas locales y provinciales',
    escala: 'Likert 1-5',
    order_index: 6
  },
  {
    id_item: 'I003',
    question_text: 'Conozco incentivos o programas locales (subsidios, líneas de crédito, capacitación) derivados de políticas territoriales.',
    dimension: 'Marco Institucional',
    subdimension: 'Políticas públicas locales y provinciales',
    escala: 'Likert 1-5',
    order_index: 7
  },
  {
    id_item: 'I004',
    question_text: 'Mi empresa conoce los servicios de apoyo institucional disponibles en la zona (como capacitaciones, asesorías, financiamiento o asistencia técnica).',
    dimension: 'Marco Institucional',
    subdimension: 'Instituciones de apoyo empresarial',
    escala: 'Likert 1-5',
    order_index: 8
  },
  {
    id_item: 'I005',
    question_text: 'Los servicios que brindan estas instituciones son accesibles y de fácil uso para mi empresa.',
    dimension: 'Marco Institucional',
    subdimension: 'Instituciones de apoyo empresarial',
    escala: 'Likert 1-5',
    order_index: 9
  },
  {
    id_item: 'I006',
    question_text: 'He utilizado al menos un servicio (asesoría, capacitación, asesoría técnica) provisto por estas instituciones en los últimos 12 meses.',
    dimension: 'Marco Institucional',
    subdimension: 'Instituciones de apoyo empresarial',
    escala: 'Likert 1-5',
    order_index: 10
  },
  {
    id_item: 'I007',
    question_text: 'Las normativas para registro, licencias y tributación son claras y comprensibles para mi empresa.',
    dimension: 'Marco Institucional',
    subdimension: 'Regulación y normativas',
    escala: 'Likert 1-5',
    order_index: 11
  },
  {
    id_item: 'I008',
    question_text: 'El tiempo estimado que informan las autoridades para obtener permisos o licencias se cumple en la práctica.',
    dimension: 'Marco Institucional',
    subdimension: 'Regulación y normativas',
    escala: 'Likert 1-5',
    order_index: 12
  },
  {
    id_item: 'I009',
    question_text: 'La interpretación y cumplimiento de las normativas no requiere de intermediarios o pagos informales.',
    dimension: 'Marco Institucional',
    subdimension: 'Regulación y normativas',
    escala: 'Likert 1-5',
    order_index: 13
  },
  {
    id_item: 'I010',
    question_text: 'En mi zona existe colaboración entre instituciones locales (públicas, privadas y académicas) para apoyar a las empresas.',
    dimension: 'Marco Institucional',
    subdimension: 'Coordinación interinstitucional',
    escala: 'Likert 1-5',
    order_index: 14
  },
  {
    id_item: 'I011',
    question_text: 'Mi empresa ha recibido o participado en iniciativas impulsadas por diferentes actores locales (públicos o privados) durante los últimos 2 años.',
    dimension: 'Marco Institucional',
    subdimension: 'Coordinación interinstitucional',
    escala: 'Likert 1-5',
    order_index: 15
  },
  {
    id_item: 'I012',
    question_text: 'Percibo que la coordinación interinstitucional facilita el acceso a recursos (financiamiento, asesoría) para MIPYMES.',
    dimension: 'Marco Institucional',
    subdimension: 'Coordinación interinstitucional',
    escala: 'Likert 1-5',
    order_index: 16
  },
  {
    id_item: 'I013',
    question_text: 'Los trámites municipales/provinciales que necesito están disponibles en línea.',
    dimension: 'Entorno operativo / Simplificación de procedimientos',
    subdimension: 'Trámites en línea y ventanilla única',
    escala: 'Likert 1-5',
    order_index: 17
  },
  {
    id_item: 'I014',
    question_text: 'He utilizado la ventanilla única y los trámites en línea han reducido el tiempo de gestión.',
    dimension: 'Entorno operativo / Simplificación de procedimientos',
    subdimension: 'Trámites en línea y ventanilla única',
    escala: 'Likert 1-5',
    order_index: 18
  },
  {
    id_item: 'I015',
    question_text: 'La ventanilla única municipal funciona de forma confiable (documentación, citas, notificaciones electrónicas).',
    dimension: 'Entorno operativo / Simplificación de procedimientos',
    subdimension: 'Trámites en línea y ventanilla única',
    escala: 'Likert 1-5',
    order_index: 19
  },
  {
    id_item: 'I016',
    question_text: 'El tiempo promedio para obtener permisos o licencias es adecuado al tamaño y capacidades de mi empresa.',
    dimension: 'Entorno operativo / Simplificación de procedimientos',
    subdimension: 'Tiempo y costo de trámites',
    escala: 'Likert 1-5',
    order_index: 20
  },
  {
    id_item: 'I017',
    question_text: 'Los costos administrativos asociados a permisos y registros son manejables para mi empresa.',
    dimension: 'Entorno operativo / Simplificación de procedimientos',
    subdimension: 'Tiempo y costo de trámites',
    escala: 'Likert 1-5',
    order_index: 21
  },
  {
    id_item: 'I018',
    question_text: 'En los últimos 2 años, el tiempo requerido para trámites ha disminuido gracias a mejoras administrativas.',
    dimension: 'Entorno operativo / Simplificación de procedimientos',
    subdimension: 'Tiempo y costo de trámites',
    escala: 'Likert 1-5',
    order_index: 22
  },
  {
    id_item: 'I019',
    question_text: 'La cantidad de requisitos y reportes regulatorios representa una carga administrativa alta para mi empresa.',
    dimension: 'Entorno operativo / Simplificación de procedimientos',
    subdimension: 'Carga regulatoria',
    escala: 'Likert 1-5',
    order_index: 23
  },
  {
    id_item: 'I020',
    question_text: 'Percibo duplicidad de requisitos entre instituciones (municipio, prefectura, SRI, etc.).',
    dimension: 'Entorno operativo / Simplificación de procedimientos',
    subdimension: 'Carga regulatoria',
    escala: 'Likert 1-5',
    order_index: 24
  },
  {
    id_item: 'I021',
    question_text: 'Las inspecciones y controles regulatorios son previsibles y no afectan la operación diaria.',
    dimension: 'Entorno operativo / Simplificación de procedimientos',
    subdimension: 'Carga regulatoria',
    escala: 'Likert 1-5',
    order_index: 25
  },
  {
    id_item: 'I022',
    question_text: 'Mi empresa puede realizar pagos y presentaciones obligatorias (impuestos, informes) completamente en formato digital.',
    dimension: 'Entorno operativo / Simplificación de procedimientos',
    subdimension: 'Digitalización administrativa',
    escala: 'Likert 1-5',
    order_index: 26
  },
  {
    id_item: 'I023',
    question_text: 'Las plataformas digitales de las instituciones públicas que he usado son estables y fáciles de utilizar.',
    dimension: 'Entorno operativo / Simplificación de procedimientos',
    subdimension: 'Digitalización administrativa',
    escala: 'Likert 1-5',
    order_index: 27
  },
  {
    id_item: 'I024',
    question_text: 'Contamos con soporte técnico o guía de las municipalidades para trámites digitales.',
    dimension: 'Entorno operativo / Simplificación de procedimientos',
    subdimension: 'Digitalización administrativa',
    escala: 'Likert 1-5',
    order_index: 28
  },
  {
    id_item: 'I025',
    question_text: 'En mi ciudad existen productos crediticios adecuados para MIPYMES (cooperativas, bancos) de mi sector.',
    dimension: 'Acceso al financiamiento',
    subdimension: 'Oferta de productos financieros locales',
    escala: 'Likert 1-5',
    order_index: 29
  },
  {
    id_item: 'I026',
    question_text: 'He encontrado líneas de crédito específicas para modernización o digitalización.',
    dimension: 'Acceso al financiamiento',
    subdimension: 'Oferta de productos financieros locales',
    escala: 'Likert 1-5',
    order_index: 30
  },
  {
    id_item: 'I027',
    question_text: 'Los plazos y condiciones de los créditos son compatibles con el ciclo de mi negocio.',
    dimension: 'Acceso al financiamiento',
    subdimension: 'Oferta de productos financieros locales',
    escala: 'Likert 1-5',
    order_index: 31
  },
  {
    id_item: 'I028',
    question_text: 'Los requisitos de garantía y documentación para acceder a crédito son razonables para mi empresa.',
    dimension: 'Acceso al financiamiento',
    subdimension: 'Requisitos y garantías',
    escala: 'Likert 1-5',
    order_index: 32
  },
  {
    id_item: 'I029',
    question_text: 'Mi empresa cumple fácilmente con las condiciones para créditos de corto plazo.',
    dimension: 'Acceso al financiamiento',
    subdimension: 'Requisitos y garantías',
    escala: 'Likert 1-5',
    order_index: 33
  },
  {
    id_item: 'I030',
    question_text: 'La valoración de garantías por parte de la institución financiera es transparente.',
    dimension: 'Acceso al financiamiento',
    subdimension: 'Requisitos y garantías',
    escala: 'Likert 1-5',
    order_index: 34
  },
  {
    id_item: 'I031',
    question_text: 'Conozco programas públicos o privados (capital semilla, concursables) disponibles en mi provincia.',
    dimension: 'Acceso al financiamiento',
    subdimension: 'Programas de financiamiento público y privado',
    escala: 'Likert 1-5',
    order_index: 35
  },
  {
    id_item: 'I032',
    question_text: 'Mi empresa ha postulado a algún programa de financiamiento en los últimos 3 años.',
    dimension: 'Acceso al financiamiento',
    subdimension: 'Programas de financiamiento público y privado',
    escala: 'Likert 1-5',
    order_index: 36
  },
  {
    id_item: 'I033',
    question_text: 'Los requisitos de postulación son claros y el proceso es justo.',
    dimension: 'Acceso al financiamiento',
    subdimension: 'Programas de financiamiento público y privado',
    escala: 'Likert 1-5',
    order_index: 37
  },
  {
    id_item: 'I034',
    question_text: 'En mi empresa existe planificación financiera formal (presupuestos, flujo de caja).',
    dimension: 'Acceso al financiamiento',
    subdimension: 'Educación financiera',
    escala: 'Likert 1-5',
    order_index: 38
  },
  {
    id_item: 'I035',
    question_text: 'El personal responsable ha recibido capacitación en gestión financiera en los últimos 2 años.',
    dimension: 'Acceso al financiamiento',
    subdimension: 'Educación financiera',
    escala: 'Likert 1-5',
    order_index: 39
  },
  {
    id_item: 'I036',
    question_text: 'Mi empresa utiliza herramientas o asesores para planificación financiera (software, contador externo).',
    dimension: 'Acceso al financiamiento',
    subdimension: 'Educación financiera',
    escala: 'Likert 1-5',
    order_index: 40
  },
  {
    id_item: 'I037',
    question_text: 'Existen programas de capacitación en gestión y técnica accesibles en Riobamba/Ambato.',
    dimension: 'Servicios de Desarrollo Empresarial y compras públicas',
    subdimension: 'Oferta de capacitación y asesoría',
    escala: 'Likert 1-5',
    order_index: 41
  },
  {
    id_item: 'I038',
    question_text: 'La capacitación recibida por mi empresa fue aplicable y mejoró procesos o ventas.',
    dimension: 'Servicios de Desarrollo Empresarial y compras públicas',
    subdimension: 'Oferta de capacitación y asesoría',
    escala: 'Likert 1-5',
    order_index: 42
  },
  {
    id_item: 'I039',
    question_text: 'Los horarios y costos de la capacitación son compatibles con la operación de mi empresa.',
    dimension: 'Servicios de Desarrollo Empresarial y compras públicas',
    subdimension: 'Oferta de capacitación y asesoría',
    escala: 'Likert 1-5',
    order_index: 43
  },
  {
    id_item: 'I040',
    question_text: 'Mi empresa está registrada en RUP/SERCOP y mantiene su información actualizada.',
    dimension: 'Servicios de Desarrollo Empresarial y compras públicas',
    subdimension: 'Acceso a compras públicas (SERCOP)',
    escala: 'Likert 1-5',
    order_index: 44
  },
  {
    id_item: 'I041',
    question_text: 'Conozco cómo participar en convocatorias y preparar propuestas para procesos en SERCOP.',
    dimension: 'Servicios de Desarrollo Empresarial y compras públicas',
    subdimension: 'Acceso a compras públicas (SERCOP)',
    escala: 'Likert 1-5',
    order_index: 45
  },
  {
    id_item: 'I042',
    question_text: 'Mi empresa ha participado en al menos un proceso de contratación pública en los últimos 3 años.',
    dimension: 'Servicios de Desarrollo Empresarial y compras públicas',
    subdimension: 'Acceso a compras públicas (SERCOP)',
    escala: 'Likert 1-5',
    order_index: 46
  },
  {
    id_item: 'I043',
    question_text: 'Existen programas sectoriales con asistencia técnica para comercio, manufactura, turismo o agro en la provincia.',
    dimension: 'Servicios de Desarrollo Empresarial y compras públicas',
    subdimension: 'Asistencia técnica sectorial',
    escala: 'Likert 1-5',
    order_index: 47
  },
  {
    id_item: 'I044',
    question_text: 'Mi empresa ha recibido asistencia técnica sectorial adaptada a nuestras actividades en los últimos 2 años.',
    dimension: 'Servicios de Desarrollo Empresarial y compras públicas',
    subdimension: 'Asistencia técnica sectorial',
    escala: 'Likert 1-5',
    order_index: 48
  },
  {
    id_item: 'I045',
    question_text: 'La asistencia técnica incluye acompañamiento en mejoras productivas (calidad, trazabilidad, diseño de procesos).',
    dimension: 'Servicios de Desarrollo Empresarial y compras públicas',
    subdimension: 'Asistencia técnica sectorial',
    escala: 'Likert 1-5',
    order_index: 49
  },
  {
    id_item: 'I046',
    question_text: 'Existe una red o asociación empresarial local en la que mi empresa puede integrarse.',
    dimension: 'Servicios de Desarrollo Empresarial y compras públicas',
    subdimension: 'Redes empresariales',
    escala: 'Likert 1-5',
    order_index: 50
  },
  {
    id_item: 'I047',
    question_text: 'La participación en redes ha generado contactos comerciales o referencias.',
    dimension: 'Servicios de Desarrollo Empresarial y compras públicas',
    subdimension: 'Redes empresariales',
    escala: 'Likert 1-5',
    order_index: 51
  },
  {
    id_item: 'I048',
    question_text: 'Mi empresa participa activamente en clústeres o mesas sectoriales locales.',
    dimension: 'Servicios de Desarrollo Empresarial y compras públicas',
    subdimension: 'Redes empresariales',
    escala: 'Likert 1-5',
    order_index: 52
  },
  {
    id_item: 'I049',
    question_text: 'Mi empresa utiliza herramientas de análisis (reportes digitales, BI) para la toma de decisiones.',
    dimension: 'Innovación y tecnología',
    subdimension: 'Adopción de herramientas digitales',
    escala: 'Likert 1-5',
    order_index: 53
  },
  {
    id_item: 'I050',
    question_text: 'Mi empresa vende productos o servicios mediante canales digitales (e-commerce, marketplaces).',
    dimension: 'Innovación y tecnología',
    subdimension: 'Adopción de herramientas digitales',
    escala: 'Likert 1-5',
    order_index: 54
  },
  {
    id_item: 'I051',
    question_text: 'Contamos con un sistema ERP o integrado para gestionar inventario y ventas.',
    dimension: 'Innovación y tecnología',
    subdimension: 'Adopción de herramientas digitales',
    escala: 'Likert 1-5',
    order_index: 55
  },
  {
    id_item: 'I052',
    question_text: 'En los últimos 2 años, la empresa ha invertido recursos en actividades de I+D o desarrollo de productos.',
    dimension: 'Innovación y tecnología',
    subdimension: 'Inversión en I+D',
    escala: 'Likert 1-5',
    order_index: 56
  },
  {
    id_item: 'I053',
    question_text: 'La empresa ha dedicado personal técnico (interno o externo) para proyectos de innovación.',
    dimension: 'Innovación y tecnología',
    subdimension: 'Inversión en I+D',
    escala: 'Likert 1-5',
    order_index: 57
  },
  {
    id_item: 'I054',
    question_text: 'Hemos recibido financiamiento o apoyos para investigación o innovación en los últimos 3 años.',
    dimension: 'Innovación y tecnología',
    subdimension: 'Inversión en I+D',
    escala: 'Likert 1-5',
    order_index: 58
  },
  {
    id_item: 'I055',
    question_text: 'La empresa ha colaborado en proyectos con universidades locales (ESPOCH, Indoamérica) en los últimos 3 años.',
    dimension: 'Innovación y tecnología',
    subdimension: 'Vinculación con universidades',
    escala: 'Likert 1-5',
    order_index: 59
  },
  {
    id_item: 'I056',
    question_text: 'La colaboración con universidades ha resultado en mejoras técnicas o nuevos productos.',
    dimension: 'Innovación y tecnología',
    subdimension: 'Vinculación con universidades',
    escala: 'Likert 1-5',
    order_index: 60
  },
  {
    id_item: 'I057',
    question_text: 'La empresa ha contratado servicios de extensión universitaria o investigación aplicada.',
    dimension: 'Innovación y tecnología',
    subdimension: 'Vinculación con universidades',
    escala: 'Likert 1-5',
    order_index: 61
  },
  {
    id_item: 'I058',
    question_text: 'Hemos automatizado procesos internos clave (facturación, control inventarios, RRHH) en los últimos 2 años.',
    dimension: 'Innovación y tecnología',
    subdimension: 'Transformación digital interna',
    escala: 'Likert 1-5',
    order_index: 62
  },
  {
    id_item: 'I059',
    question_text: 'Usamos indicadores digitales para monitorear desempeño (ventas, stock, tiempos de producción).',
    dimension: 'Innovación y tecnología',
    subdimension: 'Transformación digital interna',
    escala: 'Likert 1-5',
    order_index: 63
  },
  {
    id_item: 'I060',
    question_text: 'Hemos reemplazado procesos manuales por soluciones digitales para reducir tiempo/costos.',
    dimension: 'Innovación y tecnología',
    subdimension: 'Transformación digital interna',
    escala: 'Likert 1-5',
    order_index: 64
  },
  {
    id_item: 'I061',
    question_text: 'En los últimos 2 años, la empresa lanzó productos o servicios con mayor valor agregado.',
    dimension: 'Transformación productiva',
    subdimension: 'Diversificación productiva',
    escala: 'Likert 1-5',
    order_index: 65
  },
  {
    id_item: 'I062',
    question_text: 'La empresa desarrolla actividades para ampliar su línea de productos o servicios.',
    dimension: 'Transformación productiva',
    subdimension: 'Diversificación productiva',
    escala: 'Likert 1-5',
    order_index: 66
  },
  {
    id_item: 'I063',
    question_text: 'La empresa invierte en diseño o empaque para aumentar valor percibido del producto.',
    dimension: 'Transformación productiva',
    subdimension: 'Diversificación productiva',
    escala: 'Likert 1-5',
    order_index: 67
  },
  {
    id_item: 'I064',
    question_text: 'Hemos implementado prácticas de optimización (reducción desperdicio, mejora de flujo) en producción.',
    dimension: 'Transformación productiva',
    subdimension: 'Eficiencia operativa',
    escala: 'Likert 1-5',
    order_index: 68
  },
  {
    id_item: 'I065',
    question_text: 'Monitorizamos indicadores operativos y usamos esos datos para tomar decisiones.',
    dimension: 'Transformación productiva',
    subdimension: 'Eficiencia operativa',
    escala: 'Likert 1-5',
    order_index: 69
  },
  {
    id_item: 'I066',
    question_text: 'La empresa ha reducido costos unitarios mediante cambios en procesos productivos.',
    dimension: 'Transformación productiva',
    subdimension: 'Eficiencia operativa',
    escala: 'Likert 1-5',
    order_index: 70
  },
  {
    id_item: 'I067',
    question_text: 'La empresa aplica prácticas de gestión de residuos y ahorro de energía.',
    dimension: 'Transformación productiva',
    subdimension: 'Sostenibilidad',
    escala: 'Likert 1-5',
    order_index: 71
  },
  {
    id_item: 'I068',
    question_text: 'Los proveedores cumplen estándares ambientales básicos requeridos por la empresa.',
    dimension: 'Transformación productiva',
    subdimension: 'Sostenibilidad',
    escala: 'Likert 1-5',
    order_index: 72
  },
  {
    id_item: 'I069',
    question_text: 'La sostenibilidad está incluida en la estrategia de la empresa.',
    dimension: 'Transformación productiva',
    subdimension: 'Sostenibilidad',
    escala: 'Likert 1-5',
    order_index: 73
  },
  {
    id_item: 'I070',
    question_text: 'La empresa adapta rápidamente su oferta ante cambios de demanda del mercado.',
    dimension: 'Transformación productiva',
    subdimension: 'Adaptación a cambios del mercado',
    escala: 'Likert 1-5',
    order_index: 74
  },
  {
    id_item: 'I071',
    question_text: 'Contamos con procedimientos para detectar tendencias del mercado (encuestas clientes, análisis ventas).',
    dimension: 'Transformación productiva',
    subdimension: 'Adaptación a cambios del mercado',
    escala: 'Likert 1-5',
    order_index: 75
  },
  {
    id_item: 'I072',
    question_text: 'La empresa ha cambiado canales de venta o proveedores como respuesta a una variación significativa de demanda.',
    dimension: 'Transformación productiva',
    subdimension: 'Adaptación a cambios del mercado',
    escala: 'Likert 1-5',
    order_index: 76
  },
  {
    id_item: 'I073',
    question_text: 'La empresa participa regularmente en ferias, ruedas de negocio o marketplaces regionales.',
    dimension: 'Acceso a mercados e internacionalización',
    subdimension: 'Presencia en mercados locales',
    escala: 'Likert 1-5',
    order_index: 77
  },
  {
    id_item: 'I074',
    question_text: 'Nuestra marca está posicionada en canales locales que garantizan ventas estables.',
    dimension: 'Acceso a mercados e internacionalización',
    subdimension: 'Presencia en mercados locales',
    escala: 'Likert 1-5',
    order_index: 78
  },
  {
    id_item: 'I075',
    question_text: 'La empresa utiliza plataformas regionales (mercados locales en línea) para promocionarse.',
    dimension: 'Acceso a mercados e internacionalización',
    subdimension: 'Presencia en mercados locales',
    escala: 'Likert 1-5',
    order_index: 79
  },
  {
    id_item: 'I076',
    question_text: 'En los últimos 3 años, la empresa ha exportado bienes o servicios directamente.',
    dimension: 'Acceso a mercados e internacionalización',
    subdimension: 'Exportación y comercio exterior',
    escala: 'Likert 1-5',
    order_index: 80
  },
  {
    id_item: 'I077',
    question_text: 'La empresa cumple con los estándares y certificaciones necesarios para exportar.',
    dimension: 'Acceso a mercados e internacionalización',
    subdimension: 'Exportación y comercio exterior',
    escala: 'Likert 1-5',
    order_index: 81
  },
  {
    id_item: 'I078',
    question_text: 'Hemos participado en misiones o ferias internacionales para abrir mercados de exportación.',
    dimension: 'Acceso a mercados e internacionalización',
    subdimension: 'Exportación y comercio exterior',
    escala: 'Likert 1-5',
    order_index: 82
  },
  {
    id_item: 'I079',
    question_text: 'La empresa realiza campañas de marketing digital (redes, anuncios pagados, email) con objetivos definidos.',
    dimension: 'Acceso a mercados e internacionalización',
    subdimension: 'Marketing digital y comercio electrónico',
    escala: 'Likert 1-5',
    order_index: 83
  },
  {
    id_item: 'I080',
    question_text: 'Las ventas por canales digitales representan una proporción importante de los ingresos.',
    dimension: 'Acceso a mercados e internacionalización',
    subdimension: 'Marketing digital y comercio electrónico',
    escala: 'Likert 1-5',
    order_index: 84
  },
  {
    id_item: 'I081',
    question_text: 'Medimos el retorno de inversión (ROI) de las campañas digitales.',
    dimension: 'Acceso a mercados e internacionalización',
    subdimension: 'Marketing digital y comercio electrónico',
    escala: 'Likert 1-5',
    order_index: 85
  },
  {
    id_item: 'I082',
    question_text: 'Tenemos acuerdos comerciales con distribuidores o clientes corporativos que amplían nuestra cobertura.',
    dimension: 'Acceso a mercados e internacionalización',
    subdimension: 'Alianzas comerciales',
    escala: 'Likert 1-5',
    order_index: 86
  },
  {
    id_item: 'I083',
    question_text: 'La empresa participa en redes internacionales o cadenas de suministro que facilitan acceso a mercados.',
    dimension: 'Acceso a mercados e internacionalización',
    subdimension: 'Alianzas comerciales',
    escala: 'Likert 1-5',
    order_index: 87
  },
  {
    id_item: 'I084',
    question_text: 'Contamos con contratos de suministro o distribución que aseguran pedidos recurrentes.',
    dimension: 'Acceso a mercados e internacionalización',
    subdimension: 'Alianzas comerciales',
    escala: 'Likert 1-5',
    order_index: 88
  },
  {
    id_item: 'I085',
    question_text: 'Utilizamos un sistema ERP/CRM/POS para gestionar ventas, clientes e inventario.',
    dimension: 'Digitalización',
    subdimension: 'Nivel de adopción de sistemas de gestión (ERP, CRM, POS)',
    escala: 'Likert 1-5',
    order_index: 89
  },
  {
    id_item: 'I086',
    question_text: 'Los sistemas están integrados y la información fluye entre áreas.',
    dimension: 'Digitalización',
    subdimension: 'Nivel de adopción de sistemas de gestión (ERP, CRM, POS)',
    escala: 'Likert 1-5',
    order_index: 90
  },
  {
    id_item: 'I087',
    question_text: 'El uso de estos sistemas se actualiza periódicamente y hay soporte técnico.',
    dimension: 'Digitalización',
    subdimension: 'Nivel de adopción de sistemas de gestión (ERP, CRM, POS)',
    escala: 'Likert 1-5',
    order_index: 91
  },
  {
    id_item: 'I088',
    question_text: 'Tenemos tienda online o vendemos por marketplaces y procesamos pagos digitales.',
    dimension: 'Digitalización',
    subdimension: 'Comercio electrónico y marketing digital',
    escala: 'Likert 1-5',
    order_index: 92
  },
  {
    id_item: 'I089',
    question_text: 'Usamos métricas digitales (conversiones, tráfico web) para mejorar ventas online.',
    dimension: 'Digitalización',
    subdimension: 'Comercio electrónico y marketing digital',
    escala: 'Likert 1-5',
    order_index: 93
  },
  {
    id_item: 'I090',
    question_text: 'Los sistemas de pagos digitales están implementados y funcionan sin problemas.',
    dimension: 'Digitalización',
    subdimension: 'Comercio electrónico y marketing digital',
    escala: 'Likert 1-5',
    order_index: 94
  },
  {
    id_item: 'I091',
    question_text: 'Contamos con medidas básicas de ciberseguridad (backups, antivirus, políticas de contraseña).',
    dimension: 'Digitalización',
    subdimension: 'Ciberseguridad',
    escala: 'Likert 1-5',
    order_index: 95
  },
  {
    id_item: 'I092',
    question_text: 'No hemos sufrido incidentes de seguridad informática en los últimos 2 años.',
    dimension: 'Digitalización',
    subdimension: 'Ciberseguridad',
    escala: 'Likert 1-5',
    order_index: 96
  },
  {
    id_item: 'I093',
    question_text: 'Tenemos protocolos para gestión de incidentes y recuperación de datos.',
    dimension: 'Digitalización',
    subdimension: 'Ciberseguridad',
    escala: 'Likert 1-5',
    order_index: 97
  },
  {
    id_item: 'I094',
    question_text: 'El personal ha recibido capacitación en herramientas digitales relevantes para su puesto.',
    dimension: 'Digitalización',
    subdimension: 'Capacitación en competencias digitales',
    escala: 'Likert 1-5',
    order_index: 98
  },
  {
    id_item: 'I095',
    question_text: 'La empresa dispone de un plan de formación continua en competencias digitales.',
    dimension: 'Digitalización',
    subdimension: 'Capacitación en competencias digitales',
    escala: 'Likert 1-5',
    order_index: 99
  },
  {
    id_item: 'I096',
    question_text: 'Se realizan evaluaciones periódicas de competencias digitales del personal.',
    dimension: 'Digitalización',
    subdimension: 'Capacitación en competencias digitales',
    escala: 'Likert 1-5',
    order_index: 100
  }
]

async function populateAllQuestions() {
  console.log('Iniciando población de las 100 preguntas completas...')
  
  try {
    // Eliminar preguntas existentes
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
    
    // Insertar las 100 preguntas
    for (const question of questions) {
      const questionType = getQuestionType(question.escala)
      const options = getRadioOptions(question.escala)
      
      const likertConfig = questionType === 'likert' ? {
        scale_points: 5,
        left_label: 'Muy bajo/Nunca/Totalmente en desacuerdo',
        right_label: 'Muy alto/Siempre/Totalmente de acuerdo'
      } : null
      
      console.log(`Insertando pregunta ${question.order_index}: ${question.id_item} - ${question.question_text.substring(0, 60)}...`)
      
      const { data, error } = await supabase.rpc('insert_survey_question', {
        p_survey_id: surveyId,
        p_question_text: question.question_text,
        p_question_type: questionType,
        p_order_index: question.order_index,
        p_options: options,
        p_likert_config: likertConfig,
        p_is_required: true,
        p_dimension: question.dimension,
        p_subdimension: question.subdimension
      })
      
      if (error) {
        console.error(`Error insertando pregunta ${question.order_index}:`, error)
      } else {
        console.log(`✓ Pregunta ${question.order_index} insertada`)
      }
    }
    
    console.log('¡Población de las 100 preguntas completada!')
    
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
populateAllQuestions()