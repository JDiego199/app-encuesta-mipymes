# Implementation Plan

- [x] 1. Eliminar servicios API y limpiar dependencias

  - Eliminar archivos de servicios API (apiClient.ts, authService.ts, profileService.ts, reportService.ts, rucService.ts)
  - Remover todas las importaciones y referencias a estos servicios en el código
  - Verificar que no hay errores de compilación después de la limpieza
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Crear página de Login separada

  - Crear componente LoginPage en src/pages/LoginPage.tsx
  - Implementar formulario de login reutilizando código existente de AuthForm/LoginForm
  - Agregar navegación a RegisterPage con enlace "¿No tienes cuenta?"
  - Mantener consistencia visual con paleta bidata-\* y componentes UI existentes
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 3. Crear página de Register separada

  - Crear componente RegisterPage en src/pages/RegisterPage.tsx
  - Implementar formulario de registro reutilizando código existente de RegistrationFlow
  - Agregar navegación a LoginPage con enlace "¿Ya tienes cuenta?"
  - Mantener consistencia visual con paleta bidata-\* y componentes UI existentes
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 4. Actualizar LandingPage con botones separados

  - Modificar LandingPage para reemplazar botón único con dos botones separados
  - Implementar botón "Iniciar Sesión" que navegue a LoginPage
  - Implementar botón "Registrarse" que navegue a RegisterPage
  - Mantener el diseño actual y ajustar solo la sección de botones
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 5. Actualizar lógica de routing en App.tsx

  - Simplificar lógica de AuthPage para manejar nuevas páginas separadas
  - Implementar navegación entre LandingPage, LoginPage y RegisterPage

  - Mantener flujo existente para ProfileSetup y Dashboard
  - Asegurar manejo correcto de estados de autenticación
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 6. Limpiar código y optimizar

  - Remover código muerto e importaciones no utilizadas
  - Verificar que no hay warnings de compilación
  - Probar flujos completos de autenticación
  - Verificar que no hay errores de consola en runtime
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
