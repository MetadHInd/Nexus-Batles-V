# GALATEA Core Backend - Documentación Completa para AI Context

## Información General del Proyecto

**Nombre:** GALATEA Core Backend  
**Tecnologías:** NestJS, Prisma ORM, PostgreSQL, Prisma Accelerate, TypeScript  
**Base de Datos:** PostgreSQL con 60+ modelos de datos  
**Optimización:** Prisma + Accelerate (reducción de latencia de 52s a ~350ms)  
**Status:** Producción - Enterprise Grade  

## Arquitectura de Alto Nivel

### Stack Tecnológico
- **Framework:** NestJS con decoradores y dependency injection
- **Base de Datos:** PostgreSQL con Prisma ORM 6.6.0
- **Cache/Performance:** Prisma Accelerate 2.0.2 para optimización de queries
- **Cache System:** Redis para cache distribuido
- **AI/ML:** Pinecone para vectores, OpenAI/Gemini para LLMs
- **Mensajería:** Sistema multichannel (Email SMTP, SMS, Push OneSignal, WhatsApp)
- **Pagos:** Stripe integration
- **Delivery:** WeKnock-ODIN integration
- **Auth:** JWT con roles y permisos
- **Memory:** Enhanced Memory Service con Pinecone

## Estructura del Proyecto

```
aia-core-backend/
├── src/
│   ├── shared/                    # Servicios y utilidades compartidas
│   │   ├── database/             # Configuración de base de datos
│   │   ├── core/                 # ServiceCache y servicios centrales
│   │   ├── cache/                # Sistema de cache Redis
│   │   ├── messaging/            # Sistema de mensajería multichannel
│   │   ├── integrations/         # Integraciones externas
│   │   ├── interceptors/         # Interceptores globales
│   │   └── utils/                # Utilidades compartidas
│   ├── modules/                  # Módulos de negocio específicos
│   │   ├── auth/                 # Autenticación y autorización
│   │   ├── user-profile/         # Gestión de perfiles de usuario
│   │   ├── branches/             # Gestión de sucursales
│   │   ├── menu/                 # Sistema de menús y items
│   │   ├── orders/               # Sistema de órdenes
│   │   ├── payments/             # Integración de pagos
│   │   ├── rules/                # Sistema de reglas de negocio
│   │   ├── delivery/             # Sistema de delivery
│   │   └── [otros módulos]/      # Módulos adicionales de negocio
│   ├── main.ts                   # Punto de entrada de la aplicación
│   └── app.module.ts            # Módulo principal
├── prisma/
│   └── schema.prisma            # Schema con 60+ modelos
└── [archivos de configuración]
```

## Sistema ServiceCache (CRÍTICO)

### Descripción
El ServiceCache es el núcleo arquitectónico que proporciona acceso centralizado a todos los servicios del sistema mediante un patrón de proxy/mixins.

### Ubicación
`src/shared/core/services/service-cache/`

### Componentes Principales

#### 1. ServiceCache Principal
**Archivo:** `service-cache.ts`  
**Función:** Proporciona acceso unificado a todos los subsistemas

```typescript
export const ServiceCache = {
  Database: DatabaseInterface,      // Acceso a Prisma con Accelerate
  Messaging: MessagingNamespace,    // Email, SMS, Push, WhatsApp
  Payments: PaymentsNamespace,      // Stripe integration
  Delivery: DeliveryNamespace       // WeKnock-ODIN integration
}
```

#### 2. Database Mixin (OPTIMIZADO)
**Archivo:** `mixins/database/database.mixin.ts`  
**Función:** Proporciona acceso optimizado a Prisma con Accelerate

**Uso típico en servicios:**
```typescript
// Acceso a cualquier modelo
await ServiceCache.Database.Prisma.sysUser.findUnique({...})
await ServiceCache.Database.Prisma.transactionStatus.findMany({...})
await ServiceCache.Database.Prisma.branch.count({...})
```

**Características:**
- 83 modelos disponibles automáticamente
- Prisma Accelerate habilitado (latencia ~350ms)
- Getters lazy para todos los modelos
- Compatibilidad completa con TypeScript

## Modelos de Base de Datos (Prisma Schema)

### Modelos Principales

