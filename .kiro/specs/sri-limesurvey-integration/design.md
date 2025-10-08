# Design Document

## Overview

Este diseño describe la implementación de un sistema completo de registro, autenticación y encuestas que integra validación del SRI, creación automática de perfiles en Supabase, y funcionalidad de encuestas usando LimeSurvey. El diseño reutiliza completamente el código existente que ya funciona, realizando solo las modificaciones mínimas necesarias para cumplir con los nuevos requerimientos.

## Architecture

### Current State Analysis
El código actual ya implementa la mayoría de funcionalidades requeridas:
- ✅ Validación RUC con SRI (Edge Function `validate-ruc`)
- ✅ Creación automática de perfiles (Edge Function `create-profile`)
- ✅ Páginas separadas de Login y Register
- ✅ Integración con LimeSurvey (Edge Function `add-limesurvey-participant`)
- ✅ Dashboard con botón de iniciar encuesta
- ✅ Landing page con botones separados
- ✅ AuthContext completo con manejo de sesiones

### Target State
Mantener toda la arquitectura existente y realizar solo estas modificaciones:
1. **Modificar RegisterPage**: Asegurar que cree perfil automáticamente después del registro
2. **Simplificar Dashboard**: Mostrar solo header con perfil, botón de encuesta, y footer
3. **Limpiar funcionalidad**: Remover código no relacionado con los requerimientos
4. **Verificar Edge Functions**: Asegurar que funcionen correctamente con los datos requeridos

### Navigation Flow (Ya implementado)
```
LandingPage
├── "Iniciar Sesión" → LoginPage
└── "Registrarse" → RegisterPage

LoginPage
├── Success → Dashboard (if profile exists)
└── "¿No tienes cuenta?" → RegisterPage

RegisterPage  
├── Success → Dashboard (profile created automatically)
└── "¿Ya tienes cuenta?" → LoginPage

Dashboard
├── Header with profile menu (logout, change password)
├── "Iniciar Encuesta" button → LimeSurvey integration
└── Footer
```

## Components and Interfaces

### Existing Components (Keep as-is)

#### AuthContext (`src/contexts/AuthContext.tsx`)
- **Status**: ✅ Complete - No changes needed
- **Functionality**: Maneja autenticación, sesiones, y perfiles
- **Interface**: 
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

#### LoginPage (`src/pages/LoginPage.tsx`)
- **Status**: ✅ Complete - No changes needed
- **Functionality**: Página de login con validación y navegación a registro
- **Features**: Formulario completo, manejo de errores, diseño bidata-*

#### LandingPage (`src/components/landing/LandingPage.tsx`)
- **Status**: ✅ Complete - No changes needed
- **Functionality**: Landing page con botones separados para login y registro
- **Features**: Diseño completo, información del proyecto, navegación correcta

#### Dashboard (`src/pages/Dashboard.tsx`)
- **Status**: ✅ Complete - No changes needed
- **Functionality**: Dashboard con botón de iniciar encuesta e integración LimeSurvey
- **Features**: Botón de encuesta, iframe embebido, manejo de participantes

### Components to Modify

#### RegisterPage (`src/pages/RegisterPage.tsx`)
- **Status**: ⚠️ Needs verification
- **Current**: Ya implementa validación RUC y creación de perfil
- **Required Changes**: Verificar que el flujo de creación de perfil funcione correctamente
- **Key Features**:
  - Validación automática de RUC con SRI
  - Formulario unificado (datos personales + empresariales)
  - Creación automática de perfil después del registro
  - Manejo de errores y estados de carga

#### App.tsx (`src/App.tsx`)
- **Status**: ⚠️ Needs cleanup
- **Current**: Maneja routing y estados de autenticación
- **Required Changes**: Limpiar funcionalidad no relacionada con los requerimientos
- **Key Logic**:
```typescript
if (!user) return <LandingPage | LoginPage | RegisterPage />
if (user && !profile) return <RegistrationFlow />
return <Dashboard />
```

### Header and Footer Components

#### Header (`src/components/layout/Header.tsx`)
- **Status**: ⚠️ Needs simplification
- **Required Features**:
  - Icono de perfil en la izquierda
  - Dropdown con opciones: "Cerrar Sesión", "Cambiar Contraseña"
  - Diseño minimalista siguiendo paleta bidata-*

#### Footer (`src/components/layout/Footer.tsx`)
- **Status**: ⚠️ Needs simplification
- **Required Features**:
  - Footer pequeño con información del proyecto
  - Seguir la misma línea de color del header
  - Información mínima y discreta

## Data Models

### Profile Model (Already implemented)
```typescript
interface Profile {
  id: string
  email: string
  ruc: string
  razon_social: string
  actividad_economica: string
  estado_contribuyente: string
  direccion: string
  telefono: string
  sri_data: any
  nombre_persona: string
  nombre_empresa: string
  sector: string
  ciudad: string
  created_at: string
  updated_at: string
}
```

