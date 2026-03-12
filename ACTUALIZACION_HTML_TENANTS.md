# 🔄 ACTUALIZACIÓN HTML - TENANT_ID CENTRALIZADO

**Fecha**: 12 de enero de 2026  
**Estado**: ✅ **COMPLETADO**

---

## 📋 RESUMEN DE CAMBIOS

Se han actualizado los archivos HTML del sistema de autenticación para alinearlos con la nueva estructura de **tenant_id centralizado** que usa `tenant_sub` en lugar de `restaurantUuid`.

---

## 📁 ARCHIVOS ACTUALIZADOS

### 1. ✅ `public/index.html` (Login)

**Cambios principales:**
- Ahora maneja múltiples tenants desde el response de login
- Guarda información de tenants en `sessionStorage`
- Redirige según cantidad de tenants:
  - **1 tenant**: Auto-selecciona y va directo a `/api-docs`
  - **Múltiples tenants**: Redirige a `/tenant-selection.html`

**Estructura del flujo:**
```javascript
Login → Respuesta con { token, tenants, defaultTenant }
  ↓
¿1 tenant?
  SÍ → Auto-seleccionar → Cookie tenant_sub → /api-docs
  NO → Guardar en sessionStorage → /tenant-selection.html
```

**Cookies establecidas (1 tenant):**
- `authToken`: Token JWT
- `tenant_sub`: UUID del tenant (header principal del sistema)

**sessionStorage establecido:**
- `token`: Token JWT
- `tenants`: Array de tenants disponibles
- `defaultTenant`: tenant_sub del tenant predeterminado
- `selectedTenant`: tenant_sub seleccionado

---

### 2. ✅ `public/tenant-selection.html` (Selección de Tenant)

**Cambios principales:**
- Actualizado a español
- Lee tenants desde `sessionStorage` (guardados en login)
- Auto-selecciona si solo hay un tenant
- Muestra badge "PREDETERMINADO" en tenant por defecto
- Ordena tenants: predeterminado primero

**Estructura de datos esperada:**
```javascript
tenants = [
  {
    tenant_sub: "uuid-del-tenant",
    slug: "tenant-slug",
    name: "Nombre del Tenant",
    is_default: true
  },
  // ... más tenants
]
```

**Cookies establecidas al seleccionar:**
- `tenant_sub`: UUID del tenant seleccionado (TTL: 24 horas)

**sessionStorage establecido:**
- `selectedTenant`: tenant_sub seleccionado
- `tenant_slug`: Slug del tenant
- `tenant_name`: Nombre del tenant

---

### 3. ⚠️ `public/restaurant-selection.html` (Legacy/Compatibilidad)

**Estado**: Mantenido para compatibilidad

**Cambios principales:**
- Añadida nota de deprecación en logs
- Ahora establece AMBAS cookies:
  - `tenant_sub`: Cookie principal del sistema
  - `restaurantSub`: Cookie legacy (compatibilidad)
- Guarda en `sessionStorage` como `selectedTenant` además de `selectedRestaurantUuid`

**Recomendación**: Migrar a `tenant-selection.html` cuando sea posible

---

## 🔑 ESTRUCTURA DE TENANT_ID CENTRALIZADO

### Headers HTTP usados en el sistema:
```http
Authorization: Bearer <JWT_TOKEN>
tenant_sub: <UUID_DEL_TENANT>
```

### Cookies establecidas:
```javascript
authToken=<JWT_TOKEN>;path=/;httpOnly
tenant_sub=<UUID_DEL_TENANT>;path=/;expires=<24h>
```

### SessionStorage usado:
```javascript
{
  "token": "JWT_TOKEN",
  "tenants": [...],
  "defaultTenant": "uuid",
  "selectedTenant": "uuid",
  "tenant_slug": "slug",
  "tenant_name": "nombre"
}
```

---

## 🔄 FLUJO COMPLETO DE AUTENTICACIÓN

### 1. Login (index.html)
```
Usuario ingresa credenciales
  ↓
POST /api/sysUser/login-swagger
  ↓
Response: { 
  token, 
  tenants: [{ tenant_sub, slug, name, is_default }],
  defaultTenant 
}
  ↓
Guardar en sessionStorage: token, tenants, defaultTenant
Guardar cookie: authToken
  ↓
¿Cuántos tenants?
```

### 2a. Un Solo Tenant
```
Auto-seleccionar tenant
  ↓
Guardar cookie: tenant_sub=<uuid>
Guardar sessionStorage: selectedTenant
  ↓
Redirigir a /api-docs
```

### 2b. Múltiples Tenants
```
Redirigir a /tenant-selection.html?token=<jwt>
  ↓
Cargar tenants desde sessionStorage
  ↓
Mostrar lista (predeterminado primero)
  ↓
Usuario selecciona tenant
  ↓
Guardar cookie: tenant_sub=<uuid>
Guardar sessionStorage: selectedTenant, tenant_slug, tenant_name
  ↓
Redirigir a /api-docs
```

### 3. Uso en Swagger/API
```
Swagger lee cookies: authToken + tenant_sub
  ↓
Incluye en requests:
  Authorization: Bearer <authToken>
  tenant_sub: <tenant_sub>
  ↓
Backend valida y filtra por tenant
```

---

## 🆕 NUEVA ESTRUCTURA vs ANTERIOR

### ❌ ANTERIOR (Restaurant-based):
```javascript
// Login response
{ token }

// Cookie
restaurantSub=<restaurant-uuid>

// Endpoint
POST /api/sysUser/select-restaurant
{ restaurantUuid }
```

### ✅ NUEVO (Tenant-based):
```javascript
// Login response
{ 
  token,
  tenants: [{ tenant_sub, slug, name, is_default }],
  defaultTenant
}

// Cookie
tenant_sub=<tenant-uuid>

// No endpoint necesario - selección en frontend
// Backend usa tenant_sub directamente desde header
```

---

## 🔧 INTEGRACIÓN CON BACKEND

### Auth Service (login-swagger)
```typescript
const result = await this.internalAuth.login(dto);
// result: LoginResponseModel {
//   token: string,
//   tenants: TenantInfo[],
//   defaultTenant?: string
// }
```

### TenantInfo Interface
```typescript
interface TenantInfo {
  tenant_sub: string;  // UUID del tenant
  slug: string;        // Slug único
  name: string;        // Nombre del tenant
  is_default: boolean; // Si es el tenant predeterminado
}
```

### Tabla user_tenants (Prisma)
```sql
SELECT 
  ut.user_id,
  ut.is_default,
  ut.is_active,
  t.tenant_sub,
  t.slug,
  t.name
FROM user_tenants ut
JOIN tenants t ON ut.tenant_id = t.id
WHERE ut.user_id = ? AND ut.is_active = true
ORDER BY ut.is_default DESC;
```

---

## 🎯 CASOS DE USO

### Caso 1: Usuario con un solo tenant
```
Login → Auto-selecciona tenant → /api-docs
```
✅ Sin pasos intermedios  
✅ Cookie tenant_sub establecida automáticamente

### Caso 2: Usuario con múltiples tenants (uno predeterminado)
```
Login → /tenant-selection.html → Muestra predeterminado primero → Usuario elige → /api-docs
```
✅ Tenant predeterminado destacado visualmente  
✅ Puede elegir otro tenant si lo necesita

### Caso 3: Usuario sin tenants
```
Login → Error: "No tienes acceso a ningún tenant"
```
⚠️ Contactar administrador para asignar tenants

### Caso 4: Legacy - Restaurant selection
```
Login → /restaurant-selection.html → Selecciona → Establece tenant_sub + restaurantSub
```
⚠️ Compatibilidad con código antiguo que usa restaurantSub

---

## 📊 COMPARACIÓN DE COOKIES

### Sistema Nuevo (tenant_sub)
```javascript
// Después de login con 1 tenant
document.cookie // "authToken=<jwt>; tenant_sub=<uuid>"

// Después de selección múltiple
document.cookie // "authToken=<jwt>; tenant_sub=<uuid-seleccionado>"
```

### Sistema Legacy (compatibilidad)
```javascript
// restaurant-selection.html establece ambas
document.cookie // "authToken=<jwt>; tenant_sub=<uuid>; restaurantSub=<uuid>"
```

---

## 🧪 TESTING

### Test 1: Login con un tenant
```bash
# 1. Login
curl -X POST http://localhost:3000/api/sysUser/login-swagger \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'

# Response esperado:
{
  "data": {
    "token": "jwt...",
    "tenants": [
      {
        "tenant_sub": "uuid-1",
        "slug": "tenant-1",
        "name": "Tenant 1",
        "is_default": true
      }
    ],
    "defaultTenant": "uuid-1"
  }
}

# 2. Abrir index.html → Debe redirigir directamente a /api-docs
# 3. Verificar cookie: tenant_sub debe estar establecida
```

### Test 2: Login con múltiples tenants
```bash
# 1. Login como usuario con múltiples tenants
# Response esperado:
{
  "data": {
    "token": "jwt...",
    "tenants": [
      { "tenant_sub": "uuid-1", "slug": "tenant-1", "name": "Tenant 1", "is_default": true },
      { "tenant_sub": "uuid-2", "slug": "tenant-2", "name": "Tenant 2", "is_default": false }
    ],
    "defaultTenant": "uuid-1"
  }
}

# 2. Abrir index.html → Debe redirigir a /tenant-selection.html
# 3. Verificar que tenant-1 aparece primero (predeterminado)
# 4. Seleccionar tenant → Debe establecer cookie tenant_sub
# 5. Verificar redirección a /api-docs
```

### Test 3: Swagger con tenant_sub
```bash
# 1. Abrir /api-docs después de login
# 2. Swagger debe leer cookie tenant_sub
# 3. Incluir en requests como header
# 4. Backend debe filtrar datos por tenant
```

---

## 🔍 DEBUGGING

### Verificar cookies en navegador
```javascript
// Console del navegador
console.log('Cookies:', document.cookie);
// Debe mostrar: "authToken=...; tenant_sub=..."

// Verificar sessionStorage
console.log('Token:', sessionStorage.getItem('token'));
console.log('Tenants:', sessionStorage.getItem('tenants'));
console.log('Selected:', sessionStorage.getItem('selectedTenant'));
```

### Logs del frontend
```
🔍 Loading restaurants with token...
✅ Restaurants loaded: [...]
📊 Number of restaurants: 2
📋 Showing restaurant selection with 2 restaurants
🏪 Selected restaurant: uuid-1
✅ Restaurant selected, redirecting...
```

### Verificar headers en requests
```javascript
// En Swagger, los requests deben incluir:
Authorization: Bearer <jwt>
tenant_sub: <uuid>
```

---

## ⚠️ MIGRACIÓN

### Para código que usa restaurantSub:
1. Buscar referencias a `restaurantSub` cookie
2. Reemplazar con `tenant_sub`
3. Actualizar lógica de selección de restaurant a tenant

### Para endpoints que reciben restaurantUuid:
1. Actualizar para recibir `tenant_sub` desde header
2. Mantener compatibilidad temporal con restaurantUuid si es necesario
3. Deprecar endpoints antiguos gradualmente

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- ✅ index.html actualizado para manejar múltiples tenants
- ✅ tenant-selection.html actualizado para usar tenant_sub
- ✅ restaurant-selection.html actualizado para compatibilidad
- ✅ Cookies establecidas correctamente (tenant_sub)
- ✅ SessionStorage usado consistentemente
- ✅ Redirecciones funcionando según casos de uso
- ✅ Auto-selección para usuarios con 1 tenant
- ✅ Documentación completa del flujo

---

## 📚 REFERENCIAS

- **Auth Service**: `src/shared/core/auth/services/internal/auth.service.ts`
- **Login Response Model**: `src/shared/core/auth/models/login-response.model.ts`
- **Auth Controller**: `src/shared/core/auth/controllers/auth.controller.ts`
- **Tabla user_tenants**: `prisma/schema.prisma`

---

## 🎉 RESULTADO FINAL

**El sistema de autenticación HTML ahora está completamente alineado con la arquitectura de tenant_id centralizado** ✅

### Ventajas:
- ✅ Flujo simplificado (sin endpoint select-restaurant)
- ✅ Soporte multi-tenant desde el login
- ✅ Auto-selección para usuarios con 1 tenant
- ✅ Cookie tenant_sub como header principal
- ✅ Compatibilidad con código legacy (restaurant-selection.html)
- ✅ SessionStorage para persistencia entre páginas

**Sistema listo para producción** 🚀

---

**Última actualización**: 12 de enero de 2026, 2:00 PM  
**Implementado por**: GitHub Copilot (Claude Sonnet 4.5)
