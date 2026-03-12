# 🎛️ SISTEMA DE CACHE UNIFICADO

**Fecha**: 12 de enero de 2026  
**Estado**: ✅ **IMPLEMENTADO**  
**Versión**: 2.0

---

## 📋 RESUMEN

Se ha consolidado el sistema de cache en un **único controlador centralizado** que reemplaza los dos controladores anteriores duplicados:

- ❌ ~~Cache Control Panel~~ (DEPRECATED)
- ❌ ~~03 - Cache Management~~ (DEPRECATED)
- ✅ **01 - Cache Management (Unified)** (NUEVO)

---

## 🎯 PROBLEMA RESUELTO

### Antes (Duplicación):

```
🎛️ Cache Control Panel
├── Dashboard
├── Stats
├── Keys (búsqueda por módulo/tenant)
├── Clear (por módulos)
└── Quick Actions

03 - Cache Management
├── Stats (duplicado)
├── Keys (lista simple)
├── Get value
├── Set value
├── Clear (por pattern)
└── Delete key/pattern
```

**Problemas:**
- ❌ Funcionalidades duplicadas
- ❌ Inconsistencia en responses
- ❌ Sin soporte para organizations/teams
- ❌ Confusión sobre cuál usar

### Después (Unificado):

```
01 - Cache Management (Unified)
├── 📊 DASHBOARD & MONITORING
│   ├── Dashboard completo (tenant/org/team/module)
│   └── Estadísticas detalladas
│
├── 🔍 SEARCH & INSPECT
│   ├── Búsqueda avanzada con filtros
│   └── Inspector de valores
│
├── 🧹 CLEAR OPERATIONS
│   ├── Control avanzado de limpieza
│   ├── Por tenant
│   ├── Por organization
│   ├── Por team
│   ├── Por módulo
│   ├── Por clave específica
│   └── Por pattern
│
├── ⚡ QUICK ACTIONS
│   ├── Limpiar mi tenant
│   └── Limpiar namespace default
│
└── 🛠️ UTILITY OPERATIONS
    ├── Listar módulos
    ├── Listar tenants
    ├── Listar organizations
    ├── Listar teams
    └── Set cache value
```

**Ventajas:**
- ✅ Todo en un solo lugar
- ✅ Soporte multi-nivel (tenant/org/team)
- ✅ API consistente
- ✅ Documentación completa
- ✅ Filtros avanzados

---

## 🏗️ ARQUITECTURA DE CLAVES

### Formato de Claves Redis

El sistema usa una estructura jerárquica para las claves:

```
tenant_sub:module:action:params
tenant_sub:org:org_id:module:action:params
tenant_sub:org:org_id:team:team_id:module:action:params
```

### Ejemplos:

```redis
# Nivel Tenant
550e8400-e29b-41d4-a716-446655440000:order:findAll

# Nivel Organization
550e8400-e29b-41d4-a716-446655440000:org:org-123:customer:findById:456

# Nivel Team
550e8400-e29b-41d4-a716-446655440000:org:org-123:team:team-alpha:menu:list

# Legacy (namespace default)
default:getOrdersByMonthAndBranches
```

---

## 🔑 ENDPOINTS PRINCIPALES

### 1. 📊 Dashboard Completo

**Endpoint**: `GET /api/cache/dashboard`

**Descripción**: Vista completa del estado del cache

**Response**:
```json
{
  "memory": {
    "used": "45MB",
    "connected": true
  },
  "stats": {
    "totalKeys": 158,
    "byTenant": {
      "tenant-1": 45,
      "tenant-2": 67
    },
    "byOrganization": {
      "org-1": 78,
      "org-2": 80
    },
    "byTeam": {
      "team-alpha": 34,
      "team-beta": 56
    },
    "byModule": {
      "order": 45,
      "customer": 23,
      "menu": 18
    }
  },
  "modules": ["order", "customer", "menu"],
  "tenants": ["tenant-1", "tenant-2"],
  "organizations": ["org-1", "org-2"],
  "teams": ["team-alpha", "team-beta"],
  "timestamp": "2026-01-12T14:30:00Z"
}
```

---

### 2. 🔍 Búsqueda Avanzada

**Endpoint**: `GET /api/cache/keys`