#### Usuarios y Autenticación
- `sysUser` - Usuarios del sistema
- `user_status` - Estados de usuario
- `role` - Roles y permisos
- `sysUser_has_branch` - Relación usuario-sucursal

#### Restaurantes y Sucursales
- `restaurant` - Datos del restaurante
- `branch` - Sucursales
- `city`, `state`, `country` - Ubicaciones geográficas

#### Sistema de Menús
- `menu` - Menús principales
- `item` - Items/productos
- `menu_has_branch` - Menús por sucursal
- `item_has_menu_category` - Categorización de items
- `category_variation` - Variaciones de categorías
- `menu_item_category_variation_price` - Precios por variación

#### Sistema de Órdenes
- `order` - Órdenes principales
- `orderStatus` - Estados de órdenes
- `order_group` - Agrupación de órdenes
- `order_internal_status` - Estados internos
- `itemHasOrderByCategory` - Items por orden y categoría

#### Sistema de Reglas
- `menu_rules` - Reglas de menú
- `rule_operator` - Operadores de reglas
- `rule_assignment` - Asignaciones de reglas
- `rule_connector` - Conectores lógicos
- `menu_rule_violations` - Violaciones de reglas

#### Pagos y Transacciones
- `payment_order` - Órdenes de pago
- `paymentStatus` - Estados de pago
- `paymentType` - Tipos de pago
- `transaction` - Transacciones
- `transactionStatus` - Estados de transacción

#### Clientes
- `customer` - Datos de clientes
- `customerAddress` - Direcciones de clientes
- `customerSummary` - Resúmenes de clientes
- `dietary_restriction` - Restricciones dietéticas

### Vistas y Datos Calculados
- `complete_menu_view` - Vista completa de menús
- `v_order_summary` - Resumen de órdenes
- `v_final_item_prices` - Precios finales de items
- `view_applicable_tax_rates` - Tasas de impuestos aplicables

## Módulos de Negocio

### 1. Auth Module
**Ubicación:** `src/modules/auth/`  
**Funcionalidad:** 
- Autenticación JWT
- Sistema de roles y permisos
- Integración con servicio externo de auth
- Guards y strategies

### 2. User Profile Module  
**Ubicación:** `src/shared/core/user-profile/`  
**Funcionalidad:**
- Gestión de perfiles de usuario
- Cache de perfiles con Redis
- Validación de permisos por sucursal
- Manejo de roles múltiples

### 3. Branches Module
**Ubicación:** `src/modules/branches/`  
**Funcionalidad:**
- Gestión de sucursales
- Asociación usuario-sucursal
- Datos geográficos y ubicación

### 4. Menu Module
**Ubicación:** `src/modules/menu/`  
**Funcionalidad:**
- Gestión completa de menús
- Items y categorías
- Precios por sucursal
- Variaciones y componentes

### 5. Orders Module
**Ubicación:** `src/modules/orders/`  
**Funcionalidad:**
- Creación y gestión de órdenes
- Estados y workflow
- Agrupación de órdenes
- Cálculos de totales

### 6. Rules Module
**Ubicación:** `src/modules/rules/`  
**Funcionalidad:**
- Motor de reglas de negocio
- Validaciones de menú
- Operadores lógicos
- Sistema de violaciones

## Servicios Compartidos (Shared)

### 1. Database Service
**Archivo:** `src/shared/database/prisma.service.ts`  
**Función:** Servicio principal de base de datos con Prisma + Accelerate optimizado

### 2. Cache System
**Ubicación:** `src/shared/cache/`  
**Componentes:**
- `base-cache.service.ts` - Clase base para cache
- `redis-cache.service.ts` - Implementación Redis
- `cacheable.factory.ts` - Factory para objetos cacheables

### 3. Messaging System
**Ubicación:** `src/shared/messaging/`  
**Canales soportados:**
- **Email:** SMTP con Outlook/Gmail
- **SMS:** OneSignal/Twilio
- **Push:** OneSignal notifications
- **WhatsApp:** WhatsApp Business API

### 4. Integrations
**Ubicación:** `src/shared/integrations/`  
**Servicios externos:**
- **Payments:** Stripe integration completa
- **Delivery:** WeKnock-ODIN para delivery
- **AI/ML:** OpenAI, Gemini, Pinecone
- **Maps:** Google Maps API

