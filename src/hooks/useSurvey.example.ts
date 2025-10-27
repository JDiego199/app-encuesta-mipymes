// Example usage of the useSurvey hook
// This file demonstrates how to use the hook in a React component

import { useSurvey } from './useSurvey'

// Example component that would use the hook
export function ExampleSurveyComponent() {
  const {
    // Data
    questions,
    currentQuestion,
    currentIndex,
    responses,
    participant,
    
    // States
    isLoading,
    isSaving,
    error,
    
    // Navigation helpers
    canGoNext,
    canGoPrevious,
    isLastQuestion,
    progressPercentage,
    
    // Actions
    goToNext,
    goToPrevious,
    updateResponse,
    finishSurvey,
    goToQuestion,
    retryLoad
  } = useSurvey({ 
    surveyId: 1,
    autoSave: true,
    autoSaveDelay: 1000
  })

  // Example usage patterns:
  
  // 1. Handle loading state
  if (isLoading) {
    return <div>Loading survey...</div>
  }

  // 2. Handle error state
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={retryLoad}>Retry</button>
      </div>
    )
  }

  // 3. Handle no questions
  if (questions.length === 0) {
    return <div>No questions available</div>
  }

  // 4. Render current question
  const handleAnswerChange = async (value: any) => {
    await updateResponse(value)
  }

  const handleNext = async () => {
    if (isLastQuestion) {
      await finishSurvey()
    } else {
      await goToNext()
    }
  }

  return (
    <div className="survey-container">
      {/* Progress indicator */}
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progressPercentage}%` }}
        />
        <span>{progressPercentage}% Complete</span>
      </div>

      {/* Question display */}
      {currentQuestion && (
        <div className="question-container">
          <h2>Question {currentIndex + 1} of {questions.length}</h2>
          <p>{currentQuestion.question_text}</p>
          
          {/* Question input based on type */}
          {currentQuestion.question_type === 'text' && (
            <input
              type="text"
              value={responses.get(currentQuestion.id) || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Enter your answer..."
            />
          )}
          
          {currentQuestion.question_type === 'scale' && (
            <input
              type="range"
              min="1"
              max="10"
              value={responses.get(currentQuestion.id) || 5}
              onChange={(e) => handleAnswerChange(parseInt(e.target.value))}
            />
          )}
          
          {currentQuestion.question_type === 'multiple_choice' && (
            <div>
              {currentQuestion.options?.map((option: string, index: number) => (
                <label key={index}>
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option}
                    checked={responses.get(currentQuestion.id) === option}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="navigation-buttons">
        <button 
          onClick={goToPrevious}
          disabled={!canGoPrevious}
        >
          Previous
        </button>
        
        <button 
          onClick={handleNext}
          disabled={!canGoNext}
        >
          {isLastQuestion ? 'Finish' : 'Next'}
        </button>
      </div>

      {/* Saving indicator */}
      {isSaving && (
        <div className="saving-indicator">
          Saving...
        </div>
      )}

      {/* Survey info */}
      <div className="survey-info">
        <p>Survey Status: {participant?.status}</p>
        <p>Current Question: {currentIndex + 1}/{questions.length}</p>
        <p>Responses: {responses.size}/{questions.length}</p>
      </div>
    </div>
  )
}

// Example of hook usage patterns:

// 1. Basic usage with default options
const basicHook = useSurvey({ surveyId: 1 })

// 2. Usage with custom auto-save settings
const customAutoSave = useSurvey({ 
  surveyId: 1, 
  autoSave: true, 
  autoSaveDelay: 2000 
})

// 3. Usage without auto-save
const manualSave = useSurvey({ 
  surveyId: 1, 
  autoSave: false 
})

// 4. Programmatic navigation
const programmaticNavigation = () => {
  const { goToQuestion, questions } = useSurvey({ surveyId: 1 })
  
  // Jump to specific question
  const jumpToQuestion = (questionIndex: number) => {
    if (questionIndex >= 0 && questionIndex < questions.length) {
      goToQuestion(questionIndex)
    }
  }
  
  return { jumpToQuestion }
}

// 5. Response validation
const responseValidation = () => {
  const { currentQuestion, responses, canGoNext } = useSurvey({ surveyId: 1 })
  
  const isCurrentResponseValid = () => {
    if (!currentQuestion) return false
    
    const response = responses.get(currentQuestion.id)
    
    // Required question must have response
    if (currentQuestion.is_required && !response) {
      return false
    }
    
    // Type-specific validation
    switch (currentQuestion.question_type) {
      case 'text':
        return !currentQuestion.is_required || (response && response.trim().length > 0)
      case 'scale':
        return !currentQuestion.is_required || (typeof response === 'number')
      case 'multiple_choice':
        return !currentQuestion.is_required || response
      default:
        return true
    }
  }
  
  return { isCurrentResponseValid, canGoNext }
}

export {
  basicHook,
  customAutoSave,
  manualSave,
  programmaticNavigation,
  responseValidation
}