**Query Parameters**:
- `tenantId` (opcional): UUID del tenant
- `organizationId` (opcional): UUID de la organización
- `teamId` (opcional): UUID del equipo
- `module` (opcional): Nombre del módulo
- `pattern` (opcional): Pattern personalizado con wildcards
- `limit` (opcional): Límite de resultados

**Ejemplos**:

```bash
# Todas las claves de un tenant
GET /api/cache/keys?tenantId=550e8400-e29b-41d4-a716-446655440000

# Claves de order de un tenant
GET /api/cache/keys?tenantId=550e8400-e29b-41d4-a716-446655440000&module=order

# Claves de una organization
GET /api/cache/keys?organizationId=org-123

# Claves de un team
GET /api/cache/keys?teamId=team-alpha

# Pattern personalizado
GET /api/cache/keys?pattern=*:findById:*

# Combinaciones
GET /api/cache/keys?tenantId=tenant-1&module=customer&limit=50
```

---

### 3. 🧹 Limpieza Selectiva

**Endpoint**: `POST /api/cache/clear`

**Body**: ClearModuleCacheDto

**Ejemplos**:

#### Por Módulos (Recomendado)
```json
{
  "modules": ["order", "customer"]
}
```

#### Por Tenant
```json
{
  "tenantId": "550e8400-e29b-41d4-a716-446655440000",
  "modules": ["menu"]
}
```

#### Por Organization
```json
{
  "organizationId": "org-123"
}
```

#### Por Team
```json
{
  "teamId": "team-alpha"
}
```

#### Pattern Personalizado
```json
{
  "customPattern": "*:order:findAll*"
}
```

#### Limpiar TODO (⚠️ PELIGROSO)
```json
{
  "clearAll": true
}
```

---

### 4. 🏢 Limpieza por Tenant

**Endpoint**: `DELETE /api/cache/tenant/:tenantId`

**Descripción**: Elimina TODAS las claves de un tenant

**Ejemplo**:
```bash
DELETE /api/cache/tenant/550e8400-e29b-41d4-a716-446655440000
```

---

### 5. 🏛️ Limpieza por Organization

**Endpoint**: `DELETE /api/cache/organization/:organizationId`

**Descripción**: Elimina TODAS las claves de una organización

**Ejemplo**:
```bash
DELETE /api/cache/organization/org-123
```

---

### 6. 👥 Limpieza por Team

**Endpoint**: `DELETE /api/cache/team/:teamId`

**Descripción**: Elimina TODAS las claves de un equipo

**Ejemplo**:
```bash
DELETE /api/cache/team/team-alpha
```

---

### 7. 📦 Limpieza por Módulo (Global)

**Endpoint**: `DELETE /api/cache/module/:module`

**Descripción**: Elimina un módulo en TODOS los tenants

**⚠️ PRECAUCIÓN**: Afecta a todo el sistema

**Ejemplo**:
```bash
DELETE /api/cache/module/order
```

---

### 8. 🔑 Eliminar Clave Específica

**Endpoint**: `DELETE /api/cache/key/:key`

**Descripción**: Elimina una clave específica

**Ejemplo**:
```bash
DELETE /api/cache/key/tenant-1:order:findById:123
```

---

### 9. 🎯 Eliminar por Pattern

**Endpoint**: `DELETE /api/cache/pattern/:pattern`

**Descripción**: Elimina todas las claves que coincidan con el pattern

**Ejemplos**:
```bash
# Todos los findById
DELETE /api/cache/pattern/*:findById:*

# Todas las órdenes del tenant-1
DELETE /api/cache/pattern/tenant-1:order:*

# Todos los teams de org-123
DELETE /api/cache/pattern/*:org:org-123:team:*
```

---

### 10. ⚡ Acciones Rápidas

#### Limpiar Mi Tenant
**Endpoint**: `POST /api/cache/quick/clear-my-tenant`

Detecta automáticamente tu tenant y limpia todo su cache.

#### Limpiar Namespace Default
**Endpoint**: `POST /api/cache/quick/clear-default-namespace`

Limpia el namespace "default" (cache legacy).

---

## 🛠️ ENDPOINTS DE UTILIDAD

### Listar Módulos
```bash
GET /api/cache/modules
```

### Listar Tenants
```bash
GET /api/cache/tenants
```

### Listar Organizations
```bash
GET /api/cache/organizations
```

### Listar Teams
```bash
GET /api/cache/teams
```

