# Sistema de Autenticación y Autorización

## Descripción General

Este sistema maneja dos tipos de roles:

1. **Roles de Autorización (Sistema)**: `AuthorizationRole` - Roles globales del sistema de autenticación
2. **Roles Locales (Negocio)**: `LocalRole` - Roles específicos del modelo de negocio

## Guards Disponibles

### 1. RoleGuard
Para validar roles del sistema (`AuthorizationRole`):
```typescript
@UseGuards(RoleGuard)
@Roles(AuthorizationRole.ADMIN)
```

### 2. LocalRoleGuard
Para validar roles locales (`LocalRole`):
```typescript
@UseGuards(LocalRoleGuard)
@LocalRoles(LocalRole.REGIONAL_MANAGER)
```

## Sistema de Bypass para Administradores

### Decorador @BypassForSystemAdmin

Permite que los administradores del sistema (`ADMIN`, `ADMIN_AUTHORIZED_ORIGIN`, `SUPER_ADMIN`) se salten validaciones específicas de negocio.

#### Uso Básico

```typescript
@Post('batch-add')
@UseGuards(LocalRoleGuard)
@LocalRoles(LocalRole.REGIONAL_MANAGER)
@BypassForSystemAdmin() // Los admins del sistema pueden saltarse la validación
@ApiOperation({ summary: 'Add multiple users to a branch' })
async batchAddUsers(@Body() body: BatchAddUsersToBranchDto, @CurrentUser() user: any) {
  // Validación de negocio que se puede saltar
  if (!isSystemAdmin(user)) {
    const hasBranch = Array.isArray(user?.branches) && 
      user.branches.includes(body.branchId);
    
    if (!hasBranch) {
      throw new ForbiddenException('Solo un regional manager con la sucursal asignada...');
    }
  }
  
  return this.service.addMany(body.userIds, body.branchId, body.manager);
}
```

#### Funciones Helper

```typescript
import { isSystemAdmin } from 'src/shared/core/auth/helpers/system-admin.helper';

// Verificar si el usuario es administrador del sistema
if (isSystemAdmin(user)) {
  // El usuario puede saltarse validaciones
}
```

## Estructura del Usuario

```typescript
interface User {
  // Rol del sistema de autenticación
  authorizationRole: AuthorizationRole;
  
  // Rol local del negocio
  localRole: LocalRole;
  roles?: LocalRole[]; // Array de roles locales (opcional)
  
  // Sucursales asignadas
  branches?: number[];
  
  // Otros campos...
}
```

## Ejemplos de Uso

### Endpoint Solo para Administradores del Sistema
```typescript
@UseGuards(RoleGuard)
@Roles(AuthorizationRole.ADMIN)
async systemAdminOnly() {
  // Solo admins del sistema
}
```

### Endpoint para Managers Regionales con Bypass
```typescript
@UseGuards(LocalRoleGuard)
@LocalRoles(LocalRole.REGIONAL_MANAGER)
@BypassForSystemAdmin()
async regionalManagerOrSystemAdmin(@CurrentUser() user: any) {
  if (!isSystemAdmin(user)) {
    // Validaciones específicas para managers regionales
  }
  // Lógica del endpoint
}
```

### Endpoint con Múltiples Roles Locales
```typescript
@UseGuards(LocalRoleGuard)
@LocalRoles(LocalRole.MANAGER, LocalRole.REGIONAL_MANAGER)
async managersOnly() {
  // Solo managers o regional managers
}
```

## Flujo de Validación

1. **JwtAuthGuard**: Valida el token JWT
2. **LocalRoleGuard**: 
   - Verifica si el endpoint tiene `@BypassForSystemAdmin()`
   - Si tiene bypass y el usuario es admin del sistema → ✅ Permitir
   - Si no, valida los roles locales requeridos
3. **Controlador**: Aplica validaciones adicionales de negocio si es necesario

## Roles del Sistema

```typescript
enum AuthorizationRole {
  USER = 1,
  ADMIN = 2,
  SUPERVISOR = 3,
  ADMIN_AUTHORIZED_ORIGIN = 4,
  SUPER_ADMIN = 5,
  ASSISTANT = 6,
}
```

## Roles Locales

```typescript
enum LocalRole {
  OWNER = 1,
  REGIONAL_MANAGER = 2,
  MANAGER = 3,
  COLLABORATOR = 4,
  AIA = 5,
}