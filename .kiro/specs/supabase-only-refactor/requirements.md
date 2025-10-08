# Requirements Document

## Introduction

Este proyecto requiere una refactorización completa para eliminar toda la funcionalidad relacionada con APIs externas y mantener únicamente la integración con Supabase. Además, se necesita separar la funcionalidad de autenticación en páginas independientes para login y registro, mejorando la experiencia de usuario y manteniendo la consistencia visual del proyecto.

## Requirements

### Requirement 1

**User Story:** Como desarrollador, quiero eliminar toda la funcionalidad de API externa para simplificar la arquitectura y mantener solo Supabase como backend

#### Acceptance Criteria

1. WHEN se revise el código THEN se SHALL eliminar todos los archivos de servicios API (apiClient.ts, authService.ts, profileService.ts, reportService.ts, rucService.ts)
2. WHEN se revise el código THEN se SHALL eliminar todas las importaciones y referencias a servicios API
3. WHEN se revise el código THEN se SHALL mantener únicamente las funciones que usan Supabase directamente
4. WHEN se compile el proyecto THEN no SHALL haber errores relacionados con servicios API eliminados

### Requirement 2

**User Story:** Como usuario, quiero tener una página dedicada para iniciar sesión para una mejor experiencia de navegación

#### Acceptance Criteria

1. WHEN acceda a la página de login THEN se SHALL mostrar un formulario específico para iniciar sesión
2. WHEN complete el formulario de login THEN se SHALL autenticar usando Supabase
3. WHEN el login sea exitoso THEN se SHALL redirigir al dashboard correspondiente
4. WHEN haya errores de login THEN se SHALL mostrar mensajes de error claros
5. WHEN esté en la página de login THEN se SHALL poder navegar a la página de registro

### Requirement 3

**User Story:** Como usuario, quiero tener una página dedicada para registrarme para una mejor experiencia de navegación

#### Acceptance Criteria

1. WHEN acceda a la página de registro THEN se SHALL mostrar un formulario específico para crear cuenta
2. WHEN complete el formulario de registro THEN se SHALL crear la cuenta usando Supabase
3. WHEN el registro sea exitoso THEN se SHALL proceder al flujo de configuración de perfil
4. WHEN haya errores de registro THEN se SHALL mostrar mensajes de error claros
5. WHEN esté en la página de registro THEN se SHALL poder navegar a la página de login

### Requirement 4

**User Story:** Como usuario, quiero que la página de landing tenga botones claros para acceder al login y registro

#### Acceptance Criteria

1. WHEN visite la página de landing THEN se SHALL mostrar un botón de "Iniciar Sesión"
2. WHEN visite la página de landing THEN se SHALL mostrar un botón de "Registrarse"
3. WHEN haga clic en "Iniciar Sesión" THEN se SHALL navegar a la página de login
4. WHEN haga clic en "Registrarse" THEN se SHALL navegar a la página de registro
5. WHEN los botones se muestren THEN SHALL mantener la misma línea gráfica del proyecto

### Requirement 5

**User Story:** Como desarrollador, quiero mantener la consistencia visual en todas las nuevas páginas para una experiencia coherente

#### Acceptance Criteria

1. WHEN se creen las nuevas páginas THEN se SHALL usar los mismos componentes UI existentes
2. WHEN se creen las nuevas páginas THEN se SHALL mantener la paleta de colores bidata-cyan, bidata-dark, bidata-gray
3. WHEN se creen las nuevas páginas THEN se SHALL usar las mismas tipografías y espaciados
4. WHEN se creen las nuevas páginas THEN se SHALL mantener el mismo estilo de botones y formularios
5. WHEN se creen las nuevas páginas THEN se SHALL seguir el mismo patrón de layout y estructura

### Requirement 6

**User Story:** Como usuario, quiero que el flujo de autenticación funcione correctamente con las páginas separadas

#### Acceptance Criteria

1. WHEN no esté autenticado THEN se SHALL mostrar la página de landing
2. WHEN esté autenticado pero sin perfil THEN se SHALL mostrar el flujo de configuración de perfil
3. WHEN esté completamente autenticado THEN se SHALL mostrar el dashboard
4. WHEN cierre sesión THEN se SHALL redirigir a la página de landing
5. WHEN haya errores de autenticación THEN se SHALL manejar apropiadamente y mostrar mensajes claros

### Requirement 7

**User Story:** Como desarrollador, quiero que el código sea limpio y mantenible después del refactoring

#### Acceptance Criteria

1. WHEN se complete el refactoring THEN no SHALL haber código muerto o importaciones no utilizadas
2. WHEN se complete el refactoring THEN se SHALL mantener la estructura de carpetas organizada
3. WHEN se complete el refactoring THEN se SHALL actualizar las rutas y navegación apropiadamente
4. WHEN se compile el proyecto THEN no SHALL haber warnings relacionados con el refactoring
5. WHEN se ejecute el proyecto THEN SHALL funcionar correctamente sin errores de consola