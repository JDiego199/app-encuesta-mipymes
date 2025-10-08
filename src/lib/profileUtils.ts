import { Database } from '@/lib/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

/**
 * Check if a profile is complete and has all required fields
 */
export function isProfileComplete(profile: Profile | null): boolean {
  if (!profile) {
    return false
  }

  // Required fields for a complete profile
  const requiredFields = [
    'ruc',
    'razon_social',
    'nombre_persona',
    'sector',
    'ciudad'
  ]

  // Check if all required fields are present and not empty
  return requiredFields.every(field => {
    const value = profile[field as keyof Profile]
    return value !== null && value !== undefined && String(value).trim() !== ''
  })
}

/**
 * Get missing required fields from a profile
 */
export function getMissingProfileFields(profile: Profile | null): string[] {
  if (!profile) {
    return ['ruc', 'razon_social', 'nombre_persona', 'sector', 'ciudad']
  }

  const requiredFields = [
    { key: 'ruc', label: 'RUC' },
    { key: 'razon_social', label: 'Razón Social' },
    { key: 'nombre_persona', label: 'Nombre Completo' },
    { key: 'sector', label: 'Sector Económico' },
    { key: 'ciudad', label: 'Ciudad' }
  ]

  return requiredFields
    .filter(field => {
      const value = profile[field.key as keyof Profile]
      return value === null || value === undefined || String(value).trim() === ''
    })
    .map(field => field.label)
}