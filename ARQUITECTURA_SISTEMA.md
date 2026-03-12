# 📋 ARQUITECTURA DEL SISTEMA - FRAMEWORK SAAS GENÉRICO

**Fecha de Análisis:** 11 de enero de 2026  
**Framework:** NestJS v11.0.1  
**Versión Node:** 22.14  
**Base de Datos:** PostgreSQL con Prisma ORM  
**Tipo:** Sistema Multi-Tenant SaaS Genérico

---

## 🏗️ ARQUITECTURA GENERAL

### **Stack Tecnológico Principal**
- **Backend Framework:** NestJS (TypeScript) - Totalmente agnóstico del dominio de negocio
- **ORM:** Prisma v6.6.0 con Prisma Accelerate
- **Base de Datos:** PostgreSQL con Multi-tenancy
- **Cache:** Redis (ioredis v5.6.1) con namespacing automático
- **WebSockets:** Socket.IO v4.8.1 para comunicación en tiempo real
- **Autenticación:** JWT (Passport + @nestjs/jwt) genérico
- **Inteligencia Artificial:** LangChain + módulos extensibles
- **Contenedores:** Docker con Alpine Linux
- **Cloud:** Google Cloud Platform (Storage, Secret Manager, Firestore, Vertex AI)

---

## 🔧 COMPONENTES PRINCIPALES DEL SISTEMA

### **1. EVENT BUS (Sistema de Eventos)**
📁 `src/shared/core/services/service-cache/event-bus.service.ts`

**Características:**
- Implementación basada en EventEmitter de Node.js
- Patrón Singleton global
- Límite de 50 listeners simultáneos
- Soporta eventos string, class y tuplas [Class, string]

**Funcionalidades:**
```typescript
- emit<T>(event, ...args): Emitir eventos
- on(event, handler): Suscribirse a eventos
- off(event, handler): Desuscribirse de eventos
```

**Uso:**
```typescript
eventBus.emit('record:created', recordData);
eventBus.on('user:login', handleUserLogin);
eventBus.emit('entity:updated', entityData);
```

---

### **2. SERVICE CACHE (Sistema de Cache Global)**
📁 `src/shared/core/services/service-cache/service-cache.ts`

**Arquitectura:**
- Singleton global accesible desde cualquier parte
- Implementado con Mixins para composición modular
- Integra: Database, Messaging, Authorization, Circuit Breaker

**Componentes:**
```typescript
ServiceCache.Database.Prisma        // Acceso directo a Prisma
ServiceCache.Database.Firestore     // Acceso a Firestore
ServiceCache.Messaging.Email        // Envío de emails
ServiceCache.Messaging.SMS          // Envío de SMS
ServiceCache.Messaging.WhatsApp     // Envío de WhatsApp
ServiceCache.Messaging.Push         // Notificaciones Push
```

**Mixins Aplicados:**
- `WithDatabase`: Acceso a Prisma y Firestore
- `WithMessaging`: Sistema de mensajería unificado
- `WithEmail/SMS/WhatsApp/Push`: Canales específicos
- `WithAuthorization`: Control de accesos
- `WithCircuitBreaker`: Patrón Circuit Breaker para resiliencia

---

### **3. SISTEMA DE CACHÉ REDIS**
📁 `src/shared/cache/`

**Módulos:**
- `redis-cache.service.ts`: Servicio base de Redis
- `cache-management.service.ts`: Gestión avanzada de caché
- `cache-management.controller.ts`: API REST para administración

**Características:**
✅ Multi-tenancy automático por request  
✅ TTL configurable por clave  
✅ Namespaces para organización  
✅ Limpieza selectiva por patrones  
✅ Estadísticas en tiempo real  
✅ Fallback graceful si Redis no está disponible  

**Estructura de Keys:**
```
{tenant_id}:{namespace}:{key}:{param1}={value1}:{param2}={value2}
Ejemplo: tenant123:records:list:page=1:limit=10
Ejemplo: global:config:settings
```

