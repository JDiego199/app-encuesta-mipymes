# Docker Scripts para la Aplicación

## Comandos de Docker

### Construcción y ejecución en producción
```bash
# Construir la imagen
docker build -t react-app .

# Ejecutar el contenedor
docker run -p 3000:80 react-app

# O usar docker-compose
docker-compose up --build
```

### Desarrollo
```bash
# Ejecutar en modo desarrollo
docker-compose --profile dev up app-dev

# O construir y ejecutar manualmente
docker build -f Dockerfile.dev -t react-app-dev .
docker run -p 5173:5173 -v $(pwd):/app -v /app/node_modules react-app-dev
```

### Comandos útiles
```bash
# Ver logs
docker-compose logs -f

# Parar servicios
docker-compose down

# Limpiar imágenes no utilizadas
docker system prune -a

# Acceder al contenedor
docker exec -it <container_id> sh
```

## Variables de entorno

Si necesitas variables de entorno, crea un archivo `.env` y agrégalo al docker-compose.yml:

```yaml
environment:
  - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
  - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
```

## Notas importantes

1. **Puerto de producción**: La app estará disponible en `http://localhost:3000`
2. **Puerto de desarrollo**: La app estará disponible en `http://localhost:5173`
3. **Nginx**: Se usa nginx para servir los archivos estáticos en producción
4. **Hot reload**: En desarrollo, los cambios se reflejan automáticamente
5. **Optimización**: La imagen de producción está optimizada y es más pequeña