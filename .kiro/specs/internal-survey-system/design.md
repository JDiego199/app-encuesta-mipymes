# Design Document

## Overview

Este diseño describe la migración completa del sistema de encuestas de LimeSurvey a una implementación interna usando Supabase. El diseño mantiene toda la arquitectura existente de autenticación y perfiles, pero reemplaza completamente la integración con LimeSurvey por un sistema interno que gestiona encuestas, respuestas y resultados directamente en la base de datos de Supabase.

## Architecture

### Current State Analysis

El sistema actual tiene:

- ✅ Autenticación y perfiles funcionando con Supabase
- ✅ Validación RUC con SRI
- ✅ Dashboard con botones de estado de encuesta
- ✅ Gráficos de resultados
- ❌ Integración con LimeSurvey (a eliminar)
- ❌ Edge Functions de LimeSurvey (a eliminar)

### Target State

Nueva arquitectura interna:

1. **Tablas de Supabase**: Encuestas, respuestas, y estado de participantes
2. **Página de Encuesta Interna**: Reemplaza iframe de LimeSurvey
3. **Gestión de Estado**: Control completo en Supabase
4. **Resultados Integrados**: Gráficos conectados a datos internos
5. **Navegación Preservada**: Mismo flujo de usuario

### Database Schema Design

#### Tabla: surveys

```sql
CREATE TABLE surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabla: survey_questions

```sql
CREATE TABLE survey_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR NOT NULL CHECK (question_type IN ('text', 'textarea', 'radio', 'checkbox', 'select', 'scale', 'number', 'likert')),
  options JSONB, -- Para opciones de respuesta múltiple
  is_required BOOLEAN DEFAULT true,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabla: survey_participants

```sql
CREATE TABLE survey_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
  status VARCHAR NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  current_question_index INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, survey_id)
);
```

#### Tabla: survey_responses

```sql
CREATE TABLE survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID REFERENCES survey_participants(id) ON DELETE CASCADE,
  question_id UUID REFERENCES survey_questions(id) ON DELETE CASCADE,
  response_value TEXT NOT NULL,
  response_data JSONB, -- Para respuestas complejas (múltiples opciones, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(participant_id, question_id)
);
```

### Navigation Flow (Preserved)

```
Dashboard
├── Estado "not_started" → Botón "Iniciar Encuesta" → SurveyPage
├── Estado "in_progress" → Botón "Continuar Encuesta" → SurveyPage (desde pregunta actual)
└── Estado "completed" → Botón "Ver Resultados" → ResultsPage
```

## Components and Interfaces

### New Components to Create

#### SurveyPage (`src/pages/SurveyPage.tsx`)

- **Purpose**: Página principal de la encuesta interna
- **Features**:
  - Navegación pregunta por pregunta
  - Guardado automático de respuestas
  - Validación de preguntas obligatorias
  - Botones de navegación (Anterior/Siguiente/Finalizar)
  - Diseño consistente con paleta bidata-\*

```typescript
interface SurveyPageProps {
  surveyId: string;
  participantId: string;
}

interface SurveyState {
  questions: SurveyQuestion[];
  currentQuestionIndex: number;
  responses: Map<string, any>;
  isLoading: boolean;
  isSaving: boolean;
}
```

#### QuestionRenderer (`src/components/survey/QuestionRenderer.tsx`)

- **Purpose**: Renderiza diferentes tipos de preguntas
- **Supported Types**:
  - `text`: Input de texto simple
  - `textarea`: Área de texto
  - `radio`: Opciones de selección única
  - `checkbox`: Opciones de selección múltiple
  - `select`: Dropdown de selección
  - `scale`: Escala numérica (1-5, 1-10, etc.)
  - `number`: Input numérico
  - `likert`: Escala Likert con etiquetas (Totalmente en desacuerdo → Totalmente de acuerdo)

```typescript
interface QuestionRendererProps {
  question: SurveyQuestion;
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
}
```

#### SurveyNavigation (`src/components/survey/SurveyNavigation.tsx`)

- **Purpose**: Botones de navegación de la encuesta
- **Features**:
  - Botón "Anterior" (deshabilitado en primera pregunta)
  - Botón "Siguiente" (deshabilitado si pregunta obligatoria sin responder)
  - Botón "Finalizar" (en última pregunta)
  - Indicador de progreso

```typescript
interface SurveyNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLastQuestion: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
  isSaving: boolean;
}
```