**Endpoints de Administración:**
- `GET /api/cache-management/stats`: Estadísticas generales
- `POST /api/cache-management/clear`: Limpiar caché
- `GET /api/cache-management/keys`: Listar claves
- `POST /api/cache-management/analyze`: Análisis detallado

---

### **4. SISTEMA DE MENSAJERÍA COMPLETO**
📁 `src/shared/core/messaging/`

**Canales Disponibles:**

#### **4.1 Email (Nodemailer)**
- `EmailService`: Envío de correos
- `EmailTemplateService`: Plantillas HTML
- Soporta adjuntos y templates dinámicos
- Configuración SMTP flexible

#### **4.2 SMS (Twilio)**
- `SmsService`: Envío de SMS
- Múltiples proveedores configurables
- Validación de números telefónicos
- Normalización internacional

#### **4.3 WhatsApp (Twilio)**
- `WhatsAppService`: Mensajes de WhatsApp
- Mensajes de texto simples
- Mensajes interactivos (listas, botones)
- Envío de archivos adjuntos (imagen, documento, audio)

#### **4.4 Push Notifications (Firebase FCM)**
- `PushService`: Notificaciones push
- Tokens de dispositivo
- Notificaciones silenciosas y visibles

**Factory Pattern:**
```typescript
MessagingProviderFactory.send(provider, message)
```

**Message Logger:**
- Registro de todos los mensajes enviados
- Tracking de estado (enviado, fallido, pendiente)
- Historial completo en base de datos

---

### **5. SISTEMA DE AUTENTICACIÓN Y AUTORIZACIÓN**
📁 `src/shared/core/auth/`

**Componentes:**

#### **5.1 Servicios de Autenticación**
- `InternalAuthService`: Auth para usuarios internos
- `ExternalAuthService`: Auth para usuarios externos/clientes
- `TokenService`: Generación y validación de JWT
- `PasswordService`: Hash bcrypt de contraseñas
- `RoleService`: Gestión de roles y permisos
- `SignatureService`: Firma digital de tokens
- `ChecksumService`: Validación de integridad
- `AuthCacheService`: Cache de sesiones y tokens

#### **5.2 Estrategias**
- `JwtStrategy`: Validación de tokens JWT con Passport

#### **5.3 Guards (Protección de Rutas)**
- `JwtAuthGuard`: Verificar autenticación
- `RolesGuard`: Verificar roles requeridos
- `BranchAccessGuard`: Acceso por sucursal
- `DualRoleGuard`: Roles múltiples simultáneos

**Configuración JWT:**
- Secret: `process.env.JWT_SECRET`
- Expiración: 24 horas (configurable)
- Bearer token en header Authorization

---

### **6. WEBSOCKETS (Socket.IO)**
📁 `src/shared/core/websockets/`

**Arquitectura:**
- Gateway genérico extensible
- Tipado fuerte de eventos y payloads
- Registro centralizado de eventos

**Gateways Disponibles:**
- `UserGateway`: Eventos de usuarios
- `GenericGateway`: Base extensible para nuevos gateways

**Eventos Definidos:**
```typescript
enum SocketEventTypes {
  USER_MESSAGE = 'user:message',
  ORDER_UPDATED = 'order:updated',
  NOTIFICATION = 'notification',
  // ... más eventos
}
```

**Conexiones Rastreadas:**
- Tabla `websocket_connections` en DB
- Track de usuarios conectados por sucursal
- Eventos de conexión/desconexión

---

### **7. API REST (Swagger/OpenAPI)**

**Documentación Interactiva:**
- URL: `http://localhost:3000/api-docs`
- Autenticación Bearer JWT integrada
- 21+ categorías o (Genéricos):**
1. **Auth**: Autenticación y autorización JWT
2. **Users**: Gestión de usuarios multi-tenant
3. **Permissions**: Sistema RBAC/ABAC/PBAC
4. **Records**: CRUD genérico de registros
5. **Contacts**: Gestión de contactos/clientes
6. **Transactions**: Sistema de transacciones/pagos
7. **Messaging**: Sistema de mensajería multi-canal
8. **System**: Configuración del sistema
9. **Reports**: Generación de reportes
10. **Config**: Configuraciones por tenant
11. **AI Agents**: Agentes de inteligencia artificial
12. **WebSockets**: Comunicación en tiempo real
13. **Files**: Gestión de archivos (GCS)
14. **Cache**: Administración de caché Redis
15. **Notifications**: Notificaciones push/email/SMS
16-20. **Agentes IA específicos** (Catering, Inventory, etc.)
21. **WhatsApp**: Integración WhatsApp Business

