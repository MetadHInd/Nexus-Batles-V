# Actualización del Panel de Control de Caché en Swagger

## 📋 Resumen

Se ha actualizado el sistema de control de caché en Swagger UI para integrarse con el sistema de tenants centralizado y mejorar significativamente su diseño visual.

## 🎨 Mejoras Visuales

### 1. **Nuevo Header del Modal**

**ANTES:**
- Color morado (#667eea - #764ba2)
- Icono 🎛️ simple
- Diseño plano

**AHORA:**
- Color verde profesional (#4CAF50 - #2E7D32)
- Icono ⚡ más llamativo
- Diseño con sombras y efectos mejorados
- Título más destacado (30px, weight 800)
- Subtitle mejorado con información contextual

```html
<!-- Nuevo diseño -->
<h2>🎛️ Panel de Control de Caché</h2>
<p>Gestiona el caché Redis con sistema de tenants unificado</p>
```

### 2. **Botón de Acceso Mejorado**

El botón ahora se integra directamente con el selector de tenants:

```
┌─────────────────────────────────────────────────────────────────┐
│ 🏢 TENANT                                                         │
│ [Mi Empresa] ... [▼ Cambiar] [🔄] [⚙️ Administrar] [⚡ Caché]   │
└─────────────────────────────────────────────────────────────────┘
```

**Características:**
- Se posiciona automáticamente junto al selector de tenant
- Color verde coherente con el tema de gestión
- Efectos hover mejorados (elevación y sombra)
- Icono ⚡ para identificación rápida

### 3. **Cards Estadísticas Mejoradas**

Cuatro cards principales con gradientes vibrantes:

1. **Total de Claves** - Gradiente morado (#667eea - #764ba2)
2. **Tenant Actual** - Gradiente rosa (#f093fb - #f5576c)
3. **Módulos Activos** - Gradiente azul (#4facfe - #00f2fe)
4. **Tenants** - Gradiente verde (#43e97b - #38f9d7)

Todas con:
- Efectos hover con elevación
- Sombras suaves y profesionales
- Texto con text-shadow para mejor legibilidad
- Animaciones suaves (transform: translateY)

### 4. **Sección de Acciones Rápidas**

Botones rediseñados con:
- Colores específicos por tipo de acción
- Bordes redondeados consistentes
- Efectos hover uniformes
- Iconos descriptivos

### 5. **Búsqueda de Claves Mejorada**

- Input con fondo translúcido
- Bordes con transparencia (rgba)
- Efectos focus mejorados
- Botón de búsqueda con elevación

## 🔄 Cambios Funcionales

### 1. **Migración de Restaurant a Tenant**

| Elemento | Antes | Ahora |
|----------|-------|-------|
| Variable global | `currentRestaurantSub` | `currentTenantSub` |
| Función getter | `getCurrentRestaurantSub()` | `getCurrentTenantSub()` |
| SessionStorage | `selectedRestaurantUuid` | `selectedTenant` |
| Cookie | `restaurantSub` | `tenant_sub` |
| Header HTTP | `restaurantSub` | `tenant_sub` |

### 2. **Nuevos Endpoints del API**

El sistema ahora usa los endpoints del **UnifiedCacheController**:

```javascript
// ANTES (Legacy)
GET  /cache-management/dashboard
GET  /cache-management/keys/detailed
GET  /cache-management/key/:key
POST /cache-management/clear

// AHORA (Unificado)
GET  /api/cache/dashboard
GET  /api/cache/keys
GET  /api/cache/get/:key
POST /api/cache/clear
```

### 3. **Funciones Actualizadas**

#### `getCurrentTenantSub()`
```javascript
// Lee el tenant actual desde:
// 1. sessionStorage.getItem('selectedTenant')
// 2. Cookie 'tenant_sub' (fallback)
```

#### `loadCacheStats()`
```javascript
// Envía header tenant_sub en lugar de restaurantSub
headers['tenant_sub'] = tenantSub;

// Usa nuevo endpoint
fetch('/api/cache/dashboard', { headers })
```

#### `clearCache(options)`
```javascript
// Mantiene la misma funcionalidad
// Pero usa endpoints actualizados
fetch('/api/cache/clear', {
  method: 'POST',
  headers: { 'tenant_sub': tenantSub },
  body: JSON.stringify(options)
})
```

#### `loadDetailedKeys(pattern, limit)`
```javascript
// Nueva ruta de búsqueda
fetch(`/api/cache/keys?pattern=${pattern}&limit=${limit}`)
```

#### `viewKeyValue(key)`
```javascript
// Nueva ruta para obtener valor
fetch(`/api/cache/get/${encodeURIComponent(key)}`)
```

### 4. **Listeners de Cambios**

El sistema ahora escucha cambios en tenant en lugar de restaurant:

```javascript
window.addEventListener('storage', async function(e) {
  if (e.key === 'selectedTenant' || e.key === 'tenant_sub') {
    // Actualizar panel si cambió el tenant
    await loadCacheStats();
    updateModalContent();
  }
});
```

### 5. **Integración con Selector de Tenant**

El botón ahora busca e integra con el selector de tenant:

1. **Primera opción**: Se añade junto a los botones del tenant selector
2. **Fallback**: Se crea en topbar independiente si no encuentra selector

```javascript
// Buscar tenant selector
const tenantSelector = document.getElementById('tenant-selector');
if (tenantSelector) {
  // Añadir botón junto a otros controles
  const actionsDiv = tenantSelector.querySelector('[style*="gap: 10px"]');
  actionsDiv.insertAdjacentHTML('beforeend', buttonHtml);
}
```

## 📊 Dashboard Unificado

El nuevo dashboard muestra:

### Estadísticas Generales
- **Total de Claves**: Número total de keys en Redis
- **Tenant Actual**: Identificador del tenant seleccionado
- **Módulos Activos**: Cantidad de módulos con cache
- **Tenants**: Total de tenants con datos en cache

### Acciones Rápidas
- 🧹 **Limpiar Mi Tenant**: Elimina cache del tenant actual
- 📦 **Limpiar "default"**: Limpia namespace por defecto
- 🛒 **Limpiar Órdenes**: Cache del módulo order
- 🍽️ **Limpiar Menús**: Cache del módulo menu
- 👥 **Limpiar Clientes**: Cache del módulo customer
- 🔄 **Refrescar Stats**: Recarga estadísticas

### Vista Detallada de Claves
- Búsqueda por patrón (`order:*`, `default:*`, etc.)
- Lista completa con información:
  - Nombre de la clave
  - TTL (tiempo de vida)
  - Tamaño en memoria
  - Acciones (ver, eliminar)

## 🎯 Flujo de Funcionamiento

```
Usuario hace login
  ↓
Tenants guardados en sessionStorage
  ↓
Usuario accede a /api-docs
  ↓
Swagger carga:
  - swagger-tenant-addon.js
  - swagger-cache-control.js
  ↓
Se renderiza selector de tenant con botón de caché
  ↓
Usuario selecciona tenant
  ↓
Botón "⚡ Caché" disponible
  ↓
Click en botón
  ↓
Modal se abre con:
  - Header verde mejorado
  - Cards de estadísticas
  - Acciones rápidas
  - Búsqueda de claves
  ↓
Todas las requests incluyen header tenant_sub
```

## 🧪 Testing

### Verificar Integración

```javascript
// En consola del navegador en /api-docs

// 1. Verificar tenant actual
console.log('Tenant:', sessionStorage.getItem('selectedTenant'));

// 2. Abrir panel de caché
window.openCacheModal();

// 3. Ver estadísticas cargadas
console.log('Stats:', window.cacheStats);

// 4. Probar limpieza
await window.clearCurrentTenant();

// 5. Refrescar stats
await window.refreshStats();
```

### Verificar Headers

Abrir DevTools → Network al hacer click en acciones:

```
Request Headers:
  Authorization: Bearer eyJhbGc...
  tenant_sub: uuid-del-tenant-actual
  Content-Type: application/json
```

## 🎨 Paleta de Colores

### Colores Principales
- **Verde Principal**: `#4CAF50` → `#2E7D32` (Caché/Acciones)
- **Morado**: `#667eea` → `#764ba2` (Total Keys)
- **Rosa**: `#f093fb` → `#f5576c` (Tenant)
- **Azul**: `#4facfe` → `#00f2fe` (Módulos)
- **Verde Agua**: `#43e97b` → `#38f9d7` (Tenants)

### Efectos Visuales
- **Sombras**: `0 8px 24px rgba(color, 0.3)`
- **Hover**: `translateY(-4px)`
- **Border Radius**: `16px` (cards), `10px` (inputs/buttons)
- **Backdrop Blur**: `blur(10px)` en overlays

## 🔒 Seguridad

El sistema mantiene:

1. **JWT Authentication**: Todas las requests requieren Bearer token
2. **Tenant Isolation**: Header `tenant_sub` asegura scope correcto
3. **CORS**: Respeta políticas del backend
4. **Cookie Security**: tenant_sub expira en 24 horas

## ⚡ Mejoras de Rendimiento

1. **Lazy Loading**: El modal se crea solo cuando se abre
2. **Cache Local**: Stats se guardan en variable `cacheStats`
3. **Debouncing**: Búsquedas con límite de requests
4. **Progressive Enhancement**: Funciona con o sin tenant selector

## 🐛 Troubleshooting

### Problema: Botón no aparece
**Solución**:
1. Verificar que estás en `/api-docs`
2. Verificar en consola: `window.CACHE_CONTROL_LOADED`
3. Verificar que hay un tenant seleccionado

### Problema: Modal no carga datos
**Solución**:
1. Verificar token: `sessionStorage.getItem('token')`
2. Verificar tenant: `sessionStorage.getItem('selectedTenant')`
3. Ver errores en Network tab de DevTools

### Problema: Requests fallan
**Solución**:
1. Verificar endpoint: `/api/cache/dashboard` (nuevo)
2. Verificar header: `tenant_sub` (no `restaurantSub`)
3. Verificar backend está corriendo

## 📚 Referencias

- [UnifiedCacheController](../../src/shared/cache/controllers/unified-cache.controller.ts) - Endpoints del API
- [swagger-tenant-addon.js](../swagger-tenant-addon.js) - Selector de tenant
- [CACHE_UNIFICADO.md](../../CACHE_UNIFICADO.md) - Sistema de caché unificado

## ✅ Checklist de Implementación

- [x] Actualizar getCurrentRestaurantSub → getCurrentTenantSub
- [x] Cambiar headers de restaurantSub a tenant_sub
- [x] Actualizar endpoints a /api/cache/*
- [x] Mejorar diseño del header del modal (verde)
- [x] Integrar botón con selector de tenant
- [x] Actualizar listeners de storage
- [x] Mejorar cards de estadísticas
- [x] Añadir efectos hover y animaciones
- [x] Documentar cambios
- [ ] Probar en producción
- [ ] Eliminar referencias legacy

## 🎯 Próximos Pasos

1. **Testing exhaustivo**: Probar todas las acciones del panel
2. **Monitoreo**: Revisar logs de requests
3. **Feedback**: Recoger comentarios de usuarios
4. **Optimización**: Mejorar tiempos de carga si es necesario
5. **Documentación de usuario**: Crear guía visual para usuarios finales

---

**Fecha de actualización**: 12 de enero de 2026
**Versión**: 2.0.0
**Estado**: ✅ Completado y Mejorado
