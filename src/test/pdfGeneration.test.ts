import { describe, it, expect, vi } from 'vitest'
import { PDFGenerationService } from '@/lib/pdfGenerationService'
import { MetricsData, UserProfile } from '@/types/results'

// Mock jsPDF
vi.mock('jspdf', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      setProperties: vi.fn(),
      setFontSize: vi.fn(),
      setFont: vi.fn(),
      text: vi.fn(),
      setLineWidth: vi.fn(),
      line: vi.fn(),
      addPage: vi.fn(),
      getNumberOfPages: vi.fn().mockReturnValue(1),
      setPage: vi.fn(),
      splitTextToSize: vi.fn().mockReturnValue(['test line']),
      output: vi.fn().mockReturnValue(new Blob(['test'], { type: 'application/pdf' }))
    }))
  }
})

// Mock html2canvas
vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: vi.fn().mockReturnValue('data:image/png;base64,test'),
    width: 800,
    height: 600
  })
}))

describe('PDFGenerationService', () => {
  const mockUserData: UserProfile = {
    id: 'test-user-id',
    nombre_persona: 'Juan Pérez',
    razon_social: 'Empresa Test S.A.',
    ruc: '1234567890001',
    ciudad: 'Cuenca'
  }

  const mockMetricsData: MetricsData = {
    categories: ['Categoría 1', 'Categoría 2'],
    metrics: [
      {
        id: 'metric1',
        name: 'Métrica 1',
        description: 'Descripción de la métrica 1',
        userValue: 85,
        averageValue: 75,
        maxValue: 100,
        unit: '%',
        category: 'Categoría 1'
      },
      {
        id: 'metric2',
        name: 'Métrica 2',
        description: 'Descripción de la métrica 2',
        userValue: 70,
        averageValue: 80,
        maxValue: 100,
        unit: 'pts',
        category: 'Categoría 2'
      }
    ],
    overallScore: {
      user: 155,
      average: 155,
      maxScore: 200
    },
    percentile: 75,
    strongAreas: ['Área Fuerte 1', 'Área Fuerte 2'],
    improvementAreas: ['Área de Mejora 1']
  }

  const mockCompletedDate = '2025-08-30T20:52:00Z'

  it('should generate PDF blob successfully', async () => {
    const result = await PDFGenerationService.generateResultsPDF(
      mockUserData,
      mockMetricsData,
      mockCompletedDate
    )

    expect(result).toBeInstanceOf(Blob)
    expect(result.type).toBe('application/pdf')
  })

  it('should generate descriptive filename', () => {
    const filename = PDFGenerationService.generateFilename(mockUserData, mockCompletedDate)
    
    expect(filename).toContain('Diagnostico_MIPYMES')
    expect(filename).toContain('Juan_Pérez')
    expect(filename).toContain('2025-08-30')
    expect(filename).toEndWith('.pdf')
  })

  it('should handle missing user data gracefully', () => {
    const filename = PDFGenerationService.generateFilename({
      id: 'test-id'
    })
    
    expect(filename).toContain('Diagnostico_MIPYMES')
    expect(filename).toContain('Usuario')
    expect(filename).toEndWith('.pdf')
  })

  it('should generate PDF with custom options', async () => {
    const options = {
      includeCharts: false,
      includeMetrics: true,
      includeUserInfo: true,
      format: 'letter' as const,
      orientation: 'landscape' as const
    }

    const result = await PDFGenerationService.generateResultsPDF(
      mockUserData,
      mockMetricsData,
      mockCompletedDate,
      options
    )

    expect(result).toBeInstanceOf(Blob)
  })

  it('should handle HTML element to PDF conversion', async () => {
    const mockElement = document.createElement('div')
    mockElement.innerHTML = '<h1>Test Content</h1>'

    const result = await PDFGenerationService.generatePDFFromElement(
      mockElement,
      'test.pdf'
    )

    expect(result).toBeInstanceOf(Blob)
  })
})