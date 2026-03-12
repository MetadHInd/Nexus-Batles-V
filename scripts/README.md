# 🛠️ Scripts de Gestión de Entornos

## 📁 Archivos de Entorno

El proyecto soporta múltiples entornos mediante archivos `.env` específicos:

```
.env                    → Entorno por defecto
.env.development       → Desarrollo local
.env.production        → Producción
.env.staging          → Staging (crear si se necesita)
.env.test             → Testing (crear si se necesita)
```

## 🚀 Scripts Disponibles

### Desarrollo

```bash
# Iniciar en modo desarrollo (con hot-reload)
npm run start:dev

# Iniciar en modo debug
npm run start:debug

# Build del proyecto
npm run build
```

### Producción

```bash
# Iniciar en modo producción
npm run start:prod
```

### Base de Datos

```bash
# Sincronizar schema desde DB
npm run db:pull

# Generar Prisma Client
npm run db:generate
```

## 🔧 Uso del Script load-env.js

El script `scripts/load-env.js` carga automáticamente el archivo `.env` correcto:

```bash
# Sintaxis
node scripts/load-env.js <environment> -- <command>

# Ejemplos
node scripts/load-env.js development -- npm start
node scripts/load-env.js production -- npm start
node scripts/load-env.js staging -- nest start --watch
```

### Funcionamiento

1. Lee el archivo `.env.<environment>`
2. Si no existe, usa `.env` como fallback
3. Carga las variables en el proceso
4. Ejecuta el comando especificado

## 📋 Configuración Inicial

### 1. Crear archivo de entorno

```bash
# Copiar template
cp .env.example .env.development

# Editar valores
nano .env.development
```

### 2. Variables Requeridas Mínimas

```bash
DATABASE_URL="postgresql://user:pass@host:port/db"
JWT_SECRET="tu_secret_seguro_256_bits"
REDIS_HOST=localhost
DEFAULT_TENANT_ID=development
```

### 3. Verificar Configuración

```bash
# Probar que carga correctamente
node scripts/load-env.js development -- node -e "console.log(process.env.DATABASE_URL)"
```

## 🔒 Seguridad

### Archivos Ignorados en Git

```gitignore
.env
.env.development
.env.production
.env.staging
.env.test
.env.local
.env.*.local
```

### ⚠️ Nunca Commitear

- Contraseñas de base de datos
- API keys
- Secrets de JWT
- Credenciales de servicios externos

### ✅ Sí Commitear

- `.env.example` (template sin valores sensibles)
- `scripts/load-env.js` (lógica de carga)
- Documentación de variables requeridas

## 📝 Variables de Entorno por Categoría

### Base de Datos

```bash
DATABASE_URL="postgresql://..."
```

### Redis Cache

```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_TTL=3600
```

### Autenticación JWT

```bash
JWT_SECRET=your_secret_256_bits
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
```

### Aplicación

```bash
APP_NAME=SaaSFramework
APP_PORT=3000
NODE_ENV=development
API_PREFIX=api
CORS_ORIGIN=http://localhost:4200
```

### Multi-Tenancy

```bash
DEFAULT_TENANT_ID=development
TENANT_HEADER=x-tenant-id
```

### Feature Flags

```bash
ENABLE_SWAGGER=true
ENABLE_WEBSOCKETS=true
ENABLE_RATE_LIMITING=true
ENABLE_PERMISSION_CACHE=true
```

## 🎯 Mejores Prácticas

1. **Desarrollo Local**
   - Usa `.env.development`
   - Valores no críticos pueden ser compartidos
   - Documenta cambios en variables

2. **Producción**
   - Usa variables de entorno del sistema
   - O usa servicios de secrets (AWS Secrets Manager, GCP Secret Manager)
   - Nunca incluyas `.env.production` en el repo

3. **Testing**
   - Usa `.env.test` con datos de prueba
   - Base de datos separada para tests

4. **CI/CD**
   - Configura variables en tu plataforma (GitHub Actions, GitLab CI, etc.)
   - No uses archivos `.env` en pipelines

## 🐛 Troubleshooting

### Error: "Cannot find module"

```bash
# Asegúrate de estar en el directorio correcto
cd backend
npm run start:dev
```

### Error: "Cannot read .env file"

```bash
# Verifica que existe el archivo
ls -la .env*

# Crea desde el template
cp .env.example .env.development
```

### Variables no se cargan

```bash
# Verifica la sintaxis del .env (sin espacios extra)
KEY=value  # ✅ Correcto
KEY = value  # ❌ Incorrecto

# Reinicia el servidor después de cambios
```

## 📦 Integración con Prisma

```bash
# Prisma usa DATABASE_URL automáticamente
npx prisma migrate dev
npx prisma studio

# Generar cliente
npm run db:generate
```

## 🌐 Despliegue

### Docker

```dockerfile
# En Dockerfile
COPY .env.production .env
ENV NODE_ENV=production
```

### Railway / Vercel / Fly.io

Configura variables en el dashboard de la plataforma:

```
DATABASE_URL=postgresql://...
JWT_SECRET=...
REDIS_URL=redis://...
```

## 📚 Referencias

- [NestJS Configuration](https://docs.nestjs.com/techniques/configuration)
- [dotenv](https://github.com/motdotla/dotenv)
- [12 Factor App - Config](https://12factor.net/config)