### Obtener Valor de Clave
```bash
GET /api/cache/get/:key
```

### Establecer Valor
```bash
POST /api/cache/set
Body: {
  "key": "test_key",
  "value": { "data": "test" },
  "ttl": 3600
}
```

---

## 📊 CASOS DE USO

### Caso 1: Limpiar cache de un módulo para mi tenant

```bash
POST /api/cache/clear
{
  "modules": ["order"]
}
```

✅ Limpia solo las órdenes de tu tenant actual

---

### Caso 2: Limpiar cache de una organization

```bash
DELETE /api/cache/organization/org-123
```

✅ Limpia todo el cache de la organization (incluye todos sus teams)

---

### Caso 3: Limpiar cache de un team específico

```bash
DELETE /api/cache/team/team-alpha
```

✅ Limpia solo el cache del team-alpha

---

### Caso 4: Buscar claves de customer en una org

```bash
GET /api/cache/keys?organizationId=org-123&module=customer
```

✅ Retorna todas las claves de customers de la org-123

---

### Caso 5: Eliminar todos los findById de todo el sistema

```bash
DELETE /api/cache/pattern/*:findById:*
```

⚠️ Elimina todos los findById de todos los módulos y tenants

---

### Caso 6: Ver dashboard completo

```bash
GET /api/cache/dashboard
```

✅ Vista completa del estado del cache por tenant/org/team/módulo

---

## 🔄 MIGRACIÓN

### Controladores Deprecados

Los siguientes controladores están marcados como **DEPRECATED** pero se mantienen para compatibilidad:

#### 🛠️ Cache Control Panel (DEPRECATED)
- Endpoint: `/cache-management/*`
- Tag: `🛠️ Cache Control Panel (DEPRECATED)`
- **Reemplazado por**: UnifiedCacheController

#### 03 - Cache Management (DEPRECATED)
- Endpoint: `/api/cache/*` (compartido con nuevo)
- Tag: `03 - Cache Management (DEPRECATED)`
- **Reemplazado por**: UnifiedCacheController

### Plan de Migración

1. **Fase 1 (Actual)**: Ambos sistemas disponibles
2. **Fase 2 (1 mes)**: Deprecation warnings en logs
3. **Fase 3 (2 meses)**: Eliminar controladores antiguos

### Tabla de Equivalencias

| Antiguo | Nuevo |
|---------|-------|
| `GET /cache-management/dashboard` | `GET /api/cache/dashboard` |
| `GET /cache-management/stats` | `GET /api/cache/stats` |
| `GET /cache-management/keys` | `GET /api/cache/keys` (con más filtros) |
| `POST /cache-management/clear` | `POST /api/cache/clear` (más opciones) |
| `GET /api/cache/keys?limit=100` | `GET /api/cache/keys?limit=100` |
| `GET /api/cache/get/:key` | `GET /api/cache/get/:key` |
| `DELETE /api/cache/clear` | `POST /api/cache/clear` |
| `DELETE /api/cache/delete/:key` | `DELETE /api/cache/key/:key` |

---

## 🧪 TESTING

### Test 1: Dashboard Completo
```bash
curl -X GET http://localhost:3000/api/cache/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Resultado esperado**: JSON con stats por tenant/org/team/module

---

### Test 2: Búsqueda por Tenant
```bash
curl -X GET "http://localhost:3000/api/cache/keys?tenantId=550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Resultado esperado**: Lista de claves del tenant

---

### Test 3: Limpiar Organization
```bash
curl -X DELETE http://localhost:3000/api/cache/organization/org-123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Resultado esperado**:
```json
{
  "success": true,
  "message": "Organization org-123 cache cleared",
  "keysDeleted": 78
}
```

---

### Test 4: Limpiar Team
```bash
curl -X DELETE http://localhost:3000/api/cache/team/team-alpha \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Resultado esperado**:
```json
{
  "success": true,
  "message": "Team team-alpha cache cleared",
  "keysDeleted": 34
}
```

---

## 🎯 VENTAJAS DEL SISTEMA UNIFICADO

### 1. Centralización ✅
- Todo en un solo lugar
- No más confusión sobre qué endpoint usar
- Documentación unificada

### 2. Multi-Nivel ✅
- Soporte para **tenant**
- Soporte para **organization**
- Soporte para **team**
- Soporte para **módulo**
- Soporte para **claves específicas**

