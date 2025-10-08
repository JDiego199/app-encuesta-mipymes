import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { PDFDownload } from '../PDFDownload'
import { PDFGenerationService } from '@/lib/pdfGenerationService'
import { MetricsData, UserProfile } from '@/types/results'
import { toast } from 'sonner'

// Mock dependencies
vi.mock('@/lib/pdfGenerationService')
vi.mock('sonner')

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = vi.fn()
const mockRevokeObjectURL = vi.fn()
Object.defineProperty(window, 'URL', {
  value: {
    createObjectURL: mockCreateObjectURL,
    revokeObjectURL: mockRevokeObjectURL,
  },
})

// Mock document.createElement and appendChild/removeChild
const mockLink = {
  href: '',
  download: '',
  click: vi.fn(),
}
const mockAppendChild = vi.fn()
const mockRemoveChild = vi.fn()
Object.defineProperty(document, 'createElement', {
  value: vi.fn(() => mockLink),
})
Object.defineProperty(document.body, 'appendChild', {
  value: mockAppendChild,
})
Object.defineProperty(document.body, 'removeChild', {
  value: mockRemoveChild,
})

describe('PDFDownload Component', () => {
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
    strongAreas: ['Área fuerte 1', 'Área fuerte 2'],
    improvementAreas: ['Área de mejora 1']
  }

  const mockCompletedDate = '2025-08-30T20:52:00Z'

  beforeEach(() => {
    vi.clearAllMocks()
    mockCreateObjectURL.mockReturnValue('mock-blob-url')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Button Variant', () => {
    it('renders download button correctly', () => {
      render(
        <PDFDownload
          userData={mockUserData}
          metricsData={mockMetricsData}
          completedDate={mockCompletedDate}
          variant="button"
        />
      )

      expect(screen.getByRole('button', { name: /descargar reporte pdf/i })).toBeInTheDocument()
      expect(screen.getByText('Descargar Reporte PDF')).toBeInTheDocument()
    })

    it('shows loading state during PDF generation', async () => {
      const mockGeneratePDF = vi.mocked(PDFGenerationService.generateResultsPDF)
      mockGeneratePDF.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

      render(
        <PDFDownload
          userData={mockUserData}
          metricsData={mockMetricsData}
          completedDate={mockCompletedDate}
          variant="button"
        />
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(screen.getByText('Generando PDF...')).toBeInTheDocument()
      expect(button).toBeDisabled()
    })

    it('handles successful PDF generation and download', async () => {
      const mockBlob = new Blob(['mock pdf content'], { type: 'application/pdf' })
      const mockGeneratePDF = vi.mocked(PDFGenerationService.generateResultsPDF)
      const mockGenerateFilename = vi.mocked(PDFGenerationService.generateFilename)
      
      mockGeneratePDF.mockResolvedValue(mockBlob)
      mockGenerateFilename.mockReturnValue('Diagnostico_MIPYMES_Juan_Perez_2025-08-30.pdf')

      render(
        <PDFDownload
          userData={mockUserData}
          metricsData={mockMetricsData}
          completedDate={mockCompletedDate}
          variant="button"
        />
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockGeneratePDF).toHaveBeenCalledWith(
          mockUserData,
          mockMetricsData,
          mockCompletedDate,
          {}
        )
      })

      expect(mockGenerateFilename).toHaveBeenCalledWith(mockUserData, mockCompletedDate)
      expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob)
      expect(mockLink.href).toBe('mock-blob-url')
      expect(mockLink.download).toBe('Diagnostico_MIPYMES_Juan_Perez_2025-08-30.pdf')
      expect(mockLink.click).toHaveBeenCalled()
      expect(mockAppendChild).toHaveBeenCalledWith(mockLink)
      expect(mockRemoveChild).toHaveBeenCalledWith(mockLink)
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('mock-blob-url')
      expect(toast.success).toHaveBeenCalledWith('Reporte PDF descargado exitosamente')
    })

    it('handles PDF generation errors', async () => {
      const mockError = new Error('PDF generation failed')
      const mockGeneratePDF = vi.mocked(PDFGenerationService.generateResultsPDF)
      mockGeneratePDF.mockRejectedValue(mockError)

      render(
        <PDFDownload
          userData={mockUserData}
          metricsData={mockMetricsData}
          completedDate={mockCompletedDate}
          variant="button"
        />
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText('PDF generation failed')).toBeInTheDocument()
      })

      expect(toast.error).toHaveBeenCalledWith('Error al generar el reporte PDF')
    })

    it('prevents download when userData is missing', () => {
      render(
        <PDFDownload
          userData={null as any}
          metricsData={mockMetricsData}
          completedDate={mockCompletedDate}
          variant="button"
        />
      )

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()

      fireEvent.click(button)
      expect(toast.error).toHaveBeenCalledWith('Datos insuficientes para generar el reporte')
    })

    it('prevents download when metricsData is missing', () => {
      render(
        <PDFDownload
          userData={mockUserData}
          metricsData={null as any}
          completedDate={mockCompletedDate}
          variant="button"
        />
      )

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()

      fireEvent.click(button)
      expect(toast.error).toHaveBeenCalledWith('Datos insuficientes para generar el reporte')
    })
  })

  describe('Card Variant', () => {
    it('renders card variant with complete information', () => {
      const mockGenerateFilename = vi.mocked(PDFGenerationService.generateFilename)
      mockGenerateFilename.mockReturnValue('Diagnostico_MIPYMES_Juan_Perez_2025-08-30.pdf')

      render(
        <PDFDownload
          userData={mockUserData}
          metricsData={mockMetricsData}
          completedDate={mockCompletedDate}
          variant="card"
        />
      )

      expect(screen.getByText('Descargar Reporte Completo')).toBeInTheDocument()
      expect(screen.getByText(/obtenga una copia completa de sus resultados/i)).toBeInTheDocument()
      expect(screen.getByText('El reporte incluye:')).toBeInTheDocument()
      expect(screen.getByText('• Información personal y de la empresa')).toBeInTheDocument()
      expect(screen.getByText('• Resumen general de resultados')).toBeInTheDocument()
      expect(screen.getByText('• Análisis detallado por categorías')).toBeInTheDocument()
      expect(screen.getByText('• Comparación con promedios generales')).toBeInTheDocument()
      expect(screen.getByText('• Áreas fuertes y de mejora identificadas')).toBeInTheDocument()
      expect(screen.getByText('• Métricas individuales con descripciones')).toBeInTheDocument()
      expect(screen.getByText('Archivo: Diagnostico_MIPYMES_Juan_Perez_2025-08-30.pdf')).toBeInTheDocument()
    })

    it('shows loading state in card variant', async () => {
      const mockGeneratePDF = vi.mocked(PDFGenerationService.generateResultsPDF)
      mockGeneratePDF.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

      render(
        <PDFDownload
          userData={mockUserData}
          metricsData={mockMetricsData}
          completedDate={mockCompletedDate}
          variant="card"
        />
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(screen.getByText('Generando reporte PDF...')).toBeInTheDocument()
      expect(screen.getByText(/esto puede tomar unos segundos/i)).toBeInTheDocument()
    })

    it('shows error state in card variant', async () => {
      const mockError = new Error('Network error')
      const mockGeneratePDF = vi.mocked(PDFGenerationService.generateResultsPDF)
      mockGeneratePDF.mockRejectedValue(mockError)

      render(
        <PDFDownload
          userData={mockUserData}
          metricsData={mockMetricsData}
          completedDate={mockCompletedDate}
          variant="card"
        />
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument()
      })
    })
  })

  describe('Filename Generation', () => {
    it('generates descriptive filename with user name and date', () => {
      const mockGenerateFilename = vi.mocked(PDFGenerationService.generateFilename)
      mockGenerateFilename.mockReturnValue('Diagnostico_MIPYMES_Juan_Perez_2025-08-30.pdf')

      render(
        <PDFDownload
          userData={mockUserData}
          metricsData={mockMetricsData}
          completedDate={mockCompletedDate}
          variant="card"
        />
      )

      expect(mockGenerateFilename).toHaveBeenCalledWith(mockUserData, mockCompletedDate)
      expect(screen.getByText('Archivo: Diagnostico_MIPYMES_Juan_Perez_2025-08-30.pdf')).toBeInTheDocument()
    })

    it('handles company name in filename when no personal name', () => {
      const userDataWithCompanyOnly = {
        ...mockUserData,
        nombre_persona: undefined
      }

      const mockGenerateFilename = vi.mocked(PDFGenerationService.generateFilename)
      mockGenerateFilename.mockReturnValue('Diagnostico_MIPYMES_Empresa_Test_SA_2025-08-30.pdf')

      render(
        <PDFDownload
          userData={userDataWithCompanyOnly}
          metricsData={mockMetricsData}
          completedDate={mockCompletedDate}
          variant="card"
        />
      )

      expect(mockGenerateFilename).toHaveBeenCalledWith(userDataWithCompanyOnly, mockCompletedDate)
    })
  })

  describe('PDF Content Matching', () => {
    it('passes correct data to PDF generation service', async () => {
      const mockBlob = new Blob(['mock pdf content'], { type: 'application/pdf' })
      const mockGeneratePDF = vi.mocked(PDFGenerationService.generateResultsPDF)
      mockGeneratePDF.mockResolvedValue(mockBlob)

      const customOptions = {
        includeCharts: true,
        includeMetrics: true,
        includeUserInfo: true
      }

      render(
        <PDFDownload
          userData={mockUserData}
          metricsData={mockMetricsData}
          completedDate={mockCompletedDate}
          variant="button"
          options={customOptions}
        />
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockGeneratePDF).toHaveBeenCalledWith(
          mockUserData,
          mockMetricsData,
          mockCompletedDate,
          customOptions
        )
      })
    })

    it('uses default options when none provided', async () => {
      const mockBlob = new Blob(['mock pdf content'], { type: 'application/pdf' })
      const mockGeneratePDF = vi.mocked(PDFGenerationService.generateResultsPDF)
      mockGeneratePDF.mockResolvedValue(mockBlob)

      render(
        <PDFDownload
          userData={mockUserData}
          metricsData={mockMetricsData}
          completedDate={mockCompletedDate}
          variant="button"
        />
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockGeneratePDF).toHaveBeenCalledWith(
          mockUserData,
          mockMetricsData,
          mockCompletedDate,
          {}
        )
      })
    })
  })
})