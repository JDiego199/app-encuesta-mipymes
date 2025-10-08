# Componentes de Visualización de Resultados

Este directorio contiene los componentes para mostrar los resultados del diagnóstico del ecosistema empresarial MIPYMES.

## Componentes Principales

### MetricCard
Muestra una métrica individual con comparación entre el puntaje del usuario y el promedio general.

**Características:**
- Indicadores visuales (íconos de tendencia)
- Barras de progreso para usuario y promedio
- Información de categoría y descripción
- Cálculo automático de porcentajes de diferencia

**Uso:**
```tsx
import { MetricCard } from '@/components/survey/MetricCard'

<MetricCard metric={metric} />
```

### ComparisonChart
Componente de gráficos para visualizar comparaciones entre métricas.

**Tipos de gráficos soportados:**
- `bar`: Gráfico de barras (por defecto)
- `radar`: Gráfico de radar
- `line`: Gráfico de líneas

**Uso:**
```tsx
import { ComparisonChart } from '@/components/survey/ComparisonChart'

<ComparisonChart 
  metrics={metrics}
  chartType="bar"
  title="Comparación de Métricas"
/>
```

### ResultsMetrics
Componente principal que organiza y muestra todas las métricas de resultados.

**Características:**
- Resumen general con puntaje total y percentil
- Áreas fuertes y de mejora identificadas
- Organización por categorías
- Gráficos de comparación integrados
- Insights adicionales

**Uso:**
```tsx
import { ResultsMetrics } from '@/components/survey/ResultsMetrics'

<ResultsMetrics metricsData={metricsData} />
```

## Dimensiones del Ecosistema Empresarial

El sistema evalúa 8 dimensiones principales:

1. **Marco Institucional** - Políticas públicas, instituciones de apoyo, regulación
2. **Entorno Operativo** - Simplificación de procedimientos, trámites digitales
3. **Acceso al Financiamiento** - Oferta financiera, requisitos, educación financiera
4. **Servicios de Desarrollo Empresarial** - Capacitación, compras públicas, redes
5. **Innovación y Tecnología** - Adopción digital, I+D, vinculación universitaria
6. **Transformación Productiva** - Diversificación, eficiencia, sostenibilidad
7. **Acceso a Mercados** - Presencia local, exportación, marketing digital
8. **Digitalización** - Sistemas de gestión, comercio electrónico, ciberseguridad

## Categorías de Agrupación

Las dimensiones se agrupan en 4 categorías principales:

- **Entorno Institucional**: Marco Institucional, Entorno Operativo
- **Recursos y Financiamiento**: Acceso al Financiamiento, Servicios de Desarrollo Empresarial
- **Innovación y Tecnología**: Innovación y Tecnología, Digitalización
- **Desarrollo Productivo**: Transformación Productiva, Acceso a Mercados

## Servicios de Datos

### ArtificialResultsService
Genera datos artificiales consistentes basados en el perfil del usuario.

### ResultsTransformer
Transforma los datos del servicio artificial al formato requerido por los componentes de visualización.

### useResultsData Hook
Hook personalizado que maneja la generación y transformación de datos de resultados.

**Uso:**
```tsx
import { useResultsData } from '@/hooks/useResultsData'

function MyComponent() {
  const { metricsData, isLoading, isCompleted } = useResultsData()
  
  if (isLoading) return <div>Cargando...</div>
  if (!isCompleted) return <div>Encuesta no completada</div>
  
  return <ResultsMetrics metricsData={metricsData} />
}
```

## Dependencias

- **Recharts**: Biblioteca de gráficos para React
- **Lucide React**: Íconos
- **Tailwind CSS**: Estilos
- **Radix UI**: Componentes base (Card, etc.)

## Testing

Los componentes incluyen tests unitarios que verifican:
- Renderizado correcto de datos
- Cálculos de comparación
- Indicadores visuales
- Transformación de datos