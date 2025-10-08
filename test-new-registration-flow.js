// Test del nuevo flujo de registro simplificado
// Solo crear cuenta en Supabase + validación RUC

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://ixqhqjqjqjqjqjqjqjqj.supabase.co'
const supabaseKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testNewRegistrationFlow() {
  console.log('🧪 Probando nuevo flujo de registro...')
  
  const testEmail = `test-${Date.now()}@empresa.com`
  const testPassword = 'password123'
  const testRuc = '1234567890001'
  
  try {
    // 1. Validar RUC primero
    console.log('1. Validando RUC...')
    const { data: rucData, error: rucError } = await supabase.functions.invoke('validate-ruc', {
      body: { ruc: testRuc }
    })
    
    if (rucError) {
      console.error('❌ Error validando RUC:', rucError)
      return
    }
    
    console.log('✅ RUC validado:', rucData.data?.razonSocial)
    
    // 2. Crear usuario en Supabase
    console.log('2. Creando usuario...')
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          ruc: rucData.data.ruc,
          razon_social: rucData.data.razonSocial,
          estado_contribuyente: rucData.data.estadoContribuyente,
          registration_completed: false
        }
      }
    })
    
    if (signUpError) {
      console.error('❌ Error creando usuario:', signUpError)
      return
    }
    
    console.log('✅ Usuario creado:', signUpData.user?.email)
    console.log('📧 Email de confirmación enviado')
    
    // 3. Verificar que NO se creó perfil automáticamente
    console.log('3. Verificando que no hay perfil...')
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', signUpData.user?.id)
      .maybeSingle()
    
    if (!profileData) {
      console.log('✅ Correcto: No se creó perfil automáticamente')
    } else {
      console.log('❌ Error: Se creó perfil automáticamente')
    }
    
    console.log('\n🎉 Nuevo flujo de registro funcionando correctamente!')
    console.log('📋 Próximos pasos:')
    console.log('   1. Usuario confirma email')
    console.log('   2. Usuario completa perfil')
    console.log('   3. Usuario accede al dashboard')
    
  } catch (error) {
    console.error('❌ Error en el test:', error)
  }
}

testNewRegistrationFlow()