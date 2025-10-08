import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { MetricsData } from '@/types/results'
import { UserProfile } from '@/types/results'

export interface PDFGenerationOptions {
  includeCharts?: boolean
  includeMetrics?: boolean
  includeUserInfo?: boolean
  format?: 'a4' | 'letter'
  orientation?: 'portrait' | 'landscape'
}

export class PDFGenerationService {
  private static readonly DEFAULT_OPTIONS: Required<PDFGenerationOptions> = {
    includeCharts: true,
    includeMetrics: true,
    includeUserInfo: true,
    format: 'a4',
    orientation: 'portrait'
  }

  /**
   * Generate PDF report with user information, completion date, and all metrics
   */
  static async generateResultsPDF(
    userData: UserProfile,
    metricsData: MetricsData,
    completedDate: string,
    options: PDFGenerationOptions = {}
  ): Promise<Blob> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options }
    
    // Create new PDF document
    const pdf = new jsPDF({
      orientation: opts.orientation,
      unit: 'mm',
      format: opts.format
    })

    // Set up document properties
    pdf.setProperties({
      title: 'Reporte de Diagnóstico Empresarial MIPYMES',
      subject: 'Resultados del Diagnóstico del Ecosistema Empresarial',
      author: 'BIDATA - Universidad de Cuenca',
      creator: 'Sistema de Diagnóstico MIPYMES'
    })

    let yPosition = 20

    // Add header
    yPosition = this.addHeader(pdf, yPosition)

    // Add user information if enabled
    if (opts.includeUserInfo) {
      yPosition = this.addUserInformation(pdf, userData, completedDate, yPosition)
    }

    // Add overall score summary
    yPosition = this.addOverallSummary(pdf, metricsData, yPosition)

    // Add metrics details if enabled
    if (opts.includeMetrics) {
      yPosition = this.addMetricsDetails(pdf, metricsData, yPosition)
    }

    // Add footer
    this.addFooter(pdf)

    // Convert to blob
    const pdfBlob = pdf.output('blob')
    return pdfBlob
  }

  /**
   * Generate PDF from HTML element (for charts and complex layouts)
   */
  static async generatePDFFromElement(
    element: HTMLElement,
    filename: string,
    options: PDFGenerationOptions = {}
  ): Promise<Blob> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options }
    
    // Convert HTML element to canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    })

    // Create PDF
    const pdf = new jsPDF({
      orientation: opts.orientation,
      unit: 'mm',
      format: opts.format
    })

    // Calculate dimensions
    const imgWidth = opts.format === 'a4' ? 210 : 216 // A4 or Letter width in mm
    const pageHeight = opts.format === 'a4' ? 297 : 279 // A4 or Letter height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0

    // Add image to PDF (handle multiple pages if needed)
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    return pdf.output('blob')
  }

  /**
   * Add header section to PDF
   */
  private static addHeader(pdf: jsPDF, yPosition: number): number {
    // Title
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Reporte de Diagnóstico Empresarial MIPYMES', 105, yPosition, { align: 'center' })
    
    yPosition += 10
    
    // Subtitle
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Diagnóstico del Ecosistema Empresarial MIPYMES', 105, yPosition, { align: 'center' })
    
    yPosition += 15
    
    // Add line separator
    pdf.setLineWidth(0.5)
    pdf.line(20, yPosition, 190, yPosition)
    
    return yPosition + 10
  }

  /**
   * Add user information section
   */
  private static addUserInformation(
    pdf: jsPDF, 
    userData: UserProfile, 
    completedDate: string, 
    yPosition: number
  ): number {
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Información del Participante', 20, yPosition)
    
    yPosition += 10
    
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    
    // User name/company
    const displayName = userData.nombre_persona || userData.razon_social || 'No disponible'
    pdf.text(`Nombre/Razón Social: ${displayName}`, 20, yPosition)
    yPosition += 7
    
    // Company (if different from name)
    if (userData.razon_social && userData.nombre_persona) {
      pdf.text(`Empresa: ${userData.razon_social}`, 20, yPosition)
      yPosition += 7
    }
    
    // RUC
    if (userData.ruc) {
      pdf.text(`RUC: ${userData.ruc}`, 20, yPosition)
      yPosition += 7
    }
    
    // City
    if (userData.ciudad) {
      pdf.text(`Ciudad: ${userData.ciudad}`, 20, yPosition)
      yPosition += 7
    }
    
    // Completion date
    const formattedDate = this.formatCompletionDate(completedDate)
    pdf.text(`Fecha de Completado: ${formattedDate}`, 20, yPosition)
    yPosition += 7
    
    // Status
    pdf.text('Estado: Completado', 20, yPosition)
    
    return yPosition + 15
  }

  /**
   * Add overall summary section
   */
  private static addOverallSummary(pdf: jsPDF, metricsData: MetricsData, yPosition: number): number {
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Resumen General', 20, yPosition)
    
    yPosition += 10
    
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    
    // Overall score
    pdf.text(
      `Puntuación Total: ${metricsData.overallScore.user}/${metricsData.overallScore.maxScore}`,
      20, yPosition
    )
    yPosition += 7
    
    // Percentile
    pdf.text(`Percentil: ${metricsData.percentile}% (Mejor que el ${metricsData.percentile}% de participantes)`, 20, yPosition)
    yPosition += 7
    
    // Average comparison
    const performance = metricsData.overallScore.user > metricsData.overallScore.average ? 
      'Por encima del promedio' : 
      metricsData.overallScore.user < metricsData.overallScore.average ? 
      'Por debajo del promedio' : 
      'En el promedio'
    
    pdf.text(`Rendimiento: ${performance} (Promedio: ${metricsData.overallScore.average})`, 20, yPosition)
    yPosition += 10
    
    // Strong areas
    if (metricsData.strongAreas.length > 0) {
      pdf.setFont('helvetica', 'bold')
      pdf.text('Áreas Fuertes:', 20, yPosition)
      yPosition += 7
      
      pdf.setFont('helvetica', 'normal')
      metricsData.strongAreas.forEach(area => {
        pdf.text(`• ${area}`, 25, yPosition)
        yPosition += 6
      })
      yPosition += 3
    }
    
    // Improvement areas
    if (metricsData.improvementAreas.length > 0) {
      pdf.setFont('helvetica', 'bold')
      pdf.text('Áreas de Mejora:', 20, yPosition)
      yPosition += 7
      
      pdf.setFont('helvetica', 'normal')
      metricsData.improvementAreas.forEach(area => {
        pdf.text(`• ${area}`, 25, yPosition)
        yPosition += 6
      })
    }
    
    return yPosition + 15
  }

  /**
   * Add metrics details section
   */
  private static addMetricsDetails(pdf: jsPDF, metricsData: MetricsData, yPosition: number): number {
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Detalle de Métricas', 20, yPosition)
    
    yPosition += 10
    
    // Group metrics by category
    const metricsByCategory = metricsData.categories.reduce((acc, category) => {
      acc[category] = metricsData.metrics.filter(metric => metric.category === category)
      return acc
    }, {} as Record<string, typeof metricsData.metrics>)
    
    // Add each category
    for (const category of metricsData.categories) {
      const categoryMetrics = metricsByCategory[category]
      if (!categoryMetrics || categoryMetrics.length === 0) continue
      
      // Check if we need a new page
      if (yPosition > 250) {
        pdf.addPage()
        yPosition = 20
      }
      
      // Category title
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text(category, 20, yPosition)
      yPosition += 8
      
      // Category metrics
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      
      categoryMetrics.forEach(metric => {
        // Check if we need a new page
        if (yPosition > 270) {
          pdf.addPage()
          yPosition = 20
        }
        
        pdf.text(`${metric.name}: ${metric.userValue}${metric.unit}`, 25, yPosition)
        yPosition += 5
        
        pdf.setFont('helvetica', 'italic')
        pdf.text(`  Promedio: ${metric.averageValue}${metric.unit} | Máximo: ${metric.maxValue}${metric.unit}`, 25, yPosition)
        yPosition += 5
        
        pdf.setFont('helvetica', 'normal')
        if (metric.description) {
          const descLines = pdf.splitTextToSize(`  ${metric.description}`, 160)
          pdf.text(descLines, 25, yPosition)
          yPosition += descLines.length * 4
        }
        
        yPosition += 3
      })
      
      yPosition += 5
    }
    
    return yPosition
  }

  /**
   * Add footer to PDF
   */
  private static addFooter(pdf: jsPDF): void {
    const pageCount = pdf.getNumberOfPages()
    
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i)
      
      // Footer line
      pdf.setLineWidth(0.3)
      pdf.line(20, 280, 190, 280)
      
      // Footer text
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.text(
        'Proyecto de investigación Bi-DATA - Escuela Superior Politecnica de Chimborazo - Datos confidenciales para fines académicos',
        105, 285,
        { align: 'center' }
      )
      
      // Page number
      pdf.text(`Página ${i} de ${pageCount}`, 190, 290, { align: 'right' })
      
      // Generation date
      const now = new Date()
      const generatedDate = now.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
      pdf.text(`Generado: ${generatedDate}`, 20, 290)
    }
  }

  /**
   * Format completion date for display
   */
  private static formatCompletionDate(dateString: string): string {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  /**
   * Generate descriptive filename for PDF
   */
  static generateFilename(userData: UserProfile, completedDate?: string): string {
    const name = userData.nombre_persona || userData.razon_social || 'Usuario'
    const cleanName = name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')
    
    const date = completedDate ? new Date(completedDate) : new Date()
    const dateStr = date.toISOString().split('T')[0] // YYYY-MM-DD format
    
    return `Diagnostico_MIPYMES_${cleanName}_${dateStr}.pdf`
  }
}