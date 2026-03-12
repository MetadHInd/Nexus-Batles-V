# AI Agent Backend - Clean Base

Backend base limpio con módulos esenciales para iniciar nuevos proyectos con IA.

## 🎯 Módulos Incluidos

### Core
- **Database**: Gestión de base de datos con Prisma
- **Cache**: Sistema de caché con Redis
- **Auth**: Autenticación JWT
- **Messaging**: Sistema de mensajería

### IA
- **aia-intelligence**: Módulo principal de inteligencia artificial
  - Butterflies (asistentes especializados)
  - Customer Service Agent
  - Inventory Advisor
  - Manager Assistant
  - PDF Order Extractor
  - Profile Manager
  - Welcome Assistant
  - Catering Assistant
- **galatea-intelligence-triggers**: Sistema de triggers para IA

### Usuarios
- **users**: Gestión de usuarios
- **user**: Perfil de usuario individual
- **user-profile**: Perfiles extendidos de usuarios
- **user-status**: Estados de usuarios
- **multi-tenant**: Soporte multi-tenancy

### Integraciones
- **Stripe**: Pagos
- **Twilio**: SMS y comunicación
- **Gmail**: Correo electrónico
- **Deliveries**: Integraciones de delivery
- **Rewards**: Sistema de recompensas
- **Google Cloud Storage**: Almacenamiento de archivos

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Generar cliente Prisma
npm run db:generate

# Iniciar en desarrollo
npm run start:dev
```

## 📦 Tecnologías Principales

- **NestJS**: Framework backend
- **Prisma**: ORM
- **LangChain**: Framework de IA
- **@askaia packages**: Paquetes propios de IA
  - agent-llm-base
  - agent-memory
  - agent-orchestration
  - agent-repository
  - agent-types
- **Redis**: Caché
- **PostgreSQL**: Base de datos
- **Socket.IO**: WebSockets para tiempo real

## 🔧 Scripts Disponibles

- `npm run start:dev`: Iniciar en desarrollo
- `npm run start:debug`: Iniciar en modo debug
- `npm run start:prod`: Iniciar en producción
- `npm run build`: Compilar proyecto
- `npm run lint`: Verificar código
- `npm run test`: Ejecutar tests
- `npm run test:watch`: Tests en modo watch
- `npm run test:cov`: Coverage de tests
- `npm run db:pull`: Sincronizar schema desde DB
- `npm run db:generate`: Generar cliente Prisma

## 🏗️ Estructura del Proyecto

```
backend/
├── src/
│   ├── modules/           # Módulos de la aplicación
│   │   ├── galatea-intelligence/      # IA principal
│   │   ├── galatea-intelligence-triggers/  # Triggers de IA
│   │   ├── users/         # Gestión de usuarios
│   │   ├── user/          # Usuario individual
│   │   ├── user-profile/  # Perfiles
│   │   ├── user-status/   # Estados de usuario
│   │   └── multi-tenant/  # Multi-tenancy
│   ├── shared/            # Código compartido
│   │   ├── cache/         # Sistema de caché
│   │   ├── core/          # Núcleo (auth, messaging, etc.)
│   │   ├── database/      # Prisma y DB
│   │   ├── integrations/  # Integraciones externas
│   │   └── services/      # Servicios globales
│   ├── app.module.ts      # Módulo raíz
│   └── main.ts            # Entry point
├── prisma/                # Schema de Prisma
├── test/                  # Tests
├── .env                   # Variables de entorno
└── package.json           # Dependencias
```

## 🔐 Configuración de Entorno

Variables esenciales en `.env`:

```env
# Base de datos
DATABASE_URL="postgresql://..."

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="24h"

# Redis
REDIS_HOST="localhost"
REDIS_PORT="6379"

# Stripe (opcional)
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Twilio (opcional)
TWILIO_ACCOUNT_SID="..."
TWILIO_AUTH_TOKEN="..."

# Gmail (opcional)
GMAIL_USER="..."
GMAIL_APP_PASSWORD="..."

# Google Cloud (opcional)
GCS_BUCKET_NAME="..."
GOOGLE_APPLICATION_CREDENTIALS="..."
```

## 🤖 Sistema de IA

El backend incluye un sistema completo de IA con:

- **Butterflies**: Asistentes especializados por dominio
- **LangChain**: Framework de orquestación
- **Memory**: Sistema de memoria para conversaciones
- **Triggers**: Automatizaciones basadas en eventos
- **Orchestration**: Orquestación de múltiples agentes

## 📝 Notas

- **Base de datos**: La estructura de la BD permanece intacta (no se eliminó nada)
- **Módulos**: Solo se mantienen módulos esenciales de IA, auth e integraciones
- **Listo para**: Iniciar un nuevo proyecto desde una base limpia y funcional

## 📝 Licencia

UNLICENSED - Proyecto privado
