import { useState } from 'react'
import { Download, Loader2, FileText, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PDFGenerationService, PDFGenerationOptions } from '@/lib/pdfGenerationService'
import { MetricsData, UserProfile } from '@/types/results'
import { toast } from 'sonner'

interface PDFDownloadProps {
  userData: UserProfile
  metricsData: MetricsData
  completedDate: string
  className?: string
  variant?: 'button' | 'card'
  options?: PDFGenerationOptions
}

export function PDFDownload({
  userData,
  metricsData,
  completedDate,
  className = '',
  variant = 'button',
  options = {}
}: PDFDownloadProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    if (!userData || !metricsData) {
      toast.error('Datos insuficientes para generar el reporte')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      // Generate PDF
      const pdfBlob = await PDFGenerationService.generateResultsPDF(
        userData,
        metricsData,
        completedDate,
        options
      )

      // Generate filename
      const filename = PDFGenerationService.generateFilename(userData, completedDate)

      // Create download link
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('Reporte PDF descargado exitosamente')
    } catch (err) {
      console.error('Error generating PDF:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al generar el PDF'
      setError(errorMessage)
      toast.error('Error al generar el reporte PDF')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadButton = (
    <Button
      onClick={handleDownload}
      disabled={isGenerating || !userData || !metricsData}
      className={`flex items-center gap-2 ${className}`}
      variant="outline"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generando PDF...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Descargar Reporte PDF
        </>
      )}
    </Button>
  )

  if (variant === 'button') {
    return (
      <div className={className}>
        {downloadButton}
        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="h-6 w-6 text-red-600" />
          </div>
          
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Descargar Reporte Completo
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Obtenga una copia completa de sus resultados en formato PDF para guardar o compartir
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-700">
                <strong>El reporte incluye:</strong>
              </div>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Información personal y de la empresa</li>
                <li>• Resumen general de resultados</li>
                <li>• Análisis detallado por categorías</li>
                <li>• Comparación con promedios generales</li>
                <li>• Áreas fuertes y de mejora identificadas</li>
                <li>• Métricas individuales con descripciones</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {downloadButton}
              
              {userData && (
                <div className="text-xs text-gray-500">
                  Archivo: {PDFGenerationService.generateFilename(userData, completedDate)}
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2 text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            {isGenerating && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-blue-700">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm font-medium">Generando reporte PDF...</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Esto puede tomar unos segundos dependiendo de la cantidad de datos
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}