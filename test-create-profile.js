// Test script specifically for create-profile Edge Function
const SUPABASE_URL = 'https://idahoiszluzixfbkwfth.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkYWhvaXN6bHV6aXhmYmt3ZnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3OTAxMjAsImV4cCI6MjA3MTM2NjEyMH0.NMEJwQOA5RqooRaJmoKf40fsafWICa1ANqeaif7U-eY'

async function testCreateProfileWithoutAuth() {
  console.log('🧪 Testing create-profile Edge Function (should fail without auth)...')
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        email: 'test@example.com',
        ruc: '1790016919001',
        razonSocial: 'Test Company',
        actividadEconomica: 'Test Activity',
        estadoContribuyente: 'ACTIVO',
        nombrePersona: 'Test Person',
        nombreEmpresa: 'Test Company',
        sector: 'Test Sector',
        ciudad: 'Test City'
      })
    })
    
    const result = await response.json()
    console.log('Response:', result)
    
    if (result.error && result.error.message.includes('Usuario no autenticado')) {
      console.log('✅ create-profile correctly rejects unauthenticated requests')
      return true
    } else {
      console.log('❌ create-profile should reject unauthenticated requests')
      return false
    }
  } catch (error) {
    console.log('❌ create-profile test error:', error.message)
    return false
  }
}

async function runCreateProfileTests() {
  console.log('🚀 Starting create-profile Edge Function Tests...\n')
  
  const results = {
    unauthenticatedRejection: await testCreateProfileWithoutAuth()
  }
  
  console.log('\n📊 Test Results Summary:')
  console.log('========================')
  console.log(`Unauthenticated Rejection: ${results.unauthenticatedRejection ? '✅ PASS' : '❌ FAIL'}`)
  
  const allPassed = Object.values(results).every(result => result)
  console.log(`\n🎯 Overall Status: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`)
  
  return results
}

runCreateProfileTests().catch(console.error)