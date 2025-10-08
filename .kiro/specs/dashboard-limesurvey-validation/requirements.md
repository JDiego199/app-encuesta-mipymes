# Requirements Document

## Introduction

Este documento describe los requerimientos para implementar validación del estado de participación en encuestas de LimeSurvey directamente desde el dashboard del usuario. El sistema debe verificar el estado de participación usando la API de LimeSurvey con el método `list_participants`, manejar tres estados diferentes de participación, y proporcionar un dashboard de resultados con funcionalidad de descarga de PDF cuando la encuesta esté completada.

## Requirements

### Requirement 1: Validación de Estado de Participación en Dashboard

**User Story:** Como usuario autenticado en el dashboard, quiero que el sistema verifique automáticamente mi estado de participación en la encuesta usando mi ID de usuario como token, para mostrarme la información correcta sobre mi progreso en la encuesta.

#### Acceptance Criteria

1. WHEN un usuario accede al dashboard THEN el sistema SHALL llamar automáticamente a una Edge Function que consulte la API de LimeSurvey usando el método `list_participants`
2. WHEN se hace la consulta a LimeSurvey THEN el sistema SHALL usar el UID del usuario de Supabase como token de búsqueda
3. WHEN se ejecuta la consulta THEN el sistema SHALL usar los parámetros correctos: sessionKey, surveyID (614997), y filtros para campos ["completed","completed_date","usesleft","email"]
4. IF la consulta falla THEN el sistema SHALL mostrar un mensaje de error apropiado y permitir reintento manual

### Requirement 2: Manejo de Estado "Participante No Encontrado"

**User Story:** Como usuario que no ha sido registrado como participante en la encuesta, quiero que el sistema me registre automáticamente, para poder acceder a la encuesta sin intervención manual.

#### Acceptance Criteria

1. WHEN la API de LimeSurvey retorna `{"result":{"status":"No survey participants found."}}` THEN el sistema SHALL identificar que el usuario no está registrado como participante
2. WHEN se detecta que el usuario no está registrado THEN el sistema SHALL llamar automáticamente a la Edge Function existente para agregar el participante
3. WHEN se agrega el participante exitosamente THEN el sistema SHALL mostrar un mensaje indicando que se ha registrado al usuario y está listo para iniciar la encuesta
4. WHEN se completa el registro THEN el sistema SHALL mostrar un botón "Iniciar Encuesta" que permita acceder a la encuesta embebida

### Requirement 3: Manejo de Estado "Encuesta Pendiente"

**User Story:** Como usuario registrado que no ha completado la encuesta, quiero ver claramente que tengo una encuesta pendiente y poder acceder a ella fácilmente, para completar mi participación.

#### Acceptance Criteria

1. WHEN la API de LimeSurvey retorna un participante con `"completed":"N"` THEN el sistema SHALL identificar que la encuesta está pendiente
2. WHEN se detecta encuesta pendiente THEN el sistema SHALL mostrar un mensaje claro indicando "Encuesta Pendiente de Completar"
3. WHEN se muestra el estado pendiente THEN el sistema SHALL mostrar un botón "Continuar Encuesta" que permita acceder a la encuesta embebida
4. WHEN se muestra el estado pendiente THEN el sistema SHALL indicar cuántos usos quedan disponibles basado en el campo `usesleft`

### Requirement 4: Manejo de Estado "Encuesta Completada"

**User Story:** Como usuario que ha completado la encuesta, quiero ver claramente que la he completado con la fecha de finalización y poder acceder a mis resultados, para revisar mi desempeño y compararlo con otros participantes.

#### Acceptance Criteria

1. WHEN la API de LimeSurvey retorna un participante con una fecha en el campo `completed` (formato "2025-08-30 20:52") THEN el sistema SHALL identificar que la encuesta está completada
2. WHEN se detecta encuesta completada THEN el sistema SHALL mostrar "Encuesta Completada" junto con la fecha de finalización formateada
3. WHEN se muestra el estado completado THEN el sistema SHALL mostrar un botón "Ver Resultados" que navegue al dashboard de resultados
4. WHEN se formatea la fecha THEN el sistema SHALL mostrar la fecha en formato legible para el usuario (ej: "30 de Agosto, 2025 a las 20:52")