### SRI Validation Response (Already implemented)
```typescript
interface SRIResponse {
  valid: boolean
  contribuyente: {
    numeroRuc: string
    razonSocial: string
    estadoContribuyenteRuc: string
    actividadEconomicaPrincipal: string
    tipoContribuyente: string
    // ... otros campos del SRI
  }
}
```

### LimeSurvey Integration (Already implemented)
```typescript
interface LimeSurveyParticipant {
  firstname: string
  lastname: string
  email: string
  language: string
  token: string // UID del usuario de Supabase
}
```

## Error Handling

### Current Implementation (Keep as-is)
- **RUC Validation**: Manejo de errores de API del SRI
- **Registration**: Manejo de errores de Supabase Auth y creación de perfil
- **LimeSurvey**: Manejo de errores de API de LimeSurvey
- **User Experience**: Toast notifications con sonner

### Error Scenarios
1. **RUC inválido**: Mensaje específico, no permite continuar
2. **RUC inactivo**: Mensaje específico, no permite continuar
3. **Error de registro**: Rollback automático si falla creación de perfil
4. **Error LimeSurvey**: Mensaje de error, permite reintentar

## Testing Strategy

### Current Implementation Status
- **Components**: Todos los componentes principales están implementados
- **Edge Functions**: Tres edge functions ya implementadas y funcionando
- **Integration**: Flujo completo ya probado

### Testing Approach
1. **Verification Testing**: Verificar que el flujo actual funcione correctamente
2. **Cleanup Testing**: Asegurar que la limpieza no rompa funcionalidad
3. **Integration Testing**: Probar flujo completo de registro → perfil → encuesta

## Implementation Phases

### Phase 1: Verification and Testing
1. Probar flujo completo actual de registro
2. Verificar que la creación de perfil funcione correctamente
3. Probar integración con LimeSurvey
4. Documentar cualquier problema encontrado

### Phase 2: Minimal Modifications
1. Simplificar Header para mostrar solo icono de perfil
2. Simplificar Footer para información mínima
3. Limpiar código no relacionado en App.tsx
4. Verificar que RegistrationFlow no se use innecesariamente

### Phase 3: Cleanup and Optimization
1. Remover componentes no utilizados
2. Limpiar importaciones y dependencias
3. Optimizar flujo de navegación
4. Verificar consistencia visual

## Edge Functions (Already Implemented)

### validate-ruc
- **Location**: `supabase/functions/validate-ruc/`
- **Purpose**: Validar RUC con API del SRI
- **Input**: `{ ruc: string }`
- **Output**: `{ valid: boolean, contribuyente: SRIData }`
- **API**: `https://srienlinea.sri.gob.ec/sri-catastro-sujeto-servicio-internet/rest/ConsolidadoContribuyente/obtenerPorNumerosRuc`

### create-profile
- **Location**: `supabase/functions/create-profile/`
- **Purpose**: Crear perfil en tabla profiles con datos del SRI
- **Input**: Profile data including SRI information
- **Output**: Created profile data
- **Features**: Transactional, rollback on failure

### add-limesurvey-participant
- **Location**: `supabase/functions/add-limesurvey-participant/`
- **Purpose**: Agregar usuario como participante en LimeSurvey
- **Configuration**:
  - URL: `https://limesurvey.pruebasbidata.site/index.php/admin/remotecontrol`
  - Survey ID: `614997`
  - Token: UID del usuario de Supabase
- **Output**: Survey URL with participant token

## Design Decisions and Rationales

### Reuse Existing Code
**Decision**: Mantener toda la implementación actual que funciona
**Rationale**: El código existente ya implementa correctamente todos los requerimientos principales

### Minimal Changes Approach
**Decision**: Realizar solo modificaciones mínimas necesarias
**Rationale**: Reduce riesgo de introducir bugs, mantiene estabilidad, acelera implementación

### Keep Edge Functions
**Decision**: Mantener las tres Edge Functions existentes
**Rationale**: Ya implementan correctamente la lógica de negocio requerida

### Simplify UI Components
**Decision**: Simplificar Header y Footer para mostrar solo lo esencial
**Rationale**: Cumple con requerimiento de interfaz post-login simplificada

### Maintain Visual Consistency
**Decision**: Mantener paleta bidata-* y componentes UI existentes
**Rationale**: Preserva identidad visual, código ya probado y funcionando

## Configuration Requirements

### LimeSurvey Configuration (Already set)
- **URL**: `https://limesurvey.pruebasbidata.site/`
- **Admin User**: `admin`
- **Admin Password**: `jBK£@7L64Gev`
- **Survey ID**: `614997`
- **API Token**: `7QsQQVEZbtawz3zwmdvz9L1E_ubmR3LR`

### SRI API Configuration (Already set)
- **URL**: `https://srienlinea.sri.gob.ec/sri-catastro-sujeto-servicio-internet/rest/ConsolidadoContribuyente/obtenerPorNumerosRuc`
- **Method**: GET with RUC parameter
- **Response Format**: JSON array with contributor data

### Supabase Configuration (Already set)
- **Auth**: Email/password authentication
- **Profiles Table**: Complete schema with SRI data fields
- **Edge Functions**: Three functions deployed and configured
- **RLS Policies**: Configured for secure access