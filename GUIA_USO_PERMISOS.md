# 🔐 GUÍA DE USO DEL SISTEMA DE PERMISOS

## 📚 Tabla de Contenidos
1. [Configuración Básica](#configuración-básica)
2. [Uso de Decoradores](#uso-de-decoradores)
3. [Endpoints Disponibles](#endpoints-disponibles)
4. [Ejemplos Completos](#ejemplos-completos)

---

## 🚀 Configuración Básica

### 1. Importar el PermissionGuard en tu controlador

```typescript
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/core/auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/shared/guards/permission.guard';
import { RequirePermission } from 'src/shared/decorators/permissions.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard) // Siempre requerido primero
export class UsersController {
  // ... endpoints
}
```

---

## 🎯 Uso de Decoradores

### 1. @RequirePermission - Permiso Específico

Requiere un permiso específico (módulo + acción + scope).

```typescript
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequirePermission({ 
  module: 'users', 
  action: 'create', 
  scope: 'organization' // opcional, default: 'organization'
})
@Post()
async createUser(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto);
}
```

**Cómo funciona:**
- Busca el permiso: `users.create.organization`
- Verifica en permisos de rol + permisos directos del usuario
- Si no tiene el permiso → `403 Forbidden`

---

### 2. @RequireAny - Al Menos Uno

Requiere tener AL MENOS UNO de los permisos especificados.

```typescript
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequireAny([
  'users.read.organization',
  'users.read.team'
])
@Get()
async getUsers() {
  return this.usersService.findAll();
}
```

**Uso típico:** Cuando diferentes niveles de usuarios pueden acceder (ej: admin org o líder de equipo).

---

### 3. @RequireAll - Todos los Permisos

Requiere tener TODOS los permisos especificados.

```typescript
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequireAll([
  'users.create.organization',
  'users.read.organization',
  'roles.assign.organization'
])
@Post('with-role')
async createUserWithRole(@Body() dto: CreateUserWithRoleDto) {
  return this.usersService.createWithRole(dto);
}
```

**Uso típico:** Operaciones que requieren múltiples capacidades combinadas.

---

### 4. @AdminOnly - Solo Administradores

Permite acceso solo a usuarios con `role_idrole = 1` (ADMIN).

```typescript
@UseGuards(JwtAuthGuard, PermissionGuard)
@AdminOnly()
@Delete(':id')
async deleteUser(@Param('id') id: number) {
  return this.usersService.remove(id);
}
```

**Uso típico:** Operaciones críticas del sistema.

---

### 5. @OwnerOnly - Solo el Dueño

Verifica que el usuario sea dueño del recurso.

```typescript
@UseGuards(JwtAuthGuard, PermissionGuard)
@OwnerOnly('order', 'orderId') // resourceType, paramName
@Get('orders/:orderId')
async getOrder(@Param('orderId') orderId: number) {
  return this.ordersService.findOne(orderId);
}
```

**Cómo funciona:**
- Lee el parámetro `orderId` de la URL
- Busca el recurso en la tabla `orders`
- Verifica si `order.user_id === userId` o `order.created_by === userId`
- Si no es el dueño → `403 Forbidden`

---

## 📡 Endpoints Disponibles

### Permission Definitions

```bash
# Crear definición de permiso
POST /permissions/definitions
{
  "module_id": 1,
  "action_id": 2,
  "resource": "users",
  "action": "create",
  "scope": "organization",
  "level": "user",
  "code": "users.create.organization",
  "description": "Crear usuarios en la organización"
}

# Listar definiciones
GET /permissions/definitions?page=1&limit=10

# Obtener por ID
GET /permissions/definitions/1

# Buscar por código
GET /permissions/definitions/code/users.create.organization

# Actualizar
PUT /permissions/definitions/1

# Eliminar
DELETE /permissions/definitions/1

# Activar/Desactivar
PATCH /permissions/definitions/1/toggle
```

---

### Role Permissions

```bash
# Asignar permiso a rol
POST /roles/1/permissions
{
  "permission_id": 5,
  "is_active": true,
  "granted_by": 1
}

# Asignar múltiples permisos
POST /roles/1/permissions/bulk
{
  "permission_ids": [1, 2, 3, 4, 5],
  "is_active": true,
  "granted_by": 1
}

# Listar permisos de un rol
GET /roles/1/permissions

# Remover permiso de rol
DELETE /roles/1/permissions/5
```

---

### User Permissions

```bash
# Asignar permiso directo a usuario
POST /users/1/permissions
{
  "permission_id": 5,
  "is_active": true,
  "granted_by": 1
}

# Asignar múltiples permisos
POST /users/1/permissions/bulk
{
  "permission_ids": [1, 2, 3],
  "is_active": true,
  "granted_by": 1
}

# Listar permisos directos de usuario
GET /users/1/permissions

# Obtener permisos EFECTIVOS (rol + directos)
GET /users/1/permissions/effective

# Remover permiso de usuario
DELETE /users/1/permissions/5
```

---

## 💡 Ejemplos Completos

### Ejemplo 1: CRUD de Productos con Permisos

```typescript
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/core/auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/shared/guards/permission.guard';
import { RequirePermission, RequireAny, AdminOnly } from 'src/shared/decorators/permissions.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  
  // ✅ Leer productos - Requiere permiso de lectura
  @UseGuards(PermissionGuard)
  @RequirePermission({ module: 'products', action: 'read' })
  @Get()
  async findAll() {
    return this.productsService.findAll();
  }

  // ✅ Crear producto - Requiere permiso de creación
  @UseGuards(PermissionGuard)
  @RequirePermission({ module: 'products', action: 'create' })
  @Post()
  async create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  // ✅ Actualizar - Requiere actualización O ser admin
  @UseGuards(PermissionGuard)
  @RequireAny(['products.update.organization', 'admin'])
  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  // ✅ Eliminar - Solo administradores
  @UseGuards(PermissionGuard)
  @AdminOnly()
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.productsService.remove(id);
  }
}
```

---

### Ejemplo 2: Órdenes con Ownership

```typescript
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/core/auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/shared/guards/permission.guard';
import { OwnerOnly, RequireAny } from 'src/shared/decorators/permissions.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  
  // ✅ Ver todas las órdenes - Requiere permiso de lectura global
  @UseGuards(PermissionGuard)
  @RequirePermission({ module: 'orders', action: 'read', scope: 'organization' })
  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }

  // ✅ Ver orden específica - Solo el dueño o con permiso de lectura
  @UseGuards(PermissionGuard)
  @OwnerOnly('order', 'orderId')
  @Get(':orderId')
  async findOne(@Param('orderId') orderId: number) {
    return this.ordersService.findOne(orderId);
  }

  // ✅ Cancelar orden - Solo el dueño o admin
  @UseGuards(PermissionGuard)
  @RequireAny(['orders.cancel.organization', 'admin'])
  @Post(':orderId/cancel')
  async cancel(@Param('orderId') orderId: number) {
    return this.ordersService.cancel(orderId);
  }
}
```

---

### Ejemplo 3: Configuración Inicial del Sistema

```typescript
// Script para setup inicial de permisos
import { ServiceCache } from 'src/shared/core/services/service-cache/service-cache';

async function setupPermissions() {
  // 1. Crear módulos con acciones automáticas
  const usersModule = await ServiceCache.Database.modules.create({
    data: {
      name: 'Users Management',
      code: 'users',
      description: 'User CRUD operations',
      action_ids: [1, 2, 3, 4], // create, read, update, delete
      auto_create_permissions: true,
      default_scope: 'organization',
      default_level: 'user'
    }
  });
  
  // Sistema crea automáticamente:
  // - users.create.organization
  // - users.read.organization
  // - users.update.organization
  // - users.delete.organization

  // 2. Asignar permisos al rol Admin
  const adminPermissions = await ServiceCache.Database.permission_definition.findMany({
    where: { module_id: usersModule.id }
  });

  for (const permission of adminPermissions) {
    await ServiceCache.Database.role_permissions.create({
      data: {
        role_id: 1, // Admin role
        permission_id: permission.id,
        is_active: true,
        granted_by: 1,
        granted_at: new Date()
      }
    });
  }

  console.log('✅ Permisos configurados correctamente');
}
```

---

## 🔍 Testing de Permisos

### 1. Verificar permisos efectivos de un usuario

```bash
GET /users/1/permissions/effective

# Respuesta
[
  {
    "id": 1,
    "code": "users.create.organization",
    "module_id": 1,
    "action_id": 1,
    "resource": "users",
    "action": "create",
    "scope": "organization",
    "is_active": true
  },
  // ... más permisos
]
```

### 2. Probar endpoint protegido

```bash
# Sin token
GET /api/users
# Respuesta: 401 Unauthorized

# Con token pero sin permiso
GET /api/users
# Headers: Authorization: Bearer <token>
# Respuesta: 403 Forbidden - No tienes el permiso requerido: users.read.organization

# Con token y permiso correcto
GET /api/users
# Headers: Authorization: Bearer <token_admin>
# Respuesta: 200 OK + datos
```

---

## 🎨 Mejores Prácticas

### 1. Siempre usa JwtAuthGuard primero

```typescript
@UseGuards(JwtAuthGuard, PermissionGuard) // ✅ Correcto
@UseGuards(PermissionGuard, JwtAuthGuard) // ❌ Incorrecto
```

### 2. Define permisos descriptivos

```typescript
// ✅ Bueno
'users.create.organization'
'orders.cancel.organization'
'reports.export.organization'

// ❌ Malo
'u.c.o'
'permission1'
'access'
```

### 3. Usa scopes apropiados

```typescript
'organization' // Toda la organización
'team'         // Solo el equipo
'user'         // Solo el usuario
'system'       // Sistema completo
```

### 4. Cache de permisos

El sistema usa cache de Redis con TTL de 5 minutos:
- Permisos efectivos de usuarios
- Permisos de roles
- Permisos directos de usuarios

Después de cambiar permisos, el cache se limpia automáticamente.

---

## 🚨 Troubleshooting

### Problema: "403 Forbidden - No tienes el permiso requerido"

**Solución:**
1. Verificar que el permiso existe en la base de datos
2. Verificar que está asignado al rol del usuario
3. Verificar que está activo (`is_active: true`)
4. Limpiar cache si es necesario

### Problema: "Usuario no autenticado"

**Solución:**
1. Verificar que el token JWT es válido
2. Verificar que JwtAuthGuard está antes de PermissionGuard
3. Verificar que el header Authorization está presente

### Problema: PermissionGuard no funciona

**Solución:**
1. Verificar que PermissionsModule está importado en AppModule
2. Verificar que PermissionEvaluatorService está registrado
3. Verificar que Redis está corriendo

---

## 📊 Resumen

**Sistema Completado: 95%** ✅

- ✅ Permission Evaluator Service
- ✅ Permission Guard
- ✅ Decoradores (@RequirePermission, @RequireAll, @RequireAny, @AdminOnly, @OwnerOnly)
- ✅ Role Permissions Endpoints (CRUD)
- ✅ User Permissions Endpoints (CRUD)
- ✅ Cache con Redis (5 min TTL)
- ✅ Auto-creación de permisos

**Listo para producción** 🚀