### Modified Components

#### Dashboard (`src/pages/Dashboard.tsx`)

- **Changes**: Reemplazar lógica de LimeSurvey con lógica interna
- **New Logic**:
  - Consultar estado del participante en `survey_participants`
  - Mostrar botón apropiado según estado
  - Navegar a `SurveyPage` en lugar de mostrar iframe

#### ResultsPage (existing)

- **Changes**: Conectar a datos de Supabase en lugar de LimeSurvey
- **New Data Source**: Consultar `survey_responses` para generar gráficos

### Services and Hooks

#### useSurvey (`src/hooks/useSurvey.ts`)

- **Purpose**: Hook para gestionar estado de encuesta
- **Features**:
  - Cargar preguntas de la encuesta
  - Gestionar respuestas y navegación
  - Guardado automático
  - Manejo de estados de carga

```typescript
interface UseSurveyReturn {
  questions: SurveyQuestion[];
  currentQuestion: SurveyQuestion | null;
  currentIndex: number;
  responses: Map<string, any>;
  isLoading: boolean;
  isSaving: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLastQuestion: boolean;
  goToNext: () => Promise<void>;
  goToPrevious: () => void;
  updateResponse: (value: any) => Promise<void>;
  finishSurvey: () => Promise<void>;
}
```

#### surveyService (`src/services/surveyService.ts`)

- **Purpose**: Servicio para operaciones de encuesta
- **Methods**:
  - `getSurveyQuestions(surveyId: string)`
  - `getParticipantStatus(userId: string, surveyId: string)`
  - `createParticipant(userId: string, surveyId: string)`
  - `saveResponse(participantId: string, questionId: string, value: any)`
  - `updateParticipantStatus(participantId: string, status: string)`
  - `getSurveyResults(surveyId: string)`

## Data Models

### SurveyQuestion Interface

```typescript
interface SurveyQuestion {
  id: string;
  survey_id: string;
  question_text: string;
  question_type:
    | "text"
    | "textarea"
    | "radio"
    | "checkbox"
    | "select"
    | "scale"
    | "number"
    | "likert";
  options?: string[]; // Para preguntas de opción múltiple
  likert_config?: {
    scale_points: number; // Número de puntos (ej: 5 para 1-5)
    left_label: string; // Etiqueta izquierda (ej: "Totalmente en desacuerdo")
    right_label: string; // Etiqueta derecha (ej: "Totalmente de acuerdo")
    middle_label?: string; // Etiqueta central opcional (ej: "Neutral")
  };
  is_required: boolean;
  order_index: number;
}
```

### SurveyParticipant Interface

```typescript
interface SurveyParticipant {
  id: string;
  user_id: string;
  survey_id: string;
  status: "not_started" | "in_progress" | "completed";
  current_question_index: number;
  started_at?: string;
  completed_at?: string;
}
```

### SurveyResponse Interface

```typescript
interface SurveyResponse {
  id: string;
  participant_id: string;
  question_id: string;
  response_value: string;
  response_data?: any; // Para respuestas complejas
}
```

## Error Handling

### Survey Loading Errors

- **Scenario**: Error al cargar preguntas de la encuesta
- **Handling**: Mostrar mensaje de error, botón de reintentar
- **Fallback**: Redirigir al Dashboard si persiste el error

### Auto-save Errors

- **Scenario**: Error al guardar respuesta automáticamente
- **Handling**: Mostrar notificación de error, reintentar automáticamente
- **Fallback**: Permitir guardado manual, no bloquear navegación

### Navigation Errors

- **Scenario**: Error al cambiar de pregunta
- **Handling**: Mantener en pregunta actual, mostrar error
- **Fallback**: Permitir navegación manual después de resolver

### Completion Errors

- **Scenario**: Error al finalizar encuesta
- **Handling**: Mostrar error específico, permitir reintentar
- **Fallback**: Marcar como completada localmente, sincronizar después

## Testing Strategy

### Unit Testing

1. **QuestionRenderer**: Probar renderizado de todos los tipos de pregunta
2. **SurveyNavigation**: Probar lógica de habilitación/deshabilitación de botones
3. **useSurvey Hook**: Probar navegación, guardado, y estados
4. **surveyService**: Probar todas las operaciones CRUD

### Integration Testing

1. **Survey Flow**: Probar flujo completo de encuesta
2. **Auto-save**: Probar guardado automático en diferentes escenarios
3. **State Management**: Probar transiciones de estado del participante
4. **Results Integration**: Probar conexión con gráficos de resultados