**Características:**
- Validación automática con `class-validator`
- Transformación de DTOs con `class-transformer`
- Interceptor global de respuestas (`AnswerInterceptor`)
- Filtro global de excepciones (`GlobalExceptionFilter`)
- Middleware de tiempo de respuesta

---

### **8. CONEXIONES A BASES DE DATOS**

#### **8.1 PostgreSQL (Prisma)**
📁 `src/shared/database/prisma.service.ts`

**Características:**
- Cliente Prisma extendido con middleware
- Auto-filtrado por tenant_id (Multi-tenancy)
- Connection pooling automático
- Soporte para Prisma Accelerate (caching y edge functions)

**Middleware de Multi-tenancy:**
```typescript
// Auto-filtra todas las queries por tenant_id
args.where.tenant_ids = { has: tenantId }
// Auto-asigna tenant_id en creación
args.data.tenant_ids = [tenantId]
```

**Modelos Principales (80+ tablas):**
- Usuarios y roles: `sysUser`, `role`, `user_status`
- RestauraCore del Sistema (Genéricos):**
- **Usuarios y roles**: `sysUser`, `role`, `user_status`, `user_profile`
- **Permisos**: `permission_definition`, `role_permissions`, `user_permissions`, `policies`
- **Transacciones**: `transaction`, `transactionStatus`, `payment_reference`
- **Agentes IA**: `agent`, `agent_version`, `agent_status`
- **Mensajería**: `messagelogs`, `messaging`
- **Autenticación**: `user_sessions`, `api_keys`, `rate_limit_log`
- **Seguridad**: `ip_whitelist`, `ip_blacklist`, `audit_permission_log`
- **Sistema**: `feature_flags`, `taxtype`, `paymentType`, `paymentStatus`
- **Integraciones**: `stripe_connect_accounts`, `webhook_logs`
- **WebSockets**: `websocket_connections`
- **Ubicaciones**: `country`, `state`, `city`

> **Nota**: El sistema es completamente extensible. Puedes agregar tus propios modelos específicos del dominio sin modificar el core.
📁 `src/shared/database/firestore.service.ts`

**Uso:**
- Logs de mensajería en tiempo real
- Historial de conversaciones
- Datos temporales y volátiles

#### **8.3 Multi-Tenant Prisma Service**
📁 `src/shared/database/multi-tenant-prisma.service.ts`

**Características:**
- Pool de conexiones por tenant (schema)
- Context service para request-scoped tenant
- Validación de tenants con cache

---

### **9. SISTEMA SSL/HTTPS**

**Estado Actual:** ⚠️ NO CONFIGURADO

El sistema NO tiene configuración de SSL/certificados en el código.

**Implementación en Producción:**
- SSL/TLS manejado por proxy reverso (Nginx, Traefik, GCP Load Balancer)
- Certificados Let's Encrypt o managed certificates de GCP
- Aplicación escucha en HTTP (puerto 3000)
- Terminación SSL en el balanceador/proxy

**Recomendación:**
Para desarrollo local con HTTPS, agregar en `main.ts`:
```typescript
const httpsOptions = {
  key: fs.readFileSync('./secrets/private-key.pem'),
  cert: fs.readFileSync('./secrets/public-cert.pem'),
};
const app = await NestFactory.create(AppModule, { httpsOptions });
```

---

### **10. SISTEMA DE PAGOS (STRIPE)**
📁 `src/shared/integrations/payments/`

