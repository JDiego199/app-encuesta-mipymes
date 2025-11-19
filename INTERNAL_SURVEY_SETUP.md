# Configuración del Sistema Interno de Encuestas

Este documento explica cómo configurar el sistema interno de encuestas para reemplazar la integración con LimeSurvey.

## 🚀 Estado Actual

✅ **Completado:**
- Componente QuestionRenderer con todos los tipos de pregunta
- Extracción de 100 preguntas reales del Excel
- Servicio para manejar encuestas internas
- Hook personalizado para el manejo de estado
- Página de encuesta interna funcional
- Sistema de guardado de progreso
- Integración temporal con el Dashboard

⚠️ **Pendiente:**
- Crear tablas en la base de datos
- Insertar preguntas en la base de datos
- Configurar credenciales de Supabase

## 📋 Pasos para Completar la Configuración

### 1. Crear las Tablas en Supabase

1. Ve a tu proyecto de Supabase
2. Abre el **SQL Editor**
3. Ejecuta el contenido del archivo `sql/create_internal_survey_tables.sql`

### 2. Insertar las Preguntas del Excel

1. Obtén tu **Service Role Key** de Supabase:
   - Ve a Settings > API
   - Copia la "service_role" key (no la anon key)

2. Edita el archivo `scripts/populate-survey-questions.js`:
   ```javascript
   const supabaseKey = 'tu-service-role-key-aqui'
   ```

3. Ejecuta el script:
   ```bash
   node scripts/populate-survey-questions.js
   ```

### 3. Verificar la Configuración

Una vez completados los pasos anteriores:

1. **Reinicia la aplicación** para que tome los cambios
2. **Ve al Dashboard** - debería mostrar "Iniciar Diagnóstico"
3. **Haz clic en el botón** - debería redirigir a `/internal-survey`
4. **Completa algunas preguntas** - el progreso se debería guardar automáticamente
5. **Recarga la página** - debería continuar desde donde lo dejaste

## 🔧 Funcionalidades Implementadas

### Dashboard
- ✅ Detección automática del estado de la encuesta
- ✅ Botones dinámicos según el progreso
- ✅ Redirección al sistema interno

### Encuesta Interna
- ✅ 100 preguntas reales del Excel
- ✅ 8 tipos de pregunta diferentes
- ✅ Guardado automático de respuestas
- ✅ Barra de progreso
- ✅ Navegación entre preguntas
- ✅ Validación de campos requeridos
- ✅ Manejo de errores

### Tipos de Pregunta Soportados
1. **Texto simple** (`text`)
2. **Área de texto** (`textarea`) 
3. **Opción múltiple** (`radio`)
4. **Selección múltiple** (`checkbox`)
5. **Lista desplegable** (`select`)
6. **Escala numérica** (`scale`)
7. **Número** (`number`)
8. **Escala Likert** (`likert`)

### Base de Datos
- ✅ Tablas diseñadas para escalabilidad
- ✅ Políticas RLS para seguridad
- ✅ Índices para rendimiento
- ✅ Soporte para respuestas complejas

## 🎯 Próximos Pasos

Una vez que el sistema esté funcionando:

1. **Remover dependencias de LimeSurvey:**
   - Eliminar `useLimeSurveyValidation.ts` original
   - Renombrar `useLimeSurveyValidation.temp.ts` a `useLimeSurveyValidation.ts`
   - Limpiar código relacionado con LimeSurvey

2. **Mejorar la experiencia:**
   - Implementar guardado automático cada X segundos
   - Agregar indicadores visuales de guardado
   - Implementar navegación por secciones/dimensiones

3. **Análisis de resultados:**
   - Crear dashboard de resultados mejorado
   - Implementar cálculos por dimensión
   - Generar reportes PDF con datos reales

## 🐛 Solución de Problemas

### Error: "Cannot find module '@/data/survey-questions'"
- Asegúrate de que el archivo `src/data/survey-questions.ts` existe
- Ejecuta `node scripts/convert-survey-questions.js` para generarlo

### Error: "Table 'surveys' doesn't exist"
- Ejecuta el SQL del paso 1 en Supabase
- Verifica que las tablas se crearon correctamente

### Error: "No questions available"
- Ejecuta el script del paso 2 para insertar las preguntas
- Verifica que las preguntas se insertaron en la base de datos

### El progreso no se guarda
- Verifica las políticas RLS en Supabase
- Revisa la consola del navegador para errores
- Asegúrate de que el usuario esté autenticado

## 📊 Estructura de Datos

### Dimensiones de la Encuesta
1. **Marco Institucional** (12 preguntas)
2. **Entorno operativo / Simplificación de procedimientos** (12 preguntas)
3. **Acceso al financiamiento** (12 preguntas)
4. **Servicios de Desarrollo Empresarial y compras públicas** (12 preguntas)
5. **Innovación y tecnología** (12 preguntas)
6. **Transformación productiva** (12 preguntas)
7. **Acceso a mercados e internacionalización** (12 preguntas)
8. **Digitalización** (12 preguntas)
9. **Preguntas generales** (4 preguntas)

**Total: 100 preguntas**