# SurveyNavigation Component

## Overview

The `SurveyNavigation` component provides navigation controls for survey forms, including progress tracking, previous/next buttons, and completion functionality.

## Features

- **Progress Indicator**: Visual progress bar showing completion percentage
- **Previous Button**: Navigate to previous question (disabled on first question)
- **Next Button**: Navigate to next question (disabled if required question not answered)
- **Finish Button**: Complete survey (appears on last question)
- **Saving Indicator**: Shows when responses are being saved
- **Validation Messages**: Displays helpful messages for required fields

## Props

```typescript
interface SurveyNavigationProps {
  currentIndex: number        // Current question index (0-based)
  totalQuestions: number      // Total number of questions
  canGoNext: boolean         // Whether next/finish button should be enabled
  canGoPrevious: boolean     // Whether previous button should be enabled
  isLastQuestion: boolean    // Whether this is the last question
  onPrevious: () => void     // Handler for previous button click
  onNext: () => void         // Handler for next button click
  onFinish: () => void       // Handler for finish button click
  isSaving?: boolean         // Whether responses are currently being saved
}
```

## Usage

```tsx
import { SurveyNavigation } from '@/components/survey/SurveyNavigation'

function SurveyPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  
  const handleNext = async () => {
    setIsSaving(true)
    // Save current response
    await saveResponse()
    setIsSaving(false)
    setCurrentIndex(prev => prev + 1)
  }

  return (
    <div>
      {/* Question content */}
      
      <SurveyNavigation
        currentIndex={currentIndex}
        totalQuestions={10}
        canGoNext={isCurrentQuestionValid}
        canGoPrevious={currentIndex > 0}
        isLastQuestion={currentIndex === 9}
        onPrevious={() => setCurrentIndex(prev => prev - 1)}
        onNext={handleNext}
        onFinish={handleSurveyCompletion}
        isSaving={isSaving}
      />
    </div>
  )
}
```

## Styling

The component uses the bidata color palette:
- Primary color: `bidata-cyan` (#00BCD4)
- Text colors: `bidata-dark` (#333333), `bidata-gray` (#666666)
- Consistent with existing design system

## Accessibility

- Proper button states (enabled/disabled)
- Clear visual feedback for user actions
- Screen reader friendly labels and structure
- Keyboard navigation support

## Requirements Satisfied

This component satisfies the following requirements from the spec:

- **3.4**: Navigation buttons (Anterior/Siguiente) in the bottom part
- **5.1**: Previous button disabled on first question
- **5.2**: Next button changes to "Finalizar" on last question
- **5.3**: Navigation to previous question maintaining responses
- **5.4**: Next button validation for required questions
- **5.5**: Complete survey and update status when clicking "Finalizar"