**Módulos:**
- `core/`: Servicios principales de Stripe
- `paymentType/`: Tipos de pago
- `paymentStatus/`: Estados de pago
- `transaction/`: Transacciones
- `transactionStatus/`: Estados de transacciones

**Características:**
- Stripe Connect para marketplace
- Webhooks configurados (onboarding, payments)
- Procesamiento de raw body para validación de firma
- Tracking de payouts y transferencias
- Refunds y ajustes

**Tablas Relacionadas:**
- `unified_payments`: Pagos unificados
- `payment_order`: Órdenes de pago
- `stripe_connect_accounts`: Cuentas conectadas
- `scheduled_transfers`: Transferencias programadas
- `webhook_logs`: Logs de webhooks

---

### **11. INTEGRACIONES EXTERNAS**

#### **11.1 Twilio**
- SMS y mensajería
- WhatsApp Business API
- Validación de números
- Webhooks para respuestas

#### **11.2 Gmail API**
📁 `src/shared/integrations/gmail/`
- OAuth2 authentication
- Envío de correos
- Lectura de bandeja de entrada
- Gestión de credenciales

#### **11.3 Google Cloud Platform**
- **Storage**: Almacenamiento de archivos (facturas, imágenes)
- **Secret Manager**: Gestión de secretos y API keys
- **Firestore**: Base de datos NoSQL
- **Vertex AI**: Modelos de IA (Gemini, PaLM)

---

### **12. SISTEMA DE INTELIGENCIA ARTIFICIAL**

**Paquetes Propios (@askaia):**
- `@askaia/agent-llm-base`: Base para agentes LLM
- `@askaia/agent-memory`: Sistema de memoria para agentes
- `@askaia/agent-orchestration`: Orquestación de agentes
- `@askaia/agent-repository`: Repositorio de agentes
- `@askaia/agent-types`: Tipos TypeScript compartidos

**Frameworks:**
- **LangChain v0.3.23**: Framework principal de IA
- **LangGraph v0.2.74**: Grafos de ejecución de agentes
- **LangSmith v0.2.15**: Monitoreo y debugging de LLM

**Proveedores LLM:**
- OpenAI (GPT-4, GPT-3.5)
- Anthropic Claude
- Google Vertex AI (Gemini)
Framework de Agentes (Extensible):**
- Sistema base para crear agentes personalizados
- Memoria persistente por conversación
- Orquestación multi-agente
- Integración con múltiples LLMs
- Repositorio de prompts y herramientas

**Ejemplos de Agentes (Configurables):**
- Document Processor
- Customer Service Agent
- Data Analyzer
- Report Generator
- Workflow Automationt
- Customer Service Agent

---

### **13. SCHEDULER Y TAREAS PROGRAMADAS**
📁 `src/shared/core/services/scheduler/`

**Características:**
- `@nestjs/schedule` para cron jobs
- `SchedulerManagerService`: Gestión centralizada
- `SchedulerManagerController`: API de control

**Funcionalidades:**
- Programar tareas recurrentes
- Ejecutar tareas puntuales
- Listar tareas activas
- Cancelar tareas
- Estado de la cola de notificaciones

---

### **14. MULTI-TENANCY (MULTI-TENANT)**
📁 `src/shared/core/multi-tenancy.module.ts`

**Componentes:**
- `SchemaContextService`: Contexto por request
- `TenantValidatorService`: Validación y cache de tenants
- `RestaurantSchemaInterceptor`: Interceptor global para validación
- `MultiTenantPrismaService`: Pool de conexiones por schema

