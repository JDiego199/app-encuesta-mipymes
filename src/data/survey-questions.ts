// Auto-generated survey questions from Excel
// Generated on: 2025-10-25T20:51:51.406Z

import { SurveyQuestion } from '@/types/survey';

export const surveyQuestions: SurveyQuestion[] = [
  {
    "id": "h01",
    "survey_id": "mipymes-diagnostico",
    "question_text": "¿Cuántos años tiene operando su empresa?",
    "question_type": "number",
    "dimension": "",
    "subdimension": "",
    "is_required": true,
    "order_index": 1
  },
  {
    "id": "h02",
    "survey_id": "mipymes-diagnostico",
    "question_text": "¿Ha tramitado permisos o licencias para su empresa en los últimos 12 meses?",
    "question_type": "radio",
    "dimension": "",
    "subdimension": "",
    "is_required": true,
    "order_index": 2,
    "options": [
      "Sí",
      "No"
    ]
  },
  {
    "id": "h03",
    "survey_id": "mipymes-diagnostico",
    "question_text": "¿Ha utilizado plataformas digitales municipales o estatales para realizar trámites en el último año?",
    "question_type": "radio",
    "dimension": "",
    "subdimension": "",
    "is_required": true,
    "order_index": 3,
    "options": [
      "Sí",
      "No",
      "No sabe"
    ]
  },
  {
    "id": "h04",
    "survey_id": "mipymes-diagnostico",
    "question_text": "¿Sabe si su municipio o provincia dispone de trámites en línea aplicables a su actividad económica?",
    "question_type": "radio",
    "dimension": "",
    "subdimension": "",
    "is_required": true,
    "order_index": 4,
    "options": [
      "Sí",
      "No",
      "No sabe"
    ]
  },
  {
    "id": "I001",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Las autoridades locales/provinciales han publicado políticas o programas claros de fomento productivo o digitalización en los últimos 3 años.",
    "question_type": "likert",
    "dimension": "Marco Institucional",
    "subdimension": "Políticas públicas locales y provinciales",
    "is_required": true,
    "order_index": 5,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I002",
    "survey_id": "mipymes-diagnostico",
    "question_text": "En mi sector, estas políticas se aplican efectivamente y son accesibles para MIPYMES.",
    "question_type": "likert",
    "dimension": "Marco Institucional",
    "subdimension": "Políticas públicas locales y provinciales",
    "is_required": true,
    "order_index": 6,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I003",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Conozco incentivos o programas locales (subsidios, líneas de crédito, capacitación) derivados de políticas territoriales.",
    "question_type": "likert",
    "dimension": "Marco Institucional",
    "subdimension": "Políticas públicas locales y provinciales",
    "is_required": true,
    "order_index": 7,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I004",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Mi empresa conoce los servicios de apoyo institucional disponibles en la zona (como capacitaciones, asesorías, financiamiento o asistencia técnica).",
    "question_type": "likert",
    "dimension": "Marco Institucional",
    "subdimension": "Instituciones de apoyo empresarial",
    "is_required": true,
    "order_index": 8,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I005",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Los servicios que brindan estas instituciones son accesibles y de fácil uso para mi empresa.",
    "question_type": "likert",
    "dimension": "Marco Institucional",
    "subdimension": "Instituciones de apoyo empresarial",
    "is_required": true,
    "order_index": 9,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I006",
    "survey_id": "mipymes-diagnostico",
    "question_text": "He utilizado al menos un servicio (asesoría, capacitación, asesoría técnica) provisto por estas instituciones en los últimos 12 meses.",
    "question_type": "likert",
    "dimension": "Marco Institucional",
    "subdimension": "Instituciones de apoyo empresarial",
    "is_required": true,
    "order_index": 10,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I007",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Las normativas para registro, licencias y tributación son claras y comprensibles para mi empresa.",
    "question_type": "likert",
    "dimension": "Marco Institucional",
    "subdimension": "Regulación y normativas",
    "is_required": true,
    "order_index": 11,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I008",
    "survey_id": "mipymes-diagnostico",
    "question_text": "El tiempo estimado que informan las autoridades para obtener permisos o licencias se cumple en la práctica.",
    "question_type": "likert",
    "dimension": "Marco Institucional",
    "subdimension": "Regulación y normativas",
    "is_required": true,
    "order_index": 12,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I009",
    "survey_id": "mipymes-diagnostico",
    "question_text": "La interpretación y cumplimiento de las normativas no requiere de intermediarios o pagos informales.",
    "question_type": "likert",
    "dimension": "Marco Institucional",
    "subdimension": "Regulación y normativas",
    "is_required": true,
    "order_index": 13,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I010",
    "survey_id": "mipymes-diagnostico",
    "question_text": "En mi zona existe colaboración entre instituciones locales (públicas, privadas y académicas) para apoyar a las empresas.",
    "question_type": "likert",
    "dimension": "Marco Institucional",
    "subdimension": "Coordinación interinstitucional",
    "is_required": true,
    "order_index": 14,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I011",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Mi empresa ha recibido o participado en iniciativas impulsadas por diferentes actores locales (públicos o privados) durante los últimos 2 años.",
    "question_type": "likert",
    "dimension": "Marco Institucional",
    "subdimension": "Coordinación interinstitucional",
    "is_required": true,
    "order_index": 15,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I012",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Percibo que la coordinación interinstitucional facilita el acceso a recursos (financiamiento, asesoría) para MIPYMES.",
    "question_type": "likert",
    "dimension": "Marco Institucional",
    "subdimension": "Coordinación interinstitucional",
    "is_required": true,
    "order_index": 16,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I013",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Los trámites municipales/provinciales que necesito están disponibles en línea.",
    "question_type": "likert",
    "dimension": "Entorno operativo / Simplificación de procedimientos",
    "subdimension": "Trámites en línea y ventanilla única",
    "is_required": true,
    "order_index": 17,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I014",
    "survey_id": "mipymes-diagnostico",
    "question_text": "He utilizado la ventanilla única y los trámites en línea han reducido el tiempo de gestión.",
    "question_type": "likert",
    "dimension": "Entorno operativo / Simplificación de procedimientos",
    "subdimension": "Trámites en línea y ventanilla única",
    "is_required": true,
    "order_index": 18,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I015",
    "survey_id": "mipymes-diagnostico",
    "question_text": "La ventanilla única municipal funciona de forma confiable (documentación, citas, notificaciones electrónicas).",
    "question_type": "likert",
    "dimension": "Entorno operativo / Simplificación de procedimientos",
    "subdimension": "Trámites en línea y ventanilla única",
    "is_required": true,
    "order_index": 19,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I016",
    "survey_id": "mipymes-diagnostico",
    "question_text": "El tiempo promedio para obtener permisos o licencias es adecuado al tamaño y capacidades de mi empresa.",
    "question_type": "likert",
    "dimension": "Entorno operativo / Simplificación de procedimientos",
    "subdimension": "Tiempo y costo de trámites",
    "is_required": true,
    "order_index": 20,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I017",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Los costos administrativos asociados a permisos y registros son manejables para mi empresa.",
    "question_type": "likert",
    "dimension": "Entorno operativo / Simplificación de procedimientos",
    "subdimension": "Tiempo y costo de trámites",
    "is_required": true,
    "order_index": 21,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I018",
    "survey_id": "mipymes-diagnostico",
    "question_text": "En los últimos 2 años, el tiempo requerido para trámites ha disminuido gracias a mejoras administrativas.",
    "question_type": "likert",
    "dimension": "Entorno operativo / Simplificación de procedimientos",
    "subdimension": "Tiempo y costo de trámites",
    "is_required": true,
    "order_index": 22,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I019",
    "survey_id": "mipymes-diagnostico",
    "question_text": "La cantidad de requisitos y reportes regulatorios representa una carga administrativa alta para mi empresa.",
    "question_type": "likert",
    "dimension": "Entorno operativo / Simplificación de procedimientos",
    "subdimension": "Carga regulatoria",
    "is_required": true,
    "order_index": 23,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I020",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Percibo duplicidad de requisitos entre instituciones (municipio, prefectura, SRI, etc.).",
    "question_type": "likert",
    "dimension": "Entorno operativo / Simplificación de procedimientos",
    "subdimension": "Carga regulatoria",
    "is_required": true,
    "order_index": 24,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I021",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Las inspecciones y controles regulatorios son previsibles y no afectan la operación diaria.",
    "question_type": "likert",
    "dimension": "Entorno operativo / Simplificación de procedimientos",
    "subdimension": "Carga regulatoria",
    "is_required": true,
    "order_index": 25,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I022",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Mi empresa puede realizar pagos y presentaciones obligatorias (impuestos, informes) completamente en formato digital.",
    "question_type": "likert",
    "dimension": "Entorno operativo / Simplificación de procedimientos",
    "subdimension": "Digitalización administrativa",
    "is_required": true,
    "order_index": 26,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I023",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Las plataformas digitales de las instituciones públicas que he usado son estables y fáciles de utilizar.",
    "question_type": "likert",
    "dimension": "Entorno operativo / Simplificación de procedimientos",
    "subdimension": "Digitalización administrativa",
    "is_required": true,
    "order_index": 27,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I024",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Contamos con soporte técnico o guía de las municipalidades para trámites digitales.",
    "question_type": "likert",
    "dimension": "Entorno operativo / Simplificación de procedimientos",
    "subdimension": "Digitalización administrativa",
    "is_required": true,
    "order_index": 28,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I025",
    "survey_id": "mipymes-diagnostico",
    "question_text": "En mi ciudad existen productos crediticios adecuados para MIPYMES (cooperativas, bancos) de mi sector.",
    "question_type": "likert",
    "dimension": "Acceso al financiamiento",
    "subdimension": "Oferta de productos financieros locales",
    "is_required": true,
    "order_index": 29,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I026",
    "survey_id": "mipymes-diagnostico",
    "question_text": "He encontrado líneas de crédito específicas para modernización o digitalización.",
    "question_type": "likert",
    "dimension": "Acceso al financiamiento",
    "subdimension": "Oferta de productos financieros locales",
    "is_required": true,
    "order_index": 30,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I027",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Los plazos y condiciones de los créditos son compatibles con el ciclo de mi negocio.",
    "question_type": "likert",
    "dimension": "Acceso al financiamiento",
    "subdimension": "Oferta de productos financieros locales",
    "is_required": true,
    "order_index": 31,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I028",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Los requisitos de garantía y documentación para acceder a crédito son razonables para mi empresa.",
    "question_type": "likert",
    "dimension": "Acceso al financiamiento",
    "subdimension": "Requisitos y garantías",
    "is_required": true,
    "order_index": 32,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I029",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Mi empresa cumple fácilmente con las condiciones para créditos de corto plazo.",
    "question_type": "likert",
    "dimension": "Acceso al financiamiento",
    "subdimension": "Requisitos y garantías",
    "is_required": true,
    "order_index": 33,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I030",
    "survey_id": "mipymes-diagnostico",
    "question_text": "La valoración de garantías por parte de la institución financiera es transparente.",
    "question_type": "likert",
    "dimension": "Acceso al financiamiento",
    "subdimension": "Requisitos y garantías",
    "is_required": true,
    "order_index": 34,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I031",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Conozco programas públicos o privados (capital semilla, concursables) disponibles en mi provincia.",
    "question_type": "likert",
    "dimension": "Acceso al financiamiento",
    "subdimension": "Programas de financiamiento público y privado",
    "is_required": true,
    "order_index": 35,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I032",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Mi empresa ha postulado a algún programa de financiamiento en los últimos 3 años.",
    "question_type": "likert",
    "dimension": "Acceso al financiamiento",
    "subdimension": "Programas de financiamiento público y privado",
    "is_required": true,
    "order_index": 36,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I033",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Los requisitos de postulación son claros y el proceso es justo.",
    "question_type": "likert",
    "dimension": "Acceso al financiamiento",
    "subdimension": "Programas de financiamiento público y privado",
    "is_required": true,
    "order_index": 37,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I034",
    "survey_id": "mipymes-diagnostico",
    "question_text": "En mi empresa existe planificación financiera formal (presupuestos, flujo de caja).",
    "question_type": "likert",
    "dimension": "Acceso al financiamiento",
    "subdimension": "Educación financiera",
    "is_required": true,
    "order_index": 38,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I035",
    "survey_id": "mipymes-diagnostico",
    "question_text": "El personal responsable ha recibido capacitación en gestión financiera en los últimos 2 años.",
    "question_type": "likert",
    "dimension": "Acceso al financiamiento",
    "subdimension": "Educación financiera",
    "is_required": true,
    "order_index": 39,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I036",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Mi empresa utiliza herramientas o asesores para planificación financiera (software, contador externo).",
    "question_type": "likert",
    "dimension": "Acceso al financiamiento",
    "subdimension": "Educación financiera",
    "is_required": true,
    "order_index": 40,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I037",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Existen programas de capacitación en gestión y técnica accesibles en Riobamba/Ambato.",
    "question_type": "likert",
    "dimension": "Servicios de Desarrollo Empresarial y compras públicas",
    "subdimension": "Oferta de capacitación y asesoría",
    "is_required": true,
    "order_index": 41,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I038",
    "survey_id": "mipymes-diagnostico",
    "question_text": "La capacitación recibida por mi empresa fue aplicable y mejoró procesos o ventas.",
    "question_type": "likert",
    "dimension": "Servicios de Desarrollo Empresarial y compras públicas",
    "subdimension": "Oferta de capacitación y asesoría",
    "is_required": true,
    "order_index": 42,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I039",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Los horarios y costos de la capacitación son compatibles con la operación de mi empresa.",
    "question_type": "likert",
    "dimension": "Servicios de Desarrollo Empresarial y compras públicas",
    "subdimension": "Oferta de capacitación y asesoría",
    "is_required": true,
    "order_index": 43,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I040",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Mi empresa está registrada en RUP/SERCOP y mantiene su información actualizada.",
    "question_type": "likert",
    "dimension": "Servicios de Desarrollo Empresarial y compras públicas",
    "subdimension": "Acceso a compras públicas (SERCOP)",
    "is_required": true,
    "order_index": 44,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I041",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Conozco cómo participar en convocatorias y preparar propuestas para procesos en SERCOP.",
    "question_type": "likert",
    "dimension": "Servicios de Desarrollo Empresarial y compras públicas",
    "subdimension": "Acceso a compras públicas (SERCOP)",
    "is_required": true,
    "order_index": 45,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I042",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Mi empresa ha participado en al menos un proceso de contratación pública en los últimos 3 años.",
    "question_type": "likert",
    "dimension": "Servicios de Desarrollo Empresarial y compras públicas",
    "subdimension": "Acceso a compras públicas (SERCOP)",
    "is_required": true,
    "order_index": 46,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I043",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Existen programas sectoriales con asistencia técnica para comercio, manufactura, turismo o agro en la provincia.",
    "question_type": "likert",
    "dimension": "Servicios de Desarrollo Empresarial y compras públicas",
    "subdimension": "Asistencia técnica sectorial",
    "is_required": true,
    "order_index": 47,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I044",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Mi empresa ha recibido asistencia técnica sectorial adaptada a nuestras actividades en los últimos 2 años.",
    "question_type": "likert",
    "dimension": "Servicios de Desarrollo Empresarial y compras públicas",
    "subdimension": "Asistencia técnica sectorial",
    "is_required": true,
    "order_index": 48,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I045",
    "survey_id": "mipymes-diagnostico",
    "question_text": "La asistencia técnica incluye acompañamiento en mejoras productivas (calidad, trazabilidad, diseño de procesos).",
    "question_type": "likert",
    "dimension": "Servicios de Desarrollo Empresarial y compras públicas",
    "subdimension": "Asistencia técnica sectorial",
    "is_required": true,
    "order_index": 49,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I046",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Existe una red o asociación empresarial local en la que mi empresa puede integrarse.",
    "question_type": "likert",
    "dimension": "Servicios de Desarrollo Empresarial y compras públicas",
    "subdimension": "Redes empresariales",
    "is_required": true,
    "order_index": 50,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I047",
    "survey_id": "mipymes-diagnostico",
    "question_text": "La participación en redes ha generado contactos comerciales o referencias.",
    "question_type": "likert",
    "dimension": "Servicios de Desarrollo Empresarial y compras públicas",
    "subdimension": "Redes empresariales",
    "is_required": true,
    "order_index": 51,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I048",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Mi empresa participa activamente en clústeres o mesas sectoriales locales.",
    "question_type": "likert",
    "dimension": "Servicios de Desarrollo Empresarial y compras públicas",
    "subdimension": "Redes empresariales",
    "is_required": true,
    "order_index": 52,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I049",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Mi empresa utiliza herramientas de análisis (reportes digitales, BI) para la toma de decisiones.",
    "question_type": "likert",
    "dimension": "Innovación y tecnología",
    "subdimension": "Adopción de herramientas digitales",
    "is_required": true,
    "order_index": 53,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I050",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Mi empresa vende productos o servicios mediante canales digitales (e-commerce, marketplaces).",
    "question_type": "likert",
    "dimension": "Innovación y tecnología",
    "subdimension": "Adopción de herramientas digitales",
    "is_required": true,
    "order_index": 54,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I051",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Contamos con un sistema ERP o integrado para gestionar inventario y ventas.",
    "question_type": "likert",
    "dimension": "Innovación y tecnología",
    "subdimension": "Adopción de herramientas digitales",
    "is_required": true,
    "order_index": 55,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I052",
    "survey_id": "mipymes-diagnostico",
    "question_text": "En los últimos 2 años, la empresa ha invertido recursos en actividades de I+D o desarrollo de productos.",
    "question_type": "likert",
    "dimension": "Innovación y tecnología",
    "subdimension": "Inversión en I+D",
    "is_required": true,
    "order_index": 56,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I053",
    "survey_id": "mipymes-diagnostico",
    "question_text": "La empresa ha dedicado personal técnico (interno o externo) para proyectos de innovación.",
    "question_type": "likert",
    "dimension": "Innovación y tecnología",
    "subdimension": "Inversión en I+D",
    "is_required": true,
    "order_index": 57,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I054",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Hemos recibido financiamiento o apoyos para investigación o innovación en los últimos 3 años.",
    "question_type": "likert",
    "dimension": "Innovación y tecnología",
    "subdimension": "Inversión en I+D",
    "is_required": true,
    "order_index": 58,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I055",
    "survey_id": "mipymes-diagnostico",
    "question_text": "La empresa ha colaborado en proyectos con universidades locales (ESPOCH, Indoamérica) en los últimos 3 años.",
    "question_type": "likert",
    "dimension": "Innovación y tecnología",
    "subdimension": "Vinculación con universidades",
    "is_required": true,
    "order_index": 59,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I056",
    "survey_id": "mipymes-diagnostico",
    "question_text": "La colaboración con universidades ha resultado en mejoras técnicas o nuevos productos.",
    "question_type": "likert",
    "dimension": "Innovación y tecnología",
    "subdimension": "Vinculación con universidades",
    "is_required": true,
    "order_index": 60,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I057",
    "survey_id": "mipymes-diagnostico",
    "question_text": "La empresa ha contratado servicios de extensión universitaria o investigación aplicada.",
    "question_type": "likert",
    "dimension": "Innovación y tecnología",
    "subdimension": "Vinculación con universidades",
    "is_required": true,
    "order_index": 61,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I058",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Hemos automatizado procesos internos clave (facturación, control inventarios, RRHH) en los últimos 2 años.",
    "question_type": "likert",
    "dimension": "Innovación y tecnología",
    "subdimension": "Transformación digital interna",
    "is_required": true,
    "order_index": 62,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I059",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Usamos indicadores digitales para monitorear desempeño (ventas, stock, tiempos de producción).",
    "question_type": "likert",
    "dimension": "Innovación y tecnología",
    "subdimension": "Transformación digital interna",
    "is_required": true,
    "order_index": 63,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I060",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Hemos reemplazado procesos manuales por soluciones digitales para reducir tiempo/costos.",
    "question_type": "likert",
    "dimension": "Innovación y tecnología",
    "subdimension": "Transformación digital interna",
    "is_required": true,
    "order_index": 64,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I061",
    "survey_id": "mipymes-diagnostico",
    "question_text": "En los últimos 2 años, la empresa lanzó productos o servicios con mayor valor agregado.",
    "question_type": "likert",
    "dimension": "Transformación productiva",
    "subdimension": "Diversificación productiva",
    "is_required": true,
    "order_index": 65,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I062",
    "survey_id": "mipymes-diagnostico",
    "question_text": "La empresa desarrolla actividades para ampliar su línea de productos o servicios.",
    "question_type": "likert",
    "dimension": "Transformación productiva",
    "subdimension": "Diversificación productiva",
    "is_required": true,
    "order_index": 66,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I063",
    "survey_id": "mipymes-diagnostico",
    "question_text": "La empresa invierte en diseño o empaque para aumentar valor percibido del producto.",
    "question_type": "likert",
    "dimension": "Transformación productiva",
    "subdimension": "Diversificación productiva",
    "is_required": true,
    "order_index": 67,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I064",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Hemos implementado prácticas de optimización (reducción desperdicio, mejora de flujo) en producción.",
    "question_type": "likert",
    "dimension": "Transformación productiva",
    "subdimension": "Eficiencia operativa",
    "is_required": true,
    "order_index": 68,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I065",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Monitorizamos indicadores operativos y usamos esos datos para tomar decisiones.",
    "question_type": "likert",
    "dimension": "Transformación productiva",
    "subdimension": "Eficiencia operativa",
    "is_required": true,
    "order_index": 69,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I066",
    "survey_id": "mipymes-diagnostico",
    "question_text": "La empresa ha reducido costos unitarios mediante cambios en procesos productivos.",
    "question_type": "likert",
    "dimension": "Transformación productiva",
    "subdimension": "Eficiencia operativa",
    "is_required": true,
    "order_index": 70,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I067",
    "survey_id": "mipymes-diagnostico",
    "question_text": "La empresa aplica prácticas de gestión de residuos y ahorro de energía.",
    "question_type": "likert",
    "dimension": "Transformación productiva",
    "subdimension": "Sostenibilidad",
    "is_required": true,
    "order_index": 71,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I068",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Los proveedores cumplen estándares ambientales básicos requeridos por la empresa.",
    "question_type": "likert",
    "dimension": "Transformación productiva",
    "subdimension": "Sostenibilidad",
    "is_required": true,
    "order_index": 72,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I069",
    "survey_id": "mipymes-diagnostico",
    "question_text": "La sostenibilidad está incluida en la estrategia de la empresa.",
    "question_type": "likert",
    "dimension": "Transformación productiva",
    "subdimension": "Sostenibilidad",
    "is_required": true,
    "order_index": 73,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I070",
    "survey_id": "mipymes-diagnostico",
    "question_text": "La empresa adapta rápidamente su oferta ante cambios de demanda del mercado.",
    "question_type": "likert",
    "dimension": "Transformación productiva",
    "subdimension": "Adaptación a cambios del mercado",
    "is_required": true,
    "order_index": 74,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I071",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Contamos con procedimientos para detectar tendencias del mercado (encuestas clientes, análisis ventas).",
    "question_type": "likert",
    "dimension": "Transformación productiva",
    "subdimension": "Adaptación a cambios del mercado",
    "is_required": true,
    "order_index": 75,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I072",
    "survey_id": "mipymes-diagnostico",
    "question_text": "La empresa ha cambiado canales de venta o proveedores como respuesta a una variación significativa de demanda.",
    "question_type": "likert",
    "dimension": "Transformación productiva",
    "subdimension": "Adaptación a cambios del mercado",
    "is_required": true,
    "order_index": 76,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I073",
    "survey_id": "mipymes-diagnostico",
    "question_text": "La empresa participa regularmente en ferias, ruedas de negocio o marketplaces regionales.",
    "question_type": "likert",
    "dimension": "Acceso a mercados e internacionalización",
    "subdimension": "Presencia en mercados locales",
    "is_required": true,
    "order_index": 77,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I074",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Nuestra marca está posicionada en canales locales que garantizan ventas estables.",
    "question_type": "likert",
    "dimension": "Acceso a mercados e internacionalización",
    "subdimension": "Presencia en mercados locales",
    "is_required": true,
    "order_index": 78,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I075",
    "survey_id": "mipymes-diagnostico",
    "question_text": "La empresa utiliza plataformas regionales (mercados locales en línea) para promocionarse.",
    "question_type": "likert",
    "dimension": "Acceso a mercados e internacionalización",
    "subdimension": "Presencia en mercados locales",
    "is_required": true,
    "order_index": 79,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I076",
    "survey_id": "mipymes-diagnostico",
    "question_text": "En los últimos 3 años, la empresa ha exportado bienes o servicios directamente.",
    "question_type": "likert",
    "dimension": "Acceso a mercados e internacionalización",
    "subdimension": "Exportación y comercio exterior",
    "is_required": true,
    "order_index": 80,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I077",
    "survey_id": "mipymes-diagnostico",
    "question_text": "La empresa cumple con los estándares y certificaciones necesarios para exportar.",
    "question_type": "likert",
    "dimension": "Acceso a mercados e internacionalización",
    "subdimension": "Exportación y comercio exterior",
    "is_required": true,
    "order_index": 81,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I078",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Hemos participado en misiones o ferias internacionales para abrir mercados de exportación.",
    "question_type": "likert",
    "dimension": "Acceso a mercados e internacionalización",
    "subdimension": "Exportación y comercio exterior",
    "is_required": true,
    "order_index": 82,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I079",
    "survey_id": "mipymes-diagnostico",
    "question_text": "La empresa realiza campañas de marketing digital (redes, anuncios pagados, email) con objetivos definidos.",
    "question_type": "likert",
    "dimension": "Acceso a mercados e internacionalización",
    "subdimension": "Marketing digital y comercio electrónico",
    "is_required": true,
    "order_index": 83,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I080",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Las ventas por canales digitales representan una proporción importante de los ingresos.",
    "question_type": "likert",
    "dimension": "Acceso a mercados e internacionalización",
    "subdimension": "Marketing digital y comercio electrónico",
    "is_required": true,
    "order_index": 84,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I081",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Medimos el retorno de inversión (ROI) de las campañas digitales.",
    "question_type": "likert",
    "dimension": "Acceso a mercados e internacionalización",
    "subdimension": "Marketing digital y comercio electrónico",
    "is_required": true,
    "order_index": 85,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I082",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Tenemos acuerdos comerciales con distribuidores o clientes corporativos que amplían nuestra cobertura.",
    "question_type": "likert",
    "dimension": "Acceso a mercados e internacionalización",
    "subdimension": "Alianzas comerciales",
    "is_required": true,
    "order_index": 86,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I083",
    "survey_id": "mipymes-diagnostico",
    "question_text": "La empresa participa en redes internacionales o cadenas de suministro que facilitan acceso a mercados.",
    "question_type": "likert",
    "dimension": "Acceso a mercados e internacionalización",
    "subdimension": "Alianzas comerciales",
    "is_required": true,
    "order_index": 87,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I084",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Contamos con contratos de suministro o distribución que aseguran pedidos recurrentes.",
    "question_type": "likert",
    "dimension": "Acceso a mercados e internacionalización",
    "subdimension": "Alianzas comerciales",
    "is_required": true,
    "order_index": 88,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I085",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Utilizamos un sistema ERP/CRM/POS para gestionar ventas, clientes e inventario.",
    "question_type": "likert",
    "dimension": "Digitalización",
    "subdimension": "Nivel de adopción de sistemas de gestión (ERP, CRM, POS)",
    "is_required": true,
    "order_index": 89,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I086",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Los sistemas están integrados y la información fluye entre áreas.",
    "question_type": "likert",
    "dimension": "Digitalización",
    "subdimension": "Nivel de adopción de sistemas de gestión (ERP, CRM, POS)",
    "is_required": true,
    "order_index": 90,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I087",
    "survey_id": "mipymes-diagnostico",
    "question_text": "El uso de estos sistemas se actualiza periódicamente y hay soporte técnico.",
    "question_type": "likert",
    "dimension": "Digitalización",
    "subdimension": "Nivel de adopción de sistemas de gestión (ERP, CRM, POS)",
    "is_required": true,
    "order_index": 91,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I088",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Tenemos tienda online o vendemos por marketplaces y procesamos pagos digitales.",
    "question_type": "likert",
    "dimension": "Digitalización",
    "subdimension": "Comercio electrónico y marketing digital",
    "is_required": true,
    "order_index": 92,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I089",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Usamos métricas digitales (conversiones, tráfico web) para mejorar ventas online.",
    "question_type": "likert",
    "dimension": "Digitalización",
    "subdimension": "Comercio electrónico y marketing digital",
    "is_required": true,
    "order_index": 93,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I090",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Los sistemas de pagos digitales están implementados y funcionan sin problemas.",
    "question_type": "likert",
    "dimension": "Digitalización",
    "subdimension": "Comercio electrónico y marketing digital",
    "is_required": true,
    "order_index": 94,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I091",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Contamos con medidas básicas de ciberseguridad (backups, antivirus, políticas de contraseña).",
    "question_type": "likert",
    "dimension": "Digitalización",
    "subdimension": "Ciberseguridad",
    "is_required": true,
    "order_index": 95,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I092",
    "survey_id": "mipymes-diagnostico",
    "question_text": "No hemos sufrido incidentes de seguridad informática en los últimos 2 años.",
    "question_type": "likert",
    "dimension": "Digitalización",
    "subdimension": "Ciberseguridad",
    "is_required": true,
    "order_index": 96,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I093",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Tenemos protocolos para gestión de incidentes y recuperación de datos.",
    "question_type": "likert",
    "dimension": "Digitalización",
    "subdimension": "Ciberseguridad",
    "is_required": true,
    "order_index": 97,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I094",
    "survey_id": "mipymes-diagnostico",
    "question_text": "El personal ha recibido capacitación en herramientas digitales relevantes para su puesto.",
    "question_type": "likert",
    "dimension": "Digitalización",
    "subdimension": "Capacitación en competencias digitales",
    "is_required": true,
    "order_index": 98,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I095",
    "survey_id": "mipymes-diagnostico",
    "question_text": "La empresa dispone de un plan de formación continua en competencias digitales.",
    "question_type": "likert",
    "dimension": "Digitalización",
    "subdimension": "Capacitación en competencias digitales",
    "is_required": true,
    "order_index": 99,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  },
  {
    "id": "I096",
    "survey_id": "mipymes-diagnostico",
    "question_text": "Se realizan evaluaciones periódicas de competencias digitales del personal.",
    "question_type": "likert",
    "dimension": "Digitalización",
    "subdimension": "Capacitación en competencias digitales",
    "is_required": true,
    "order_index": 100,
    "likert_config": {
      "scale_points": 5,
      "left_label": "Totalmente en desacuerdo",
      "right_label": "Totalmente de acuerdo",
      "middle_label": "Neutral"
    }
  }
];

export default surveyQuestions;
