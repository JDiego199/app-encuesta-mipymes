// Test script to verify key functionality
// This script tests the Edge Functions and database connectivity

const SUPABASE_URL = 'https://idahoiszluzixfbkwfth.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkYWhvaXN6bHV6aXhmYmt3ZnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3OTAxMjAsImV4cCI6MjA3MTM2NjEyMH0.NMEJwQOA5RqooRaJmoKf40fsafWICa1ANqeaif7U-eY'

async function testRUCValidation() {
  console.log('🧪 Testing RUC Validation Edge Function...')
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/validate-ruc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ ruc: '1790016919001' }) // Test RUC
    })
    
    const result = await response.json()
    console.log('✅ RUC Validation Response:', result)
    
    if (result.data && result.data.valid) {
      console.log('✅ RUC Validation: PASSED')
      return result.data
    } else {
      console.log('❌ RUC Validation: FAILED')
      return null
    }
  } catch (error) {
    console.log('❌ RUC Validation Error:', error.message)
    return null
  }
}

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase Connection...')
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=count`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    })
    
    if (response.ok) {
      console.log('✅ Supabase Connection: PASSED')
      return true
    } else {
      console.log('❌ Supabase Connection: FAILED', response.status)
      return false
    }
  } catch (error) {
    console.log('❌ Supabase Connection Error:', error.message)
    return false
  }
}

async function testLimeSurveyAPI() {
  console.log('🧪 Testing LimeSurvey API Connection...')
  
  try {
    const response = await fetch('https://limesurvey.pruebasbidata.site/index.php/admin/remotecontrol', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method: 'get_session_key',
        params: ['admin', 'jBK£@7L64Gev'],
        id: 1
      })
    })
    
    const result = await response.json()
    console.log('✅ LimeSurvey API Response:', result)
    
    if (result.result && typeof result.result === 'string') {
      console.log('✅ LimeSurvey API: PASSED')
      return true
    } else {
      console.log('❌ LimeSurvey API: FAILED')
      return false
    }
  } catch (error) {
    console.log('❌ LimeSurvey API Error:', error.message)
    return false
  }
}

async function runTests() {
  console.log('🚀 Starting Functionality Tests...\n')
  
  const results = {
    supabaseConnection: await testSupabaseConnection(),
    rucValidation: await testRUCValidation(),
    limeSurveyAPI: await testLimeSurveyAPI()
  }
  
  console.log('\n📊 Test Results Summary:')
  console.log('========================')
  console.log(`Supabase Connection: ${results.supabaseConnection ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`RUC Validation: ${results.rucValidation ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`LimeSurvey API: ${results.limeSurveyAPI ? '✅ PASS' : '❌ FAIL'}`)
  
  const allPassed = Object.values(results).every(result => result)
  console.log(`\n🎯 Overall Status: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`)
  
  return results
}

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
  runTests().catch(console.error)
}

// Export for use in other contexts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runTests, testRUCValidation, testSupabaseConnection, testLimeSurveyAPI }
}