**Funcionamx-tenant-id` con identificador del tenant (o legacy `restaurantsub`)
2. Validación con cache en Redis
3. Almacenamiento en contexto global por request
4. Auto-filtrado en Prisma por `tenant_ids`

**Tenant Context:**
```typescript
(global as any).currentRequest = {
  selectedTenant: {
    database_connection: 'tenant_schema_name',
    tenantId: 'tenant_uuid',
    name: 'Tenant Name'
  }
}
```

**Configuración de Tenant:**
```typescript
// En headers de request
headers: {
  'x-tenant-id': 'tenant-uuid-or-subdomain',
  'Authorization': 'Bearer jwt-token' // ... otros datos
  }
}
```

---

### **15. SISTEMA DE ARCHIVOS (Google Cloud Storage)**
📁 `src/shared/services/google-cloud-storage/`

**Funcionalidades:**
- Upload de archivos
- Generación de URLs firmadas
- Eliminación de archivos
- Listado de archivos en bucket
- Configuración de permisos públicos/privados

**Buckets:**
- Archivos públicos: `storage.googleapis.com/{bucket}/{path}`
- Archivos privados: URLs firmadas con expiración

---

### **16. SISTEMA DE PDF**
📁 `src/shared/core/pdf/`

**Características:**
- Generación de PDFs con Puppeteer
- Templates HTML personalizables
- Facturas de catering
- Reportes de órdenes
- Comprobantes de pago

---

### **17. CIRCUIT BREAKER Y RESILIENCIA**

**Implementación:**
- Librería `opossum` v8.4.0
- Timeout configurable
- Threshold de errores
- Fallback automático
- Logs de estado

**Integrado en:**
- ServiceCache
- Llamadas HTTP externas
- Servicios de terceros

---

### **18. INTERCEPTORES Y MIDDLEWARE**

**Interceptores Globales:**
1. `AnswerInterceptor`: Formato estándar de respuestas
2. `RestaurantSchemaInterceptor`: Multi-tenancy
3. `GlobalExceptionFilter`: Manejo de errores

**Middleware:**
1. `ResponseTimeMiddleware`: Medir tiempo de respuesta
2. `SwaggerAuthMiddleware`: Protección de documentación
3. Cookie Parser: Manejo de cookies

---

### **19. VALIDACIÓN Y DTOs**

**Configuración:**
- `class-validator`: Validación de datos
- `class-transformer`: Transformación de objetos
- `whitelist: true`: Solo propiedades declaradas
- `forbidNonWhitelisted: true`: Rechazar propiedades extra

**DTOs Principales:**
- Authentication: Login, Register, Token Refresh
- Users: Create, Update, Filter, Pagination
- Orders: Create, Update, Status
- Payments: Process, Refund, Transfer
- Messaging: Email, SMS, WhatsApp, Push

---

### **20. CORS Y SEGURIDAD**

**Orígenes Permitidos (Configurables):**
- Dominios de producción (configurables en .env)
- Subdominios de staging/sandbox
- Desarrollo local: `http://localhost:*`, `http://127.0.0.1:*`

**Headers Permitidos:**
- `Authorization`: JWT Bearer token
- `x-tenant-id`: Identificador del tenant (genérico)
- `app-version`: Versión de la aplicación cliente
- `x-api-key`: API Key para autenticación alternativa
- Estándar: Content-Type, Origin, Accept, etc.

**Métodos:**
- GET, POST, PUT, DELETE, PATCH, OPTIONS

---

### **21. DOCKER Y CONTENEDORES**

**Dockerfile Multi-stage:**
1. **Base**: Node 22.14 Alpine
2. **Deps**: Instalación de dependencias + Chromium
3. **Builder**: Compilación de TypeScript
4. **Runner**: Imagen final optimizada

**Características:**
- Puppeteer con Chromium del sistema
- Autenticación npm para paquetes privados
- Prisma Client generado en build
- Health checks configurados

**Docker Compose:**
- Solo aplicación (sin DB ni Redis incluidos)
- Variables de entorno externas
- Volúmenes para uploads y public
- Health check con timeout

---

### **22. VARIABLES DE ENTORNO REQUERIDAS**

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/database
DATABASE_URL_DEV=postgresql://...

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=optional
REDIS_USERNAME=optional
REDIS_TLS=false

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLIC_KEY=pk_...

# Twilio
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
TWILIO_WHATSAPP_NUMBER=whatsapp:+1...

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=yourpassword
SMTP_FROM=noreplapp-uploads
GCS_UPLOAD_PATH=uploadsm

# Google Cloud
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
GCS_BUCKET_NAME=your-bucket
FIRESTORE_PROJECT_ID=your-project