## Patrones de Desarrollo

### 1. Acceso a Base de Datos
```typescript
// SIEMPRE usar ServiceCache.Database.Prisma
const user = await ServiceCache.Database.Prisma.sysUser.findUnique({
  where: { uuid: userUuid },
  include: {
    role: true,
    sysUser_has_branch: {
      include: { branch: true }
    }
  }
});
```

### 2. Cache Pattern
```typescript
// Servicios heredan de BaseCacheService
export class MyService extends BaseCacheService {
  async getData(id: number) {
    return await this.tryCacheOrExecute(
      'my_cache_key',
      { id },
      true, // useCache
      async () => {
        // Lógica para obtener datos
        return await ServiceCache.Database.Prisma.myModel.findUnique({...});
      }
    );
  }
}
```

### 3. Messaging Pattern
```typescript
// Usar ServiceCache.Messaging
await ServiceCache.Messaging.Email.sendEmail({
  to: 'user@example.com',
  template: 'welcome',
  data: { name: 'Usuario' }
});
```

## Variables de Entorno Críticas

### Base de Datos
```bash
# PRODUCCIÓN - Prisma Accelerate (OBLIGATORIO)
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=..."

# DESARROLLO - Conexión directa (fallback)
DATABASE_URL_DEV="postgres://user:pass@host:5432/db"
```

### Cache y Performance
```bash
REDIS_HOST=redis-host
REDIS_PORT=10178
REDIS_PASSWORD=password
```

### AI/ML Services
```bash
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AIza...
PINECONE_API_KEY=pcsk_...
PINECONE_INDEX_NAME=aia-core-prod
```

## Performance y Optimización

### Prisma Accelerate
- **Latencia:** ~350ms promedio (optimizado desde 52 segundos)
- **Cache automático:** Queries repetitivas cacheadas
- **Connection pooling:** Optimizado para concurrencia
- **Edge locations:** Reducción de latencia geográfica

### Redis Cache
- **TTL configurable:** Por tipo de datos
- **Invalidación inteligente:** Por dependencias
- **Serialización optimizada:** JSON comprimido

### Memory System
- **Enhanced Memory Service:** Gestión de memoria con Pinecone
- **Vector storage:** Para AI/ML features
- **Context management:** Para conversaciones

## Testing y Debugging

### Endpoints de Diagnóstico
```bash
# Verificar estado de Prisma + Accelerate
GET /fix/diagnose-database

# Test de performance
GET /fix/urgent-test

# Verificar modelos disponibles
GET /fix/list-models
```

### Logging
- **NestJS Logger:** Para servicios principales
- **Console debug:** Para debugging específico
- **Error tracking:** Con stack traces completos

## Consideraciones de Seguridad

### Autenticación
- **JWT tokens:** Con expiración y refresh
- **Role-based access:** Permisos granulares
- **Branch-level security:** Acceso por sucursal

### Validación
- **DTOs con class-validator:** Validación de inputs
- **Guards globales:** Protección de endpoints
- **Rate limiting:** Para APIs públicas

## Deployment y Escalabilidad

### Containerización
- **Docker:** Containerizado para deployment
- **Multi-stage builds:** Optimización de imagen
- **Health checks:** Monitoring de estado

### Escalabilidad
- **Horizontal scaling:** Múltiples instancias
- **Database optimization:** Con Prisma Accelerate
- **Cache distribution:** Redis cluster ready

---

## Patrones de Uso Común

### Crear un nuevo servicio
1. Extender `BaseCacheService` si necesita cache
2. Usar `ServiceCache.Database.Prisma` para acceso a DB
3. Implementar interfaces tipadas
4. Agregar logging apropiado

### Agregar un nuevo modelo
1. Actualizar `prisma/schema.prisma`
2. Ejecutar `prisma generate`
3. El modelo estará automáticamente disponible en `ServiceCache.Database.Prisma`

### Integrar nuevo servicio externo
1. Crear en `src/shared/integrations/`
2. Agregar al ServiceCache si es global
3. Configurar variables de entorno
4. Implementar error handling robusto

Esta documentación proporciona el contexto completo necesario para trabajar efectivamente con el AIA Core Backend.