### End-to-End Testing

1. **Complete Survey**: Usuario completa encuesta completa
2. **Resume Survey**: Usuario reanuda encuesta en progreso
3. **Results View**: Usuario ve resultados después de completar
4. **Error Recovery**: Manejo de errores de red y recuperación

## Migration Strategy

### Phase 1: Database Setup

1. Crear nuevas tablas en Supabase
2. Configurar RLS policies para seguridad
3. Poblar tabla de encuestas con datos del Excel
4. Crear índices para optimización

### Phase 2: Core Components

1. Implementar `SurveyPage` con navegación básica
2. Crear `QuestionRenderer` para todos los tipos
3. Implementar `useSurvey` hook con funcionalidad completa
4. Crear `surveyService` con todas las operaciones

### Phase 3: Integration

1. Modificar `Dashboard` para usar nueva lógica
2. Conectar `ResultsPage` con datos de Supabase
3. Implementar guardado automático
4. Probar flujo completo

### Phase 4: Cleanup

1. Remover Edge Functions de LimeSurvey
2. Eliminar código relacionado con LimeSurvey
3. Limpiar dependencias no utilizadas
4. Optimizar rendimiento

## Design Decisions and Rationales

### Single Question Display

**Decision**: Mostrar una pregunta a la vez
**Rationale**: Mejora la experiencia de usuario, reduce cognitive load, facilita validación

### Automatic Save

**Decision**: Guardar respuestas automáticamente al cambiar
**Rationale**: Previene pérdida de datos, mejora UX, permite reanudar fácilmente

### Flexible Question Types

**Decision**: Soportar múltiples tipos de pregunta con JSONB para opciones
**Rationale**: Flexibilidad para diferentes tipos de encuesta, extensibilidad futura

### Likert Scale Implementation

**Decision**: Implementar tipo Likert como tipo separado con configuración específica
**Rationale**: Las escalas Likert requieren etiquetas específicas y presentación visual diferente a escalas numéricas simples

**Likert Configuration Example**:

```json
{
  "scale_points": 5,
  "left_label": "Totalmente en desacuerdo",
  "right_label": "Totalmente de acuerdo",
  "middle_label": "Neutral"
}
```

**Visual Representation**: Radio buttons horizontales con etiquetas en los extremos y números/círculos en el centro

### Preserve UI Components

**Decision**: Mantener todos los componentes de UI existentes
**Rationale**: Consistencia visual, reduce tiempo de desarrollo, familiar para usuarios

### Supabase-Only Architecture

**Decision**: Eliminar completamente dependencias externas
**Rationale**: Simplifica arquitectura, reduce puntos de falla, mejor control

## Performance Considerations

### Database Optimization

- Índices en `survey_questions.order_index` para ordenamiento rápido
- Índices en `survey_participants.user_id` y `survey_id` para consultas frecuentes
- Índices en `survey_responses.participant_id` para agregaciones

### Frontend Optimization

- Lazy loading de preguntas si la encuesta es muy larga
- Debounce en auto-save para reducir llamadas a la API
- Caching de respuestas en memoria para navegación rápida
- Optimistic updates para mejor UX

### Real-time Considerations

- No se requiere real-time para respuestas individuales
- Considerar real-time para resultados agregados si es necesario
- Batch updates para múltiples respuestas si es aplicable

## Security Considerations

### Row Level Security (RLS)

```sql
-- survey_participants: usuarios solo pueden ver sus propios registros
CREATE POLICY "Users can view own participation" ON survey_participants
  FOR SELECT USING (auth.uid() = user_id);

-- survey_responses: usuarios solo pueden ver/modificar sus propias respuestas
CREATE POLICY "Users can manage own responses" ON survey_responses
  FOR ALL USING (
    participant_id IN (
      SELECT id FROM survey_participants WHERE user_id = auth.uid()
    )
  );
```

### Data Validation

- Validación de tipos de pregunta en el frontend y backend
- Sanitización de respuestas de texto para prevenir XSS
- Validación de que las respuestas correspondan al tipo de pregunta
- Verificación de que el usuario tenga permisos para la encuesta

### API Security

- Todas las operaciones requieren autenticación
- Validación de que el usuario sea participante válido
- Rate limiting en operaciones de guardado
- Logs de auditoría para cambios importantes