# OpenAI
OPENAI_API_KEY=sk-...

# Claude (Anthropic)
CLAUDE_API_KEY=sk-ant-...

# App
NODE_ENV=
APP_NAME=your-app-name
X_TENANT_HEADER=x-tenant-idproduction|development
PORT=3000
```

---

## 📊 ESTADÍSTICAS DEL PROYECTO
### **Core del Framework:**
- **Módulos Core NestJS:** 15+
- **Servicios Genéricos:** 30+
- **Controladores Base:** 10+
- **Guards:** 4 (JWT, Roles, Permissions, Rate Limit)
- **Interceptores:** 3 (Response, Multi-tenant, Error)
- **Middleware:** 3 (Response Time, Auth, Tenant)
- **Tablas Core:** 30+ (extensibles)
- **Sistema de Permisos:** RBAC + ABAC + PBAC completo

### **Funcionalidades Incluidas:**
- ✅ Multi-tenancy automático
- ✅ Sistema de autenticación JWT completo
- ✅ RBAC/ABAC/PBAC con 30+ decoradores
- ✅ Cache Redis multi-tenant
- ✅ Mensajería multi-canal (Email/SMS/WhatsApp/Push)
- ✅ WebSockets con Socket.IO
- ✅ Event Bus interno
- ✅ Circuit Breaker pattern
- ✅ Rate Limiting
- ✅ IP Whitelist/Blacklist
- ✅ Feature Flags
- ✅ API Keys
- ✅ Auditoría completa
- ✅ Integración Stripe
- ✅ Google Cloud (Storage, Firestore, Vertex AI)
- ✅ Framework de Agentes IA (LangChain)0+
- **Paquetes npm:** 70+

---

## 🚀 COMANDOS PRINCIPALES

```bash
# Desarrollo
npm run start:dev           # Modo watch
npm run start:debug         # Con debugger

# Producción
npm run build               # Compilar
npm run start:prod          # Iniciar compilado

# Base de Datos
npm run db:generate         # Generar Prisma Client
npm run db:pull             # Sincronizar schema desde DB

Estas tablas son compartidas entre todos los tenants:
- **Ubicaciones**: `state`, `city`, `country`
- **Sistema**: `role`, `user_status`, `permission_definition`
- **Pagos**: `paymentType`, `paymentStatus`, `transactionStatus`
- **IA**: `agent_status`
- **Impuestos**: `taxtype`
- **Operadores**: `rule_operator`, `rule_connector`, `operator_application_type`
- **Permisos legacy**: `permissions`, `module`, `actions` (para backward compatibility)
npm run lint                # ESLint
npm run format              # Prettier
```

---

## 📝 NOTAS IMPORTANTES

### **Ts:
  - tenant123:records:list:page=1:limit=10
  - tenant456:users:profile:userId=789
  - global:config:features*
- `state`, `city`, `role`, `user_status`, `restaurant`
- `paymentType`, `paymentStatus`, `orderStatus`, `transactionStatus`
- `agent_status`, `item_type`, `group_item_type`, `taxtype`
- `rule_operator`, `rule_connector`, `operator_application_type`
- `order_deletion_reason`, `dietary_restriction`
- `permissions`, `module`, `actions`

### **Tenant ID:**
- Formato: Array de strings `tenant_ids: String[]`
- Default: `["development"]`
- Se propaga automáticamente en todas las queries
 (genéricos)
eventBus.emit('user:login', userData)
eventBus.emit('record:created', recordData)
eventBCÓMO USAR ESTE FRAMEWORK

### **1. Configuración Inicial**
```bash
# Clonar el repositorio
git clone <repo-url>

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Generar Prisma Client
npm run db:generate
## 🌟 CARACTERÍSTICAS PRINCIPALES DEL FRAMEWORK

### **🔐 Sistema de Permisos Enterprise**
- RBAC (Role-Based Access Control)
- ABAC (Attribute-Based Access Control)
- PBAC (Policy-Based Access Control)
- 30+ decoradores listos para usar
- Permisos granulares por recurso:acción:scope
- Denegaciones explícitas
- Políticas temporales y condicionales