### Requirement 5: Dashboard de Resultados con Datos Artificiales

**User Story:** Como usuario que ha completado la encuesta, quiero acceder a un dashboard que muestre mis resultados individuales comparados con los promedios generales, para entender mi desempeño relativo en la encuesta.

#### Acceptance Criteria

1. WHEN un usuario hace clic en "Ver Resultados" THEN el sistema SHALL navegar a una nueva página `/dashboard/resultados`
2. WHEN se carga el dashboard de resultados THEN el sistema SHALL mostrar datos artificiales que simulen resultados reales de encuesta
3. WHEN se muestran los resultados THEN el sistema SHALL incluir al menos 5 métricas diferentes con comparación individual vs promedio general
4. WHEN se presenta la información THEN el sistema SHALL usar gráficos visuales (barras, círculos, o líneas) para facilitar la comprensión
5. WHEN se muestran las comparaciones THEN el sistema SHALL indicar claramente si el usuario está por encima, por debajo, o en el promedio para cada métrica

### Requirement 6: Funcionalidad de Descarga de Reporte PDF

**User Story:** Como usuario que visualiza sus resultados, quiero poder descargar un reporte en PDF con mis resultados y comparaciones, para guardar una copia personal de mi desempeño en la encuesta.

#### Acceptance Criteria

1. WHEN un usuario está en el dashboard de resultados THEN el sistema SHALL mostrar un botón "Descargar Reporte PDF"
2. WHEN el usuario hace clic en "Descargar Reporte PDF" THEN el sistema SHALL generar un PDF con los mismos datos mostrados en pantalla
3. WHEN se genera el PDF THEN SHALL incluir el nombre del usuario, fecha de generación, y todos los gráficos y métricas del dashboard
4. WHEN se descarga el PDF THEN el archivo SHALL tener un nombre descriptivo que incluya el nombre del usuario y la fecha
5. WHEN se genera el PDF THEN SHALL mantener el formato visual y la legibilidad de los datos mostrados en pantalla

### Requirement 7: Implementación con Edge Functions

**User Story:** Como desarrollador del sistema, quiero que toda la comunicación con la API de LimeSurvey se maneje a través de Edge Functions de Supabase, para mantener las credenciales seguras y tener mejor control de errores.

#### Acceptance Criteria

1. WHEN se necesita consultar el estado de participación THEN el sistema SHALL usar una Edge Function específica para `list_participants`
2. WHEN se crea la Edge Function THEN SHALL manejar la autenticación con LimeSurvey y la gestión de sesiones de forma segura
3. WHEN se llama a la Edge Function THEN SHALL recibir el UID del usuario y retornar el estado de participación procesado
4. IF la Edge Function falla THEN SHALL retornar códigos de error específicos que permitan manejo apropiado en el frontend
5. WHEN se implementa la Edge Function THEN SHALL incluir logging apropiado para debugging y monitoreo

### Requirement 8: Integración No Invasiva con Dashboard Existente

**User Story:** Como usuario del sistema existente, quiero que las nuevas funcionalidades se integren sin afectar otras características del dashboard, para mantener la estabilidad y funcionalidad actual.

#### Acceptance Criteria

1. WHEN se implementa la nueva funcionalidad THEN el sistema SHALL mantener toda la funcionalidad existente del dashboard intacta
2. WHEN se agrega la validación de LimeSurvey THEN SHALL ser un componente adicional que no interfiera con otros elementos
3. WHEN se carga el dashboard THEN la validación de participación SHALL ejecutarse de forma asíncrona sin bloquear la carga de otros elementos
4. IF falla la validación de LimeSurvey THEN el dashboard SHALL continuar funcionando normalmente con las demás características
5. WHEN se navega al dashboard de resultados THEN SHALL ser una ruta completamente nueva que no afecte la navegación existente