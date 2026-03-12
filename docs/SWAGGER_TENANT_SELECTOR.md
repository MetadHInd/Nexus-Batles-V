# Actualización del Sistema de Selección de Swagger a Tenants

## 📋 Resumen

Se ha actualizado el sistema de selección en Swagger UI para trabajar con el sistema de tenants centralizado en lugar del sistema de restaurantes anterior.

## 🔄 Cambios Realizados

### 1. **Nuevo Script: swagger-tenant-addon.js**

Se creó un nuevo archivo `swagger-tenant-addon.js` que reemplaza completamente a `swagger-restaurant-addon.js`.

#### Cambios Principales:

**Variables y Funciones Renombradas:**
- `userRestaurants` → `userTenants`
- `getSelectedRestaurantUuid()` → `getSelectedTenantSub()`
- `loadAvailableRestaurants()` → `loadAvailableTenants()`
- `selectRestaurant()` → `selectTenant()`
- `updateRestaurantSelector()` → `updateTenantSelector()`
- `createRestaurantDropdown()` → `createTenantDropdown()`
- `addRestaurantSelector()` → `addTenantSelector()`
- `initializeRestaurantSelector()` → `initializeTenantSelector()`

**Headers HTTP:**
- `restaurantSub` → `tenant_sub`

**Cookies y SessionStorage:**
- `selectedRestaurantUuid` → `selectedTenant`
- `restaurantSub` (cookie) → `tenant_sub` (cookie)

**UI:**
- Icono: 🏪 → 🏢
- Etiqueta: "RESTAURANT" → "TENANT"
- Texto: "Restaurante" → "Tenant"

### 2. **Carga de Tenants desde SessionStorage**

A diferencia del sistema anterior que cargaba restaurantes desde la API, el nuevo sistema lee los tenants desde `sessionStorage`:

```javascript
// ANTES (Restaurant):
async function loadAvailableRestaurants() {
  const response = await fetch('/api/sysUser/restaurants', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  userRestaurants = response.data.restaurants;
}

// AHORA (Tenant):
async function loadAvailableTenants() {
  const storedTenants = sessionStorage.getItem('tenants');
  userTenants = JSON.parse(storedTenants);
}
```

Los tenants se guardan en `sessionStorage` durante el login en `login.html`:

```javascript
// En login.html:
sessionStorage.setItem('tenants', JSON.stringify(tenants));
sessionStorage.setItem('defaultTenant', defaultTenant);
```

### 3. **Actualización de main.ts**

Se actualizó la configuración de Swagger en `src/main.ts`:

```typescript
// ANTES:
customJs: [
  '/swagger-restaurant-addon.js',
  '/swagger-cache-control.js'
],

// AHORA:
customJs: [
  '/swagger-tenant-addon.js',
  '/swagger-cache-control.js'
],
```

### 4. **Estructura de Datos**

**ANTES (Restaurant):**
```typescript
interface Restaurant {
  uuid: string;
  name: string;
  is_owner: boolean;
}
```

**AHORA (Tenant):**
```typescript
interface Tenant {
  tenant_sub: string;  // UUID del tenant
  name: string;
  slug: string;
  is_default: boolean;
}
```

## 🎯 Flujo de Funcionamiento

### 1. **Login y Carga de Tenants**

```
┌─────────────┐
│ login.html  │
└──────┬──────┘
       │
       │ POST /api/auth/login
       │
       ▼
┌─────────────────────────────┐
│ Response:                   │
│ {                          │
│   token: "...",            │
│   tenants: [{              │
│     tenant_sub: "uuid",    │
│     name: "...",           │
│     slug: "...",           │
│     is_default: true       │
│   }]                       │
│ }                          │
└──────┬──────────────────────┘
       │
       │ Guardar en sessionStorage:
       │ - token
       │ - tenants
       │ - defaultTenant
       │
       ▼
┌─────────────────────┐
│ tenant-selection    │
│ o api-docs          │
└─────────────────────┘
```

### 2. **Inicialización en Swagger**

```
┌──────────────────────┐
│ Swagger UI carga     │
└──────┬───────────────┘
       │
       │ Carga swagger-tenant-addon.js
       │
       ▼
┌──────────────────────────────┐
│ initializeTenantSelector()   │
└──────┬───────────────────────┘
       │
       │ Buscar contenedor Swagger
       │ (retry cada 500ms, máx 20 intentos)
       │
       ▼
┌──────────────────────────────┐
│ addTenantSelector()          │
└──────┬───────────────────────┘
       │
       │ loadAvailableTenants()
       │ (lee de sessionStorage)
       │
       ▼
┌──────────────────────────────┐
│ Renderizar UI:               │
│ - Tenant actual              │
│ - Dropdown (si >1 tenant)    │
│ - Botón Administrar          │
│ - Botón Refresh              │
└──────────────────────────────┘
```

### 3. **Envío de Headers en Requests**

```
┌─────────────────────┐
│ Usuario hace call   │
│ en Swagger UI       │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────────────┐
│ fetch() interceptado         │
└──────┬──────────────────────┘
       │
       │ getSelectedTenantSub()
       │ - sessionStorage.getItem('selectedTenant')
       │ - o cookie 'tenant_sub'
       │
       ▼
┌─────────────────────────────┐
│ Agregar header:             │
│ tenant_sub: "uuid-tenant"   │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Request enviado al backend  │
└─────────────────────────────┘
```

## 🔧 Funciones Principales

### `getSelectedTenantSub()`
Lee el tenant seleccionado desde:
1. `sessionStorage.getItem('selectedTenant')`
2. Cookie `tenant_sub` (fallback)

### `loadAvailableTenants()`
Carga los tenants desde `sessionStorage.getItem('tenants')` (guardados en login).

### `selectTenant(tenantSub)`
Selecciona un tenant:
1. Guarda en sessionStorage
2. Guarda en cookie (24h)
3. Guarda metadata (slug, name)
4. Recarga la página

### `addTenantSelector()`
Crea la UI del selector:
- Badge con icono 🏢
- Tenant actual (nombre + UUID)
- Dropdown para cambiar (si >1)
- Botón "Administrar" → abre `/tenant-selection.html`
- Botón "Refresh" → recarga tenants

## 🎨 Interfaz de Usuario

```
┌─────────────────────────────────────────────────────────────────┐
│ 🏢 TENANT                                                         │
│                                                                   │
│ [Mi Empresa] abc12345...  [▼ Cambiar a...] [🔄] [⚙️ Administrar]│
└─────────────────────────────────────────────────────────────────┘
```

### Elementos:

1. **Badge "🏢 TENANT"**: Identificador visual del tipo de selector
2. **Tenant Actual**: Muestra nombre + primeros 8 caracteres del UUID
3. **Dropdown**: Permite cambiar entre tenants disponibles (solo si hay >1)
4. **Botón Refresh (🔄)**: Recarga la lista desde sessionStorage
5. **Botón Administrar (⚙️)**: Abre `/tenant-selection.html` en nueva ventana

### Estados Visuales:

- **Tenant Seleccionado**: Texto azul (#007bff)
- **Sin Tenant**: Texto gris (#6c757d) "No seleccionado"
- **Error**: Texto rojo (#dc3545)

## 📦 Almacenamiento de Datos

### SessionStorage:
```javascript
{
  "token": "eyJhbGc...",
  "tenants": [
    {
      "tenant_sub": "uuid-1",
      "name": "Mi Empresa",
      "slug": "mi-empresa",
      "is_default": true
    }
  ],
  "selectedTenant": "uuid-1",
  "tenant_slug": "mi-empresa",
  "tenant_name": "Mi Empresa"
}
```

### Cookies:
```
tenant_sub=uuid-1; path=/; expires=...
authToken=eyJhbGc...; path=/; expires=...
```

## 🧪 Testing

Para probar el sistema en la consola del navegador:

```javascript
// Probar el selector
window.testTenantSelector();

// Output:
// 🧪 Testing tenant selector...
// - Script loaded: true
// - Current tenant: uuid-xxx
// - Available tenants: 3
// - Selector exists: true

// Ver tenants disponibles
console.log(JSON.parse(sessionStorage.getItem('tenants')));

// Ver tenant actual
console.log(sessionStorage.getItem('selectedTenant'));

// Cambiar tenant manualmente
await selectTenant('nuevo-uuid-tenant');
```

## 🔒 Seguridad

El sistema mantiene las mismas medidas de seguridad:

1. **JWT Token**: Requerido en todas las requests
2. **Cookie HttpOnly**: Para el authToken (manejado por backend)
3. **Cookie tenant_sub**: Expira en 24 horas
4. **HTTPS**: Recomendado en producción

## 🚀 Ventajas del Nuevo Sistema

1. **✅ Más Simple**: No requiere llamadas a la API para cargar tenants
2. **✅ Más Rápido**: Tenants ya están en sessionStorage desde el login
3. **✅ Consistente**: Usa la misma estructura que el resto del sistema
4. **✅ Centralizado**: tenant_sub es el identificador único en todo el sistema
5. **✅ Mejor UX**: Carga instantánea, sin spinners ni delays

## 📝 Migración

Si tienes código que aún usa el sistema antiguo:

### Actualizar Referencias:
```javascript
// ANTES:
const restaurantUuid = sessionStorage.getItem('selectedRestaurantUuid');
headers['restaurantSub'] = restaurantUuid;

// AHORA:
const tenantSub = sessionStorage.getItem('selectedTenant');
headers['tenant_sub'] = tenantSub;
```

### Leer Cookie:
```javascript
// ANTES:
document.cookie.match(/restaurantSub=([^;]+)/);

// AHORA:
document.cookie.match(/tenant_sub=([^;]+)/);
```

## 🐛 Troubleshooting

### Problema: "No tenants found in sessionStorage"
**Solución**: Hacer login nuevamente. Los tenants se guardan en login.html.

### Problema: El selector no aparece
**Solución**: 
1. Verificar que estás en `/api-docs`
2. Ejecutar `window.testTenantSelector()` en consola
3. Verificar logs en consola del navegador

### Problema: Requests sin header tenant_sub
**Solución**:
1. Verificar que hay un tenant seleccionado: `sessionStorage.getItem('selectedTenant')`
2. Verificar que el script se cargó: `window.TENANT_SELECTOR_LOADED`
3. Verificar que la URL incluye `/api/`

## 📚 Referencias

- [tenant-selection.html](../public/tenant-selection.html) - Página de selección de tenant
- [login.html](../public/login.html) - Guarda tenants en sessionStorage
- [main.ts](../src/main.ts) - Configuración de Swagger
- [ACTUALIZACION_HTML_TENANTS.md](ACTUALIZACION_HTML_TENANTS.md) - Documentación del sistema de login

## ✅ Checklist de Implementación

- [x] Crear swagger-tenant-addon.js
- [x] Actualizar main.ts para cargar nuevo script
- [x] Renombrar todas las referencias de restaurant a tenant
- [x] Cambiar headers de restaurantSub a tenant_sub
- [x] Actualizar cookies de restaurantSub a tenant_sub
- [x] Cargar tenants desde sessionStorage
- [x] Actualizar UI con iconos y textos de tenant
- [x] Probar funcionalidad en Swagger
- [x] Documentar cambios
- [ ] Eliminar swagger-restaurant-addon.js (deprecated)
- [ ] Actualizar tests si existen

## 🎯 Próximos Pasos

1. **Probar en producción**: Verificar que el selector funciona correctamente
2. **Monitorear**: Revisar logs para cualquier error relacionado con tenants
3. **Deprecar archivo antiguo**: Marcar `swagger-restaurant-addon.js` como deprecated
4. **Actualizar documentación de API**: Reflejar el uso de tenant_sub header
5. **Eliminar código legacy**: Remover referencias a restaurantSub en el backend

---

**Fecha de actualización**: 12 de enero de 2026
**Versión**: 1.0.0
**Estado**: ✅ Completado