### **🏢 Multi-Tenancy Robusto**
- Aislamiento automático por tenant_ids
- Cache por tenant
- Validación con fallback
- Contexto por request
- Sin configuración manual

### **🚀 Performance**
- Prisma Accelerate ready
- Redis cache con TTL configurable
- Circuit Breaker pattern
- Connection pooling
- Query optimization automática

### **📨 Comunicación Omnicanal**
- Email (SMTP/Gmail)
- SMS (Twilio)
- WhatsApp Business
- Push Notifications (Firebase)
- WebSockets en tiempo real

### **🤖 IA Integrada**
- LangChain + LangGraph
- Multi-LLM (OpenAI, Claude, Gemini)
- Sistema de memoria persistente
- Orquestación de agentes
- Repositorio de herramientas

### **🔒 Seguridad Completa**
- JWT con refresh tokens
- API Keys
- Rate Limiting
- IP Whitelist/Blacklist
- Auditoría de permisos
- Sesiones rastreables

---

## 📝 LICENCIA Y USO

Este es un framework base genérico para aplicaciones SaaS multi-tenant. Puedes:
- ✅ Usar para proyectos comerciales
- ✅ Modificar según necesidades
- ✅ Extender con tus propios módulos
- ✅ Adaptar a cualquier dominio de negocio

**No incluye lógica de negocio específica** - Es completamente agnóstico del dominio.

---

**Documento actualizado el 11 de enero de 2026**  
**Versión del Framework:** 2.0.0 (Genérico)
# Ejecutar migraciones
npx prisma db push
```

### **2. Agregar Tu Dominio de Negocio**
```typescript
// 1. Define tus modelos en prisma/schema.prisma
model YourEntity {
  id          Int      @id @default(autoincrement())
  name        String
  tenant_ids  String[] @default(["development"])
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt
}

// 2. Crea tu módulo
@Module({
  controllers: [YourEntityController],
  providers: [YourEntityService],
})
export class YourEntityModule {}

// 3. Usa el sistema de permisos
@RequirePermission('your-entity:read')
@Get()
async findAll() {
  return this.service.findAll();
}
```

### **3. Próximos Pasos Recomendados**

1. ✅ **Framework base funcionando**: Todos los módulos core activos
2. 📦 **Agregar modelos específicos**: Define tu esquema de datos
3. 🔐 **Configurar permisos**: Seed data con tus permisos
4. 🎨 **Personalizar**: Frontend, emails, notificaciones
5. ⚠️ **SSL/HTTPS**: Configurar en producción con proxy reverso
6. 📊 **Monitoreo**: APM (New Relic, Datadog, etc.)
7. 🔍 **Logs**: Winston + Elasticsearch
8. 🧪 **Tests**: Cobertura de tu lógica de negocio
9. 📦 **CI/CD**: Pipeline automatizado
10. 🌍 **i18n**: Multi-idioma si es necesario
eventBus.emit(UserLoginEvent, userData)

// Tuple events
eventBus.emit([OrderService, 'created'], orderData)
```

---

## 🎯 PRÓXIMOS PASOS RECOMENDADOS

1. ✅ **Sistema funcionando**: Todos los módulos activos
2. ⚠️ **SSL/HTTPS**: Configurar en producción con proxy reverso
3. 📊 **Monitoreo**: Implementar APM (New Relic, Datadog, etc.)
4. 🔍 **Logs**: Centralizar con Winston + Elasticsearch
5. 🧪 **Tests**: Aumentar cobertura de tests
6. 📚 **Documentación**: Expandir docs de agentes IA
7. 🔐 **Seguridad**: Auditoría de seguridad completa
8. ⚡ **Performance**: Optimizar queries Prisma más pesadas
9. 📦 **CI/CD**: Pipeline automatizado completo
10. 🌍 **i18n**: Internacionalización multi-idioma

---

**Documento generado el 11 de enero de 2026**
