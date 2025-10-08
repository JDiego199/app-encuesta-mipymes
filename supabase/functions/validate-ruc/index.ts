import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { ruc } = await req.json()

    if (!ruc || ruc.length !== 13) {
      return new Response(
        JSON.stringify({ 
          error: { message: 'RUC debe tener exactamente 13 dígitos' } 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Llamar a la API del SRI
    const sriUrl = `https://srienlinea.sri.gob.ec/sri-catastro-sujeto-servicio-internet/rest/ConsolidadoContribuyente/obtenerPorNumerosRuc?&ruc=${ruc}`
    
    const sriResponse = await fetch(sriUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    if (!sriResponse.ok) {
      throw new Error('Error al consultar el SRI')
    }

    let sriData
    try {
      sriData = await sriResponse.json()
    } catch (jsonError) {
      // If JSON parsing fails, it means the RUC was not found or invalid
      return new Response(
        JSON.stringify({ 
          data: { 
            valid: false, 
            message: 'RUC no encontrado en el SRI' 
          } 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!sriData || sriData.length === 0) {
      return new Response(
        JSON.stringify({ 
          data: { 
            valid: false, 
            message: 'RUC no encontrado en el SRI' 
          } 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const contribuyente = sriData[0]

    // Validar que el contribuyente esté activo
    if (contribuyente.estadoContribuyenteRuc !== 'ACTIVO') {
      return new Response(
        JSON.stringify({ 
          data: { 
            valid: false, 
            message: 'Solo se permiten contribuyentes en estado ACTIVO',
            contribuyente: {
              ruc: contribuyente.numeroRuc,
              razonSocial: contribuyente.razonSocial,
              estadoContribuyente: contribuyente.estadoContribuyenteRuc
            }
          } 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Retornar datos validados
    return new Response(
      JSON.stringify({ 
        data: { 
          valid: true,
          contribuyente: {
            ruc: contribuyente.numeroRuc,
            razonSocial: contribuyente.razonSocial,
            estadoContribuyente: contribuyente.estadoContribuyenteRuc,
            actividadEconomica: contribuyente.actividadEconomicaPrincipal,
            tipoContribuyente: contribuyente.tipoContribuyente,
            regimen: contribuyente.regimen,
            obligadoLlevarContabilidad: contribuyente.obligadoLlevarContabilidad,
            sriData: contribuyente
          }
        } 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error validating RUC:', error)
    return new Response(
      JSON.stringify({ 
        error: { message: error.message || 'Error interno del servidor' } 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})