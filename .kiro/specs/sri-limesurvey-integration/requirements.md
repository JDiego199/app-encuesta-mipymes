# Requirements Document

## Introduction

Este documento describe los requerimientos para implementar un sistema completo de registro y autenticación que integra validación del SRI (Servicio de Rentas Internas), creación automática de perfiles en Supabase, y funcionalidad de encuestas usando LimeSurvey. El sistema debe validar RUCs ecuatorianos antes del registro, crear perfiles completos con información del SRI, y permitir a usuarios autenticados participar en encuestas embebidas.

## Requirements

### Requirement 1: Validación RUC con API del SRI

**User Story:** Como usuario que se registra, quiero que mi RUC sea validado automáticamente con el SRI, para asegurar que mi información empresarial sea correcta y actualizada.

#### Acceptance Criteria

1. WHEN un usuario ingresa un RUC en el formulario de registro THEN el sistema SHALL validar el RUC usando la API del SRI (https://srienlinea.sri.gob.ec/sri-catastro-sujeto-servicio-internet/rest/ConsolidadoContribuyente/obtenerPorNumerosRuc)
2. IF el RUC es válido y está activo THEN el sistema SHALL permitir continuar con el registro
3. IF el RUC es inválido o no está activo THEN el sistema SHALL mostrar un mensaje de error y no permitir el registro
4. WHEN la validación del RUC es exitosa THEN el sistema SHALL almacenar temporalmente la información del SRI para usar en la creación del perfil

### Requirement 2: Registro con Creación Automática de Perfil

**User Story:** Como usuario registrado, quiero que mi perfil se cree automáticamente con mi información del SRI, para no tener que ingresar manualmente datos que ya están disponibles.

#### Acceptance Criteria

1. WHEN un usuario completa el registro exitosamente THEN el sistema SHALL crear tanto la autenticación en Supabase como el perfil en la tabla profiles
2. WHEN se crea el perfil THEN el sistema SHALL incluir la información personal del usuario y los datos obtenidos de la API del SRI
3. IF falla la creación del perfil THEN el sistema SHALL revertir la creación del usuario de autenticación
4. WHEN el perfil se crea exitosamente THEN el sistema SHALL redirigir al usuario a la interfaz post-login

### Requirement 3: Interfaz Post-Login Simplificada

**User Story:** Como usuario autenticado, quiero una interfaz limpia con solo las opciones esenciales (perfil, cerrar sesión, cambiar contraseña, iniciar encuesta), para tener una experiencia enfocada y sin distracciones.

#### Acceptance Criteria

1. WHEN un usuario inicia sesión exitosamente THEN el sistema SHALL mostrar solo un header con icono de perfil
2. WHEN el usuario hace clic en el icono de perfil THEN el sistema SHALL mostrar opciones para cerrar sesión y cambiar contraseña
3. WHEN un usuario está autenticado THEN el sistema SHALL mostrar un footer pequeño con información siguiendo la misma línea de color
4. WHEN un usuario está autenticado THEN el sistema SHALL mostrar en el centro un botón de "Iniciar Encuesta"
5. IF el usuario no tiene perfil creado THEN el sistema SHALL redirigir a la creación de perfil

### Requirement 4: Integración con LimeSurvey

**User Story:** Como usuario autenticado, quiero poder participar en encuestas de LimeSurvey de forma integrada, para que mi experiencia sea fluida y mis respuestas estén vinculadas a mi perfil.

#### Acceptance Criteria

1. WHEN un usuario hace clic en "Iniciar Encuesta" THEN el sistema SHALL agregar al usuario como participante en LimeSurvey usando su UID de Supabase como token
2. WHEN se agrega el participante exitosamente THEN el sistema SHALL mostrar la encuesta embebida en el centro de la pantalla
3. WHEN se embebe la encuesta THEN la URL SHALL incluir el token del usuario para vincular las respuestas
4. IF falla la adición del participante THEN el sistema SHALL mostrar un mensaje de error apropiado
5. WHEN se usa la API de LimeSurvey THEN el sistema SHALL usar las credenciales y configuración especificadas (surveyID: 614997, URL: https://limesurvey.pruebasbidata.site/)

### Requirement 5: Navegación desde Landing Page

**User Story:** Como visitante del sitio, quiero poder acceder fácilmente tanto al login como al registro desde la página principal, para elegir la acción apropiada según mi situación.

#### Acceptance Criteria

1. WHEN un visitante accede a la landing page THEN el sistema SHALL mostrar botones separados para "Iniciar Sesión" y "Registrarse"
2. WHEN un visitante hace clic en "Iniciar Sesión" THEN el sistema SHALL redirigir a la página de login
3. WHEN un visitante hace clic en "Registrarse" THEN el sistema SHALL redirigir a la página de registro
4. WHEN se actualiza la landing page THEN el sistema SHALL eliminar toda funcionalidad que no esté relacionada con estos requerimientos

### Requirement 6: Uso de Edge Functions para LimeSurvey

**User Story:** Como desarrollador del sistema, quiero usar Edge Functions de Supabase para la integración con LimeSurvey, para mantener las credenciales seguras y tener mejor rendimiento.

#### Acceptance Criteria

1. WHEN se necesita interactuar con la API de LimeSurvey THEN el sistema SHALL usar Edge Functions de Supabase
2. WHEN se crea la Edge Function THEN SHALL manejar la autenticación con LimeSurvey de forma segura
3. WHEN se llama a la Edge Function THEN SHALL recibir el UID del usuario y sus datos de perfil
4. IF la Edge Function falla THEN SHALL retornar errores apropiados para manejo en el frontend

### Requirement 7: Limpieza de Funcionalidad Existente

**User Story:** Como usuario del sistema, quiero que solo esté disponible la funcionalidad relacionada con registro, login y encuestas, para tener una experiencia enfocada y sin confusión.

#### Acceptance Criteria

1. WHEN se implementa el nuevo sistema THEN se SHALL eliminar toda funcionalidad no relacionada con estos requerimientos
2. WHEN se actualiza la aplicación THEN los botones de la landing page SHALL redirigir únicamente a login y registro
3. WHEN se limpia el código THEN se SHALL remover componentes, servicios y páginas no utilizados
4. WHEN se completa la limpieza THEN la aplicación SHALL mantener solo las funcionalidades especificadas en estos requerimientos