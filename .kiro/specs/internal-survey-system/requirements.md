# Requirements Document

## Introduction

Este documento describe los requerimientos para migrar el sistema actual de encuestas de LimeSurvey a una implementación interna usando Supabase. El sistema debe mantener toda la funcionalidad existente de registro y autenticación, pero reemplazar la integración con LimeSurvey por una página web interna que gestione las encuestas directamente en la base de datos de Supabase. Se debe preservar todo el frontend existente y solo cambiar la lógica de funcionamiento de las encuestas.

## Requirements

### Requirement 1: Gestión de Estado de Participantes en Supabase

**User Story:** Como usuario registrado, quiero que mi estado de participación en la encuesta se gestione directamente en Supabase, para tener un control más preciso y confiable del progreso.

#### Acceptance Criteria

1. WHEN un usuario se registra por primera vez THEN el sistema SHALL crear un registro en la tabla de participantes con estado "not_started" (false)
2. WHEN un usuario inicia la encuesta THEN el sistema SHALL actualizar su estado a "in_progress" (true)
3. WHEN un usuario completa la encuesta THEN el sistema SHALL actualizar su estado a "completed" (completada)
4. WHEN se consulta el estado del participante THEN el sistema SHALL retornar el estado actual para mostrar el botón apropiado (iniciar/continuar/ver resultados)

### Requirement 2: Tabla de Encuestas en Supabase

**User Story:** Como administrador del sistema, quiero que las preguntas de la encuesta estén almacenadas en Supabase, para poder gestionar el contenido de forma centralizada y flexible.

#### Acceptance Criteria

1. WHEN se crea la tabla de encuestas THEN SHALL incluir campos para pregunta, tipo de pregunta, opciones de respuesta, orden, y si es obligatoria
2. WHEN se define el tipo de pregunta THEN SHALL soportar tipos como texto, opción múltiple, escala, y otros tipos necesarios
3. WHEN se almacenan las opciones THEN SHALL permitir múltiples opciones para preguntas de selección
4. WHEN se consultan las preguntas THEN SHALL retornar en el orden correcto para la presentación
5. WHEN se marca una pregunta como obligatoria THEN el sistema SHALL requerir respuesta antes de avanzar

### Requirement 3: Página Web Interna para Encuestas

**User Story:** Como usuario participante, quiero completar la encuesta en una página web interna, para tener una experiencia integrada sin salir de la aplicación.

#### Acceptance Criteria

1. WHEN un usuario hace clic en "Iniciar Encuesta" THEN el sistema SHALL navegar a una página interna de encuesta
2. WHEN se carga la página de encuesta THEN SHALL mostrar solo una pregunta a la vez
3. WHEN se presenta una pregunta THEN SHALL mostrar el tipo de input apropiado según el tipo de pregunta
4. WHEN se muestra la pregunta THEN SHALL incluir botones "Anterior" y "Siguiente" en la parte inferior
5. WHEN una pregunta es obligatoria y no está respondida THEN el botón "Siguiente" SHALL estar deshabilitado
6. WHEN se usa la página de encuesta THEN SHALL seguir la misma línea de colores del diseño existente

### Requirement 4: Guardado Automático de Progreso

**User Story:** Como usuario participante, quiero que mi progreso se guarde automáticamente, para no perder mis respuestas si tengo que interrumpir la encuesta.

#### Acceptance Criteria

1. WHEN un usuario responde una pregunta THEN el sistema SHALL guardar la respuesta automáticamente en Supabase
2. WHEN un usuario regresa a la encuesta THEN el sistema SHALL cargar desde la última pregunta respondida
3. WHEN se guarda una respuesta THEN SHALL incluir el ID del usuario, ID de la pregunta, respuesta, y timestamp
4. WHEN falla el guardado automático THEN el sistema SHALL mostrar un mensaje de error y permitir reintentar
5. WHEN se navega entre preguntas THEN el sistema SHALL mantener las respuestas previamente guardadas

### Requirement 5: Navegación Entre Preguntas

**User Story:** Como usuario participante, quiero poder navegar hacia adelante y atrás entre las preguntas, para revisar y modificar mis respuestas según sea necesario.

#### Acceptance Criteria

1. WHEN un usuario está en la primera pregunta THEN el botón "Anterior" SHALL estar deshabilitado
2. WHEN un usuario está en la última pregunta THEN el botón "Siguiente" SHALL cambiar a "Finalizar"
3. WHEN un usuario hace clic en "Anterior" THEN SHALL navegar a la pregunta previa manteniendo las respuestas
4. WHEN un usuario hace clic en "Siguiente" THEN SHALL validar que la pregunta obligatoria esté respondida
5. WHEN todas las preguntas están respondidas y se hace clic en "Finalizar" THEN SHALL completar la encuesta y actualizar el estado

### Requirement 6: Integración con Sistema de Resultados Existente

**User Story:** Como usuario que completó la encuesta, quiero que los gráficos de resultados funcionen con los nuevos datos de Supabase, para poder ver los resultados de la misma manera que antes.

#### Acceptance Criteria

1. WHEN se migra a la implementación interna THEN los gráficos existentes SHALL funcionar con los datos de Supabase
2. WHEN se consultan los resultados THEN SHALL usar las respuestas almacenadas en la tabla de respuestas de Supabase
3. WHEN se generan los gráficos THEN SHALL mantener el mismo formato y presentación visual
4. WHEN un usuario hace clic en "Ver Resultados" THEN SHALL mostrar los gráficos actualizados con todos los datos
5. WHEN se calculan estadísticas THEN SHALL incluir todas las respuestas completadas en la base de datos

### Requirement 7: Preservación del Frontend Existente

**User Story:** Como usuario del sistema, quiero que la interfaz y navegación se mantengan igual, para no tener que aprender una nueva forma de usar la aplicación.

#### Acceptance Criteria

1. WHEN se implementa el nuevo sistema THEN SHALL mantener todos los componentes de UI existentes
2. WHEN se navega por la aplicación THEN SHALL preservar el mismo flujo de navegación
3. WHEN se muestran los botones de estado THEN SHALL mantener la misma lógica (iniciar/continuar/ver resultados)
4. WHEN se usa el header y footer THEN SHALL mantener el mismo diseño y funcionalidad
5. WHEN se aplican estilos THEN SHALL usar la misma paleta de colores y componentes existentes

### Requirement 8: Migración de Datos y Limpieza

**User Story:** Como administrador del sistema, quiero que se elimine toda la funcionalidad de LimeSurvey y se migre a la nueva implementación, para tener un sistema más simple y mantenible.

#### Acceptance Criteria

1. WHEN se implementa el nuevo sistema THEN SHALL remover todas las Edge Functions relacionadas con LimeSurvey
2. WHEN se limpia el código THEN SHALL eliminar todas las referencias a la API de LimeSurvey
3. WHEN se actualiza la lógica THEN SHALL reemplazar las llamadas a LimeSurvey con llamadas a Supabase
4. WHEN se migran los datos existentes THEN SHALL preservar la información de usuarios y perfiles
5. WHEN se completa la migración THEN el sistema SHALL funcionar completamente sin dependencias externas de encuestas