### 3. Filtros Avanzados ✅
- Combinación de filtros
- Patterns personalizados
- Búsquedas precisas

### 4. Visibilidad Completa ✅
- Dashboard con estadísticas por nivel
- Lista de tenants/orgs/teams activos
- Distribución por módulo
- Estado de memoria

### 5. Control Granular ✅
- Limpieza por tenant
- Limpieza por organization
- Limpieza por team
- Limpieza por módulo
- Limpieza por clave
- Limpieza por pattern

### 6. Seguridad ✅
- Requiere autenticación JWT
- Validación de permisos
- Logs de operaciones
- Confirmaciones para acciones peligrosas

---

## 📚 ARQUITECTURA TÉCNICA

### Controlador: UnifiedCacheController

**Ubicación**: `src/shared/cache/controllers/unified-cache.controller.ts`

**Dependencias**:
- `CacheManagementService`: Servicios del controlador anterior
- `CacheAdminService`: Servicios del admin controller

**Características**:
- Combina funcionalidades de ambos servicios
- Añade soporte para organizations y teams
- Métodos helpers para análisis de claves
- Respuestas consistentes

### Servicios Utilizados

#### CacheManagementService
- `getCacheStats()`: Estadísticas por tenant/módulo
- `getAvailableModules()`: Lista de módulos
- `getCacheKeys()`: Búsqueda de claves
- `clearCache()`: Limpieza selectiva

#### CacheAdminService
- `getCacheStats()`: Estadísticas de Redis
- `listAllKeys()`: Lista completa de claves
- `getCacheValue()`: Obtener valor
- `setCacheValue()`: Establecer valor
- `deleteCacheKey()`: Eliminar clave
- `deleteByPattern()`: Eliminar por pattern
- `findKeysByPattern()`: Buscar por pattern

---

## 🚀 PRÓXIMOS PASOS

### Fase 1: Monitoreo (Actual)
- ✅ Sistema implementado
- ✅ Controladores deprecated marcados
- ✅ Documentación completa

### Fase 2: Adopción (1 mes)
- Migrar uso interno a nuevo controlador
- Añadir logs de deprecation
- Comunicar cambios a equipo

### Fase 3: Limpieza (2 meses)
- Eliminar controladores antiguos
- Actualizar tests
- Limpiar código legacy

---

## 📝 NOTAS IMPORTANTES

### ⚠️ Precauciones

1. **clearAll**: Solo usar en desarrollo, nunca en producción
2. **clearModule**: Afecta a TODOS los tenants
3. **deleteByPattern**: Revisar pattern antes de ejecutar
4. **Organizations/Teams**: Verificar que existen antes de limpiar

### 💡 Mejores Prácticas

1. Usar filtros específicos en lugar de patterns amplios
2. Verificar con `GET /api/cache/keys` antes de limpiar
3. Usar acciones rápidas para casos comunes
4. Consultar dashboard antes de limpieza masiva
5. Documentar razones de limpieza en producción

### 🔍 Debugging

Si algo no funciona:
1. Verificar autenticación JWT
2. Revisar permisos de usuario
3. Consultar logs de Redis
4. Usar `/api/cache/get/:key` para inspeccionar
5. Verificar formato de claves en Redis

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- ✅ UnifiedCacheController creado
- ✅ Controladores antiguos deprecated
- ✅ CacheModule actualizado
- ✅ Tags de Swagger actualizados
- ✅ Sin errores de compilación
- ✅ Soporte multi-nivel (tenant/org/team)
- ✅ Documentación completa
- ✅ Ejemplos de uso

---

## 🎉 RESULTADO FINAL

**El sistema de cache ahora está completamente centralizado y unificado** ✅

### Mejoras Implementadas:
- ✅ Un solo controlador en lugar de dos duplicados
- ✅ Soporte para tenant/organization/team
- ✅ Dashboard completo con estadísticas multi-nivel
- ✅ Búsqueda y filtrado avanzado
- ✅ Limpieza granular por nivel
- ✅ API consistente y documentada
- ✅ Acciones rápidas para casos comunes

**Sistema listo para uso en producción** 🚀

---

**Última actualización**: 12 de enero de 2026, 3:00 PM  
**Implementado por**: GitHub Copilot (Claude Sonnet 4.5)  
**Versión**: 2.0 (Unified Cache System)
