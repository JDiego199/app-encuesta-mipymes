# Design Document

## Overview

Este diseño describe la refactorización del proyecto para eliminar toda la funcionalidad de API externa y crear páginas separadas para login y registro, manteniendo únicamente Supabase como backend. El objetivo es simplificar la arquitectura, mejorar la experiencia de usuario y mantener la consistencia visual.

## Architecture

### Current State
- Aplicación React con múltiples servicios API
- AuthPage unificada que maneja tanto login como registro
- LandingPage con un solo botón de "Iniciar Diagnóstico"
- Servicios mixtos (API + Supabase)

### Target State
- Aplicación React con Supabase únicamente
- Páginas separadas: LoginPage, RegisterPage
- LandingPage con botones separados para login y registro
- Eliminación completa de servicios API

### Navigation Flow
```
LandingPage
├── "Iniciar Sesión" → LoginPage
└── "Registrarse" → RegisterPage

LoginPage
├── Success → Dashboard (if profile exists) / ProfileSetup (if no profile)
└── "¿No tienes cuenta?" → RegisterPage

RegisterPage  
├── Success → ProfileSetup
└── "¿Ya tienes cuenta?" → LoginPage
```

## Components and Interfaces

### New Pages

#### LoginPage
- **Location**: `src/pages/LoginPage.tsx`
- **Purpose**: Página dedicada para iniciar sesión
- **Components Used**:
  - Formulario de login (reutilizar código existente de AuthForm/LoginForm)
  - Layout consistente con el diseño actual
  - Enlaces de navegación a RegisterPage
- **State Management**: Usar AuthContext existente
- **Styling**: Mantener paleta bidata-* y componentes UI existentes

#### RegisterPage
- **Location**: `src/pages/RegisterPage.tsx`
- **Purpose**: Página dedicada para registro
- **Components Used**:
  - Formulario de registro (reutilizar código existente de RegistrationFlow)
  - Layout consistente con el diseño actual
  - Enlaces de navegación a LoginPage
- **State Management**: Usar AuthContext existente
- **Styling**: Mantener paleta bidata-* y componentes UI existentes

### Modified Components

#### LandingPage
- **Changes**: 
  - Reemplazar botón único "Iniciar Diagnóstico" con dos botones
  - Agregar botón "Iniciar Sesión" que navega a LoginPage
  - Agregar botón "Registrarse" que navega a RegisterPage
- **Styling**: Mantener diseño actual, ajustar sección de botones

#### App.tsx
- **Changes**:
  - Actualizar lógica de routing para manejar nuevas páginas
  - Simplificar lógica de AuthPage
- **Navigation Logic**:
  ```typescript
  if (!user) return <LandingPage />
  if (user && !profile) return <ProfileSetup />
  return <Dashboard />
  ```

### Routing Strategy

Implementar routing usando React state management:
- **Landing**: Estado inicial sin usuario
- **Login**: Página de login accesible desde landing
- **Register**: Página de registro accesible desde landing
- **ProfileSetup**: Flujo existente para usuarios sin perfil
- **Dashboard**: Aplicación principal para usuarios completos

## Data Models

### Authentication Flow
Mantener el modelo existente de Supabase:
- **User**: Objeto de usuario de Supabase Auth
- **Profile**: Tabla profiles en Supabase con datos empresariales
- **Session**: Sesión de Supabase Auth

### State Management
Continuar usando AuthContext existente:
```typescript
interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}
```

## Error Handling

### Authentication Errors
- **Login Errors**: Mostrar mensajes específicos en LoginPage
- **Registration Errors**: Mostrar mensajes específicos en RegisterPage
- **Network Errors**: Manejar errores de conexión con Supabase
- **Validation Errors**: Validación de formularios en cliente

### User Experience
- Loading states durante autenticación
- Mensajes de error claros y en español
- Redirecciones apropiadas después de acciones exitosas

## Testing Strategy

### Component Testing
- Probar LoginPage de forma aislada
- Probar RegisterPage de forma aislada
- Probar navegación entre páginas
- Probar integración con AuthContext

### Integration Testing
- Flujo completo de registro → perfil → dashboard
- Flujo completo de login → dashboard
- Manejo de estados de error
- Persistencia de sesión

### Manual Testing
- Verificar consistencia visual
- Probar en diferentes tamaños de pantalla
- Verificar accesibilidad básica

## Implementation Phases

### Phase 1: Cleanup API Services
1. Eliminar archivos de servicios API
2. Remover importaciones y referencias
3. Verificar que no hay código roto

### Phase 2: Create New Pages
1. Crear LoginPage con formulario de login
2. Crear RegisterPage con formulario de registro
3. Implementar navegación entre páginas

### Phase 3: Update Landing Page
1. Modificar LandingPage para incluir ambos botones
2. Implementar navegación a nuevas páginas
3. Mantener diseño consistente

### Phase 4: Update App Logic
1. Simplificar lógica de routing en App.tsx
2. Actualizar manejo de estados de autenticación
3. Probar flujos completos

### Phase 5: Testing and Polish
1. Probar todos los flujos de usuario
2. Verificar consistencia visual
3. Limpiar código y optimizar

## Design Decisions and Rationales

### Separate Pages vs Single Page
**Decision**: Crear páginas separadas para login y registro
**Rationale**: Mejor UX, navegación más clara, código más mantenible

### Maintain AuthContext
**Decision**: Mantener AuthContext existente
**Rationale**: Funciona bien, evita refactoring innecesario, mantiene consistencia

### Supabase Only
**Decision**: Eliminar completamente servicios API
**Rationale**: Simplifica arquitectura, reduce complejidad, Supabase cubre todas las necesidades

### Visual Consistency
**Decision**: Mantener paleta de colores y componentes existentes
**Rationale**: Preserva identidad visual, reduce trabajo de diseño, mantiene coherencia

### State-based Routing
**Decision**: Usar state management en lugar de React Router
**Rationale**: Proyecto actual no usa router, mantiene simplicidad, suficiente para las necesidades