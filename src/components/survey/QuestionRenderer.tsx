import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { SurveyQuestion, QuestionRendererProps, LikertConfig } from '@/types/survey'

// Textarea component (since it doesn't exist in ui components)
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export function QuestionRenderer({ question, value, onChange, disabled = false }: QuestionRendererProps) {
  const renderQuestionInput = () => {
    switch (question.question_type) {
      case 'text':
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="Ingrese su respuesta..."
            className="py-3"
          />
        )

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="Ingrese su respuesta detallada..."
            className="min-h-[120px]"
          />
        )

      case 'radio':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="radio"
                  id={`${question.id}-${index}`}
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => onChange(e.target.value)}
                  disabled={disabled}
                  className="h-4 w-4 text-bidata-cyan focus:ring-bidata-cyan border-gray-300"
                />
                <Label 
                  htmlFor={`${question.id}-${index}`}
                  className="text-bidata-dark cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )

      case 'checkbox':
        const selectedValues = Array.isArray(value) ? value : []
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={`${question.id}-${index}`}
                  value={option}
                  checked={selectedValues.includes(option)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...selectedValues, option]
                      : selectedValues.filter(v => v !== option)
                    onChange(newValues)
                  }}
                  disabled={disabled}
                  className="h-4 w-4 text-bidata-cyan focus:ring-bidata-cyan border-gray-300 rounded"
                />
                <Label 
                  htmlFor={`${question.id}-${index}`}
                  className="text-bidata-dark cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )

      case 'select':
        return (
          <Select value={value || ''} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger className="py-3">
              <SelectValue placeholder="Seleccione una opción..." />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="Ingrese un número..."
            className="py-3"
          />
        )

      case 'scale':
        const scalePoints = question.options?.length || 5
        const scaleValues = Array.from({ length: scalePoints }, (_, i) => i + 1)
        
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-bidata-gray">1</span>
              <span className="text-sm text-bidata-gray">{scalePoints}</span>
            </div>
            <div className="flex justify-between items-center space-x-2">
              {scaleValues.map((scaleValue) => (
                <div key={scaleValue} className="flex flex-col items-center">
                  <input
                    type="radio"
                    id={`${question.id}-scale-${scaleValue}`}
                    name={question.id}
                    value={scaleValue}
                    checked={value === scaleValue.toString()}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className="h-4 w-4 text-bidata-cyan focus:ring-bidata-cyan border-gray-300"
                  />
                  <Label 
                    htmlFor={`${question.id}-scale-${scaleValue}`}
                    className="text-sm text-bidata-dark mt-1 cursor-pointer"
                  >
                    {scaleValue}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )

      case 'likert':
        const likertConfig = question.likert_config || {
          scale_points: 5,
          left_label: 'Totalmente en desacuerdo',
          right_label: 'Totalmente de acuerdo'
        }
        
        // Definir las etiquetas de texto para la escala Likert 1-5
        const likertLabels = [
          'Muy bajo / Nunca / Totalmente en desacuerdo',
          'Bajo / Raramente / En desacuerdo', 
          'Medio / A veces / Neutral',
          'Alto / Frecuentemente / De acuerdo',
          'Muy alto / Siempre / Totalmente de acuerdo'
        ]
        
        return (
          <div className="space-y-4">
            {/* Labels */}
            <div className="flex justify-between items-center text-sm text-bidata-gray">
              <span>{likertConfig.left_label}</span>
              <span>{likertConfig.right_label}</span>
            </div>
            
            {/* Scale */}
            <div className="space-y-3">
              {likertLabels.map((label, index) => {
                const value = index + 1
                return (
                  <div key={value} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id={`${question.id}-likert-${value}`}
                      name={question.id}
                      value={value}
                      checked={value === parseInt(value)}
                      onChange={(e) => onChange(e.target.value)}
                      disabled={disabled}
                      className="h-4 w-4 text-bidata-cyan focus:ring-bidata-cyan border-gray-300"
                    />
                    <Label 
                      htmlFor={`${question.id}-likert-${value}`}
                      className="text-sm text-bidata-dark cursor-pointer flex-1"
                    >
                      <span className="font-medium mr-2">{value}.</span>
                      {label}
                    </Label>
                  </div>
                )
              })}
            </div>
          </div>
        )

      default:
        return (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">
              Tipo de pregunta no soportado: {question.question_type}
            </p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-4">
      {/* Dimension and Subdimension */}
      {(question.dimension || question.subdimension) && (
        <div className="space-y-1 mb-4">
          {question.dimension && (
            <div className="text-sm font-medium text-bidata-cyan bg-bidata-cyan/10 px-3 py-1 rounded-full inline-block">
              {question.dimension}
            </div>
          )}
          {question.subdimension && (
            <div className="text-xs text-bidata-gray bg-gray-100 px-3 py-1 rounded-full inline-block ml-2">
              {question.subdimension}
            </div>
          )}
        </div>
      )}

      {/* Question Text */}
      <div className="space-y-2">
        <Label className="text-lg font-semibold text-bidata-dark leading-relaxed">
          {question.question_text}
          {question.is_required && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </Label>
      </div>

      {/* Question Input */}
      <div className="mt-4">
        {renderQuestionInput()}
      </div>

      {/* Required indicator */}
      {question.is_required && (
        <p className="text-sm text-bidata-gray">
          * Esta pregunta es obligatoria
        </p>
      )}
    </div>
  )
}

export type { SurveyQuestion, QuestionRendererProps, LikertConfig } from '@/types/survey'