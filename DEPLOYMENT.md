# Instrucciones de Despliegue

## Edge Functions de Supabase

Para desplegar las edge functions necesarias para el funcionamiento completo de la aplicación:

### 1. Instalar Supabase CLI

```bash
npm install -g supabase
```

### 2. Hacer login en Supabase

```bash
supabase login
```

### 3. Vincular el proyecto

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### 4. Desplegar las edge functions

```bash
supabase functions deploy validate-ruc
supabase functions deploy create-profile
supabase functions deploy add-limesurvey-participant
```

### 5. Aplicar las migraciones de base de datos

```bash
supabase db push
```

## Configuración de Variables de Entorno

Asegúrate de que las siguientes variables estén configuradas en tu proyecto de Supabase:

- `SUPABASE_URL`: URL de tu proyecto Supabase
- `SUPABASE_ANON_KEY`: Clave anónima de Supabase

## APIs Externas Utilizadas

### API del SRI
- **URL**: `https://srienlinea.sri.gob.ec/sri-catastro-sujeto-servicio-internet/rest/ConsolidadoContribuyente/obtenerPorNumerosRuc`
- **Método**: GET
- **Parámetro**: `ruc` (13 dígitos)

### API de LimeSurvey
- **URL**: `https://limesurvey.pruebasbidata.site/index.php/admin/remotecontrol`
- **Método**: POST
- **Session Key**: `7QsQQVEZbtawz3zwmdvz9L1E_ubmR3LR`
- **Survey ID**: `614997`

## Flujo de la Aplicación

1. **Registro**: El usuario se registra con email/contraseña y valida su RUC con el SRI
2. **Creación de Perfil**: Se crea automáticamente el perfil con datos del SRI y información adicional
3. **Dashboard**: El usuario ve un botón para iniciar la encuesta
4. **Agregar Participante**: Al hacer clic, se agrega como participante en LimeSurvey usando su UID como token
5. **Encuesta Embebida**: Se muestra la encuesta de LimeSurvey en un iframe con el token del usuario

## Estructura de Base de Datos

### Tabla `profiles`
- Campos existentes + nuevos campos:
  - `nombre_persona`: Nombre completo del usuario
  - `nombre_empresa`: Nombre comercial de la empresa
  - `sector`: Sector económico
  - `ciudad`: Ciudad donde opera
  - `sri_data`: Datos completos del SRI en formato JSON

### Tabla `limesurvey_participants`
- `user_id`: Referencia al usuario de Supabase
- `survey_id`: ID de la encuesta en LimeSurvey
- `token`: Token único (UID del usuario)
- `firstname`, `lastname`, `email`: Datos del participante
- `limesurvey_response`: Respuesta completa de la API de LimeSurvey