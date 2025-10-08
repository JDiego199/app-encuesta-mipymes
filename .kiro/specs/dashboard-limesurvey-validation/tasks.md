# Implementation Plan

- [x] 1. Create Edge Function for LimeSurvey participant validation

  - Create new Edge Function `check-limesurvey-participant` that calls LimeSurvey API with `list_participants` method
  - Implement session key management and proper error handling
  - Return processed participant status (not_found, pending, completed) with relevant data
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 2. Implement custom hook for LimeSurvey validation

  - Create `useLimeSurveyValidation` hook that calls the new Edge Function
  - Handle loading states, error management, and automatic retries
  - Process Edge Function response into typed participant status object
  - _Requirements: 1.1, 8.3, 8.4_

- [x] 3. Create survey status display components

- [x] 3.1 Implement SurveyStatusCard component

  - Create component that displays different states based on participant status
  - Show appropriate messages for not_found, pending, and completed states
  - Include completion date formatting and uses left information
  - _Requirements: 2.2, 2.3, 3.2, 3.3, 4.2, 4.3_

- [x] 3.2 Implement SurveyActionButton component

  - Create dynamic button component that changes text and action based on status
  - Handle "Iniciar Diagnóstico", "Continuar Encuesta", and "Ver Resultados" states
  - Implement loading states and disabled states during processing
  - _Requirements: 2.4, 3.4, 4.4_

- [x] 4. Update Dashboard component with new validation logic

  - Replace existing participant check with new `useLimeSurveyValidation` hook
  - Integrate new `SurveyStatusCard` component into existing dashboard layout
  - Handle automatic participant registration when status is not_found
  - Maintain existing dashboard functionality and styling
  - _Requirements: 1.1, 2.1, 2.2, 8.1, 8.2, 8.5_

- [x] 5. Create results dashboard route and page structure

  - Create new route `/dashboard/resultados` in React Router configuration
  - Implement `ResultsDashboard` page component with proper layout structure
  - Add navigation guard to ensure only users with completed surveys can access
  - Create responsive layout with header, metrics grid, and charts sections
  - _Requirements: 5.1, 5.2_

- [x] 6. Implement artificial results data generation

  - Create service to generate realistic artificial survey results data
  - Include 8 different dimensions with individual and average scores
  - Generate user-specific data that varies but remains consistent per user
  - Create data structure with individual metrics, comparisons, and overall scores
  - _Requirements: 5.3, 5.4, 5.5_

- [x] 7. Build results visualization components

- [x] 7.1 Create MetricCard component for individual metrics display

  - Display individual metric with user score vs average comparison
  - Include visual indicators (above/below average) and progress bars
  - Show metric descriptions and category information
  - _Requirements: 5.3, 5.4, 5.5_

- [x] 7.2 Implement ComparisonChart component for visual data representation

  - Create charts using a charting library (Chart.js or Recharts) for visual comparisons
  - Include bar charts, radar charts, or line charts for different metric types
  - Ensure responsive design and proper color coding for user vs average data
  - _Requirements: 5.4, 5.5_

- [x] 7.3 Create ResultsMetrics component to organize and display all metrics

  - Organize metrics by categories and display in grid layout
  - Include overall score summary and percentile information
  - Show strong areas and improvement areas based on comparisons
  - _Requirements: 5.3, 5.4, 5.5_

- [x] 8. Implement PDF generation functionality

  - Create PDF generation service using a library like jsPDF or react-pdf
  - Generate PDF with user information, completion date, and all metrics
  - Include charts and visual elements in PDF format
  - Implement proper PDF styling and layout for professional appearance
  - _Requirements: 6.1, 6.2, 6.3, 6.5_

- [x] 9. Add PDF download functionality to results dashboard


  - Create PDFDownload component with download button
  - Generate descriptive filename with user name and date
  - Handle PDF generation loading states and error scenarios
  - Ensure PDF content matches dashboard display data
  - _Requirements: 6.1, 6.2, 6.4, 6.5_

- [ ] 10. Implement error handling and loading states

  - Add comprehensive error handling throughout all components
  - Implement proper loading states for async operations
  - Create error boundary components for graceful error recovery
  - Add retry mechanisms for failed API calls
  - _Requirements: 1.4, 8.4_

- [ ] 11. Add TypeScript interfaces and type definitions

  - Create comprehensive TypeScript interfaces for all data structures
  - Define types for LimeSurvey API responses and participant status
  - Add types for artificial results data and PDF generation parameters
  - Ensure type safety throughout all new components and services
  - _Requirements: All requirements - ensures type safety_

- [ ] 12. Write unit tests for new components and services

  - Create unit tests for `useLimeSurveyValidation` hook with different scenarios
  - Test `SurveyStatusCard` and `SurveyActionButton` components with all states
  - Write tests for artificial data generation and PDF generation services
  - Test error handling and edge cases in all components
  - _Requirements: All requirements - ensures reliability_

- [ ] 13. Integration testing for complete user flows
  - Test complete flow from dashboard load to results viewing
  - Test participant registration flow when user is not found
  - Test navigation between dashboard and results pages
  - Verify PDF download functionality works end-to-end
  - _Requirements: All requirements - ensures complete functionality_
