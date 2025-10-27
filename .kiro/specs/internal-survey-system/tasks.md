# Implementation Plan

- [x] 1. Crear esquema de base de datos en Supabase

  - Crear migración para tabla `surveys` con campos básicos de encuesta
  - Crear migración para tabla `survey_questions` con tipos de pregunta y opciones
  - Crear migración para tabla `survey_participants` con estados de participación
  - Crear migración para tabla `survey_responses` con respuestas de usuarios
  - Configurar políticas RLS para todas las tablas nuevas
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4_

- [x] 2. Poblar base de datos con datos de encuesta

  - Leer archivo Excel de la carpeta instrumento para extraer preguntas
  - Crear script para insertar encuesta principal en tabla `surveys`
  - Insertar todas las preguntas con tipos y opciones en `survey_questions`
  - Verificar que el orden de preguntas sea correcto
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 3. Implementar servicio de encuestas

  - Crear `src/services/surveyService.ts` con funciones CRUD para encuestas

  - Implementar `getSurveyQuestions()` para obtener preguntas ordenadas
  - Implementar `getParticipantStatus()` para consultar estado del usuario
  - Implementar `createParticipant()` para inicializar participación
  - Implementar `saveResponse()` para guardar respuestas individuales
  - Implementar `updateParticipantStatus()` para cambiar estados
  - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.2, 4.3_

- [x] 4. Crear hook personalizado para gestión de encuesta

  - Implementar `src/hooks/useSurvey.ts` con estado completo de encuesta
  - Gestionar navegación entre preguntas con validación
  - Implementar guardado automático de respuestas
  - Manejar estados de carga y errores

  - Implementar lógica de finalización de encuesta
  - _Requirements: 3.4, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 5. Implementar componente QuestionRenderer

  - Crear `src/components/survey/QuestionRenderer.tsx` para renderizar tipos de pregunta
  - Implementar renderizado para preguntas de texto simple
  - Implementar renderizado para preguntas de área de texto
  - Implementar renderizado para preguntas de opción múltiple (radio)
  - Implementar renderizado para preguntas de selección múltiple (checkbox)
  - Implementar renderizado para preguntas de escala numérica
  - Implementar renderizado para preguntas tipo Likert con etiquetas personalizables
  - Aplicar estilos consistentes con paleta bidata-\*
  - _Requirements: 2.2, 3.3, 7.5_

- [x] 6. Crear componente de navegación de encuesta

  - Implementar `src/components/survey/SurveyNavigation.tsx` con botones de navegación
  - Crear botón "Anterior" con lógica de deshabilitación en primera pregunta
  - Crear botón "Siguiente" con validación de preguntas obligatorias
  - Crear botón "Finalizar" que aparece en la última pregunta
  - Agregar indicador de progreso visual
  - _Requirements: 3.4, 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 7. Implementar página principal de encuesta

  - Crear `src/pages/SurveyPage.tsx` como página principal de encuesta interna
  - Integrar QuestionRenderer para mostrar pregunta actual
  - Integrar SurveyNavigation para navegación entre preguntas
  - Implementar lógica de guardado automático al cambiar respuestas
  - Manejar estados de carga y errores de red
  - Aplicar diseño consistente con paleta de colores existente
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.1, 4.2, 4.3, 4.4, 7.5_

- [x] 8. Modificar Dashboard para usar sistema interno

  - Actualizar `src/pages/Dashboard.tsx` para eliminar lógica de LimeSurvey
  - Implementar consulta de estado de participante usando surveyService
  - Actualizar lógica de botones según nuevo estado (not_started/in_progress/completed)
  - Cambiar navegación de iframe a SurveyPage interna
  - Mantener mismo diseño y comportamiento visual
  - _Requirements: 1.4, 7.1, 7.2, 7.3, 7.4_

- [x] 9. Actualizar sistema de routing

  - Agregar ruta para SurveyPage en `src/App.tsx`
  - Configurar parámetros de ruta para survey ID y participant ID
  - Implementar protección de ruta para usuarios autenticados

  - Verificar que navegación entre páginas funcione correctamente
  - _Requirements: 3.1, 7.1, 7.2_

-

- [x] 10. Conectar resultados con datos internos

  - Modificar componentes de gráficos existentes para usar datos de Supabase
  - Actualizar consultas de resultados para usar tabla `survey_responses`
  - Implementar agregación de datos para diferentes tipos de pregunta
  - Mantener mismo formato visual de gráficos existentes
  - Verificar que botón "Ver Resultados" funcione correctamente
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 11. Implementar manejo de errores y estados de carga

  - Agregar manejo de errores en todos los componentes de encuesta
  - Implementar estados de carga durante guardado automático
  - Crear mensajes de error específicos para diferentes escenarios
  - Implementar reintentos automáticos para operaciones fallidas
  - Agregar notificaciones de éxito/error usando sistema existente
  - _Requirements: 4.4, 5.4_

- [ ] 12. Eliminar código de LimeSurvey

  - Remover Edge Function `add-limesurvey-participant` de Supabase
  - Eliminar todas las referencias a LimeSurvey en el código frontend
  - Remover dependencias y configuraciones relacionadas con LimeSurvey
  - Limpiar imports y código no utilizado
  - Verificar que no queden referencias a funcionalidad antigua
  - _Requirements: 8.1, 8.2, 8.3, 8.5_

- [ ] 13. Crear tests unitarios para componentes nuevos

  - Escribir tests para QuestionRenderer con todos los tipos de pregunta
  - Escribir tests para SurveyNavigation con diferentes estados
  - Escribir tests para useSurvey hook con navegación y guardado
  - Escribir tests para surveyService con todas las operaciones
  - Verificar cobertura de código en componentes críticos
  - _Requirements: Todos los requerimientos de funcionalidad_

- [ ] 14. Probar flujo completo de encuesta

  - Probar registro de usuario y creación de participante
  - Probar inicio de encuesta y navegación entre preguntas
  - Probar guardado automático y recuperación de progreso
  - Probar finalización de encuesta y cambio de estado
  - Probar visualización de resultados con datos internos
  - Verificar que todos los tipos de pregunta funcionen correctamente
  - _Requirements: 1.1, 1.2, 1.3, 3.1, 3.2, 3.3, 4.1, 4.2, 5.1, 5.5, 6.1_

- [ ] 15. Optimizar rendimiento y experiencia de usuario
  - Implementar debounce en guardado automático para reducir llamadas API
  - Agregar indicadores visuales de guardado en progreso
  - Optimizar consultas de base de datos con índices apropiados
  - Implementar caching de respuestas para navegación rápida
  - Verificar que la aplicación funcione sin conexión temporal
  - _Requirements: 4.1, 4.2, 4.3, 4.4_
