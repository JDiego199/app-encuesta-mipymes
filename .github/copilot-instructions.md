# Copilot Instructions for app-encuesta-mipymes

## Project Overview
This is a React + TypeScript application for conducting and analyzing MIPYMES (Micro, Small and Medium Enterprises) business ecosystem surveys. The project uses Vite for bundling, Supabase for backend services, and integrates with LimeSurvey for survey management.

## Core Architecture

### Data Flow
1. User authentication → Supabase Auth
2. Survey flow: 
   - Validation through LimeSurvey API (Edge Functions)
   - Survey responses stored in Supabase
   - Results processing via ArtificialResultsService
3. Data visualization using Recharts

### Key Components
- `src/services/surveyService.ts` - Core survey operations and data types
- `src/lib/artificialResultsService.ts` - Generates consistent survey results
- `src/lib/resultsTransformer.ts` - Transforms data for visualization
- `src/hooks/useLimeSurveyValidation.ts` - LimeSurvey integration
- `src/components/survey/` - Survey UI components

## Development Patterns

### State Management
- Authentication state via `AuthContext.tsx`
- Survey state managed through custom hooks:
  ```typescript
  const { profile } = useAuth()
  const { participantStatus } = useLimeSurveyValidation()
  const { results } = useArtificialResults(profile, participantStatus.completedDate)
  ```

### Type Safety
- Use TypeScript interfaces for DB tables (see `QuestionRow`, `SurveyParticipantRow`)
- Extend base types for service-specific needs:
  ```typescript
  export interface SurveyQuestion extends QuestionRow {
    options?: any
  }
  ```

### Error Handling
- Consistent pattern in service functions:
  ```typescript
  try {
    const { data, error } = await supabase...
    if (error) {
      console.error('Error message:', error)
      throw new Error(`Failed action: ${error.message}`)
    }
  } catch (error) {
    console.error('Error in functionName:', error)
    throw error
  }
  ```

### Data Transformation
- Raw survey responses are processed through `ResultsTransformer`
- Use `ArtificialResultsService` for generating consistent test data

## Common Tasks

### Adding New Survey Questions
1. Update SQL schema in `sql/create_internal_survey_tables.sql`
2. Add question type definitions in `src/types/survey.ts`
3. Update survey service functions in `surveyService.ts`

### Testing
- Unit tests in `src/test/`
- Run tests: `npm test` or `pnpm test`
- Use `vitest` configuration for test setup

### Building & Development
- Development: `npm run dev` or `pnpm dev`
- Production build: `npm run build` or `pnpm build`
- Test environment: `npm run dev:test` or `pnpm dev:test`

## Key Dependencies
- Supabase Client & Edge Functions
- React Query for data fetching
- Recharts for visualization
- Tailwind CSS with custom theme
- Radix UI for base components