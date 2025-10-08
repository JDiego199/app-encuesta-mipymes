import { describe, it, expect } from 'vitest'
import { PDFGenerationService } from '@/lib/pdfGenerationService'
import { UserProfile } from '@/types/results'

describe('PDFGenerationService - Basic Tests', () => {
  const mockUserData: UserProfile = {
    id: 'test-user-id',
    nombre_persona: 'Juan Pérez',
    razon_social: 'Empresa Test S.A.',
    ruc: '1234567890001',
    ciudad: 'Cuenca'
  }

  it('should generate descriptive filename with user name', () => {
    const filename = PDFGenerationService.generateFilename(mockUserData, '2025-08-30T20:52:00Z')
    
    expect(filename).toContain('Diagnostico_MIPYMES')
    expect(filename).toContain('Juan_Pérez')
    expect(filename).toContain('2025-08-30')
    expect(filename).toEndWith('.pdf')
  })

  it('should generate filename with company name when no person name', () => {
    const userData: UserProfile = {
      id: 'test-id',
      razon_social: 'Mi Empresa S.A.'
    }
    
    const filename = PDFGenerationService.generateFilename(userData)
    
    expect(filename).toContain('Mi_Empresa_S_A_')
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

  it('should clean special characters from filename', () => {
    const userData: UserProfile = {
      id: 'test-id',
      nombre_persona: 'José María Ñoño & Asociados!'
    }
    
    const filename = PDFGenerationService.generateFilename(userData)
    
    // Should not contain special characters
    expect(filename).not.toMatch(/[&!ñÑ]/)
    expect(filename).toContain('Jos_Mara_oo_Asociados')
  })
})