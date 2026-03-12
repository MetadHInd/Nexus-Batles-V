# 🎯 PLAN DE IMPLEMENTACIÓN - SISTEMA DE PERMISOS COMPLETO

**Fecha de Creación:** 12 de enero de 2026  
**Sistema:** Generic SaaS Framework  
**Objetivo:** Implementar sistema completo de permisos RBAC (Role-Based Access Control)

---

## 📊 ESTADO ACTUAL DEL SISTEMA

### ✅ Lo que YA Existe y Funciona

#### **1. Base de Datos - Tablas de Permisos**
- ✅ `permission_definition` - Definiciones de permisos
- ✅ `role_permissions` - Permisos asignados a roles
- ✅ `user_permissions` - Permisos directos de usuario (overrides)
- ✅ `module` - Módulos del sistema (Controlador y Servicio COMPLETOS)
- ✅ `actions` - Acciones del sistema (Controlador y Servicio COMPLETOS)
- ✅ `role` - Roles con jerarquía (Servicio COMPLETO)
- ✅ `sysUser` - Usuarios del sistema

#### **2. Módulos y Servicios Implementados**
- ✅ **ActionsModule** - CRUD completo con 50+ acciones
  - `GET /api/actions` - Listar con paginación
  - `POST /api/actions` - Crear acción
  - `PUT /api/actions/:id` - Actualizar
  - `DELETE /api/actions/:id` - Eliminar
  
- ✅ **SystemModulesModule** - CRUD completo con jerarquía
  - `GET /api/modules` - Listar con paginación
  - `GET /api/modules/tree` - Árbol jerárquico
  - `POST /api/modules` - Crear módulo
  - `PUT /api/modules/:id` - Actualizar
  
- ✅ **RolesService** - CRUD de roles con jerarquía
- ✅ **AuthService** - Login/Register/JWT completo
- ✅ **Guards** - `JwtAuthGuard`, `RolesGuard`

#### **3. Enumeraciones y Validadores**
- ✅ `PermissionScope` (own, team, branch, organization, global, custom)
- ✅ `PermissionLevel` (guest, user, manager, admin, system)
- ✅ Validadores de scope y level

---

## 🚧 LO QUE FALTA IMPLEMENTAR

### Módulo 1: **Permission Definitions (Definiciones de Permisos)**

#### Archivos a Crear:
```
src/modules/permissions/
├── permissions.module.ts
├── controllers/
│   └── permission-definitions.controller.ts
├── services/
│   └── permission-definitions.service.ts
└── dtos/
    ├── create-permission-definition.dto.ts
    ├── update-permission-definition.dto.ts
    └── permission-definition-response.dto.ts
```

#### Funcionalidad:
1. **Crear Definición de Permiso**
   - Combinar: `module_id` + `action_id` + `scope` + `level`
   - Validar que el módulo y acción existan
   - Validar scope y level válidos
   - Generar código único: `module.action.scope`

2. **Listar Definiciones**
   - Con paginación
   - Filtros por módulo, acción, scope, level
   - Incluir información de módulo y acción relacionados

3. **Buscar por Código**
   - `GET /api/permissions/definitions/code/:code`
   - Ejemplo: `users.create.organization`

---

### Módulo 2: **Role Permissions (Permisos de Roles)**

#### Archivos a Crear:
```
src/modules/permissions/
├── controllers/
│   └── role-permissions.controller.ts
├── services/
│   └── role-permissions.service.ts
└── dtos/
    ├── assign-permission-to-role.dto.ts
    └── role-permissions-response.dto.ts
```

#### Funcionalidad:
1. **Asignar Permiso a Rol**
   - `POST /api/roles/:roleId/permissions/:permissionId`
   - Validar que rol y permiso existan
   - Evitar duplicados
   - Heredar permisos de rol padre (opcional)

2. **Listar Permisos de un Rol**
   - `GET /api/roles/:roleId/permissions`
   - Incluir permisos heredados del rol padre
   - Agrupar por módulo

3. **Remover Permiso de Rol**
   - `DELETE /api/roles/:roleId/permissions/:permissionId`

4. **Asignar Múltiples Permisos**
   - `POST /api/roles/:roleId/permissions/bulk`
   - Body: `{ permissionIds: [1,2,3,4] }`

---

### Módulo 3: **User Permissions (Permisos de Usuario)**

#### Archivos a Crear:
```
src/modules/permissions/
├── controllers/
│   └── user-permissions.controller.ts
├── services/
│   └── user-permissions.service.ts
└── dtos/
    ├── assign-permission-to-user.dto.ts
    └── user-permissions-response.dto.ts
```

#### Funcionalidad:
1. **Asignar Permiso Directo a Usuario**
   - `POST /api/users/:userId/permissions/:permissionId`
   - Override de permisos del rol
   - Tipo: `grant` (conceder) o `deny` (denegar)

2. **Listar Permisos de un Usuario**
   - `GET /api/users/:userId/permissions`
   - Combinar permisos del rol + permisos directos
   - Mostrar origen: `role` o `direct`

3. **Remover Permiso de Usuario**
   - `DELETE /api/users/:userId/permissions/:permissionId`

---

### Módulo 4: **Permission Evaluator (Motor de Evaluación)**

#### Archivos a Crear:
```
src/modules/permissions/
├── services/
│   └── permission-evaluator.service.ts
└── interfaces/
    └── permission-check-result.interface.ts
```

#### Funcionalidad Principal:
```typescript
/**
 * Verifica si un usuario tiene un permiso específico
 * @param userId - ID del usuario
 * @param moduleCode - Código del módulo (ej: 'users')
 * @param actionCode - Código de la acción (ej: 'create')
 * @param scope - Alcance del permiso (opcional)
 * @returns boolean - true si tiene permiso
 */
async hasPermission(
  userId: number,
  moduleCode: string,
  actionCode: string,
  scope?: PermissionScope
): Promise<boolean>

/**
 * Obtiene todos los permisos efectivos de un usuario
 * (permisos del rol + permisos directos - permisos denegados)
 */
async getUserEffectivePermissions(userId: number): Promise<PermissionDefinition[]>

/**
 * Verifica múltiples permisos a la vez
 */
async hasAnyPermission(userId: number, permissions: string[]): Promise<boolean>

/**
 * Verifica que tenga TODOS los permisos
 */
async hasAllPermissions(userId: number, permissions: string[]): Promise<boolean>
```

#### Lógica de Evaluación:
1. Obtener permisos del rol del usuario
2. Obtener permisos directos del usuario
3. Aplicar overrides:
   - Si hay `deny` directo → negar acceso
   - Si hay `grant` directo → conceder acceso
   - Si no hay override → usar permiso del rol
4. Validar scope si es necesario
5. Cachear resultado en Redis (5 min)

---

### Módulo 5: **Permission Guard (Guard de NestJS)**

#### Archivos a Crear:
```
src/modules/permissions/
├── guards/
│   └── permission.guard.ts
└── decorators/
    └── require-permission.decorator.ts
```

#### Implementación del Decorador:
```typescript
// decorators/require-permission.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permissions';

export interface PermissionRequirement {
  module: string;
  action: string;
  scope?: PermissionScope;
  requireAll?: boolean; // Si se pasan múltiples, ¿requiere todos o solo uno?
}

/**
 * Decorador para proteger endpoints con permisos
 * 
 * @example
 * // Requiere UN permiso específico
 * @RequirePermission({ module: 'users', action: 'create' })
 * 
 * @example
 * // Requiere uno de varios permisos (OR)
 * @RequirePermission([
 *   { module: 'users', action: 'create' },
 *   { module: 'users', action: 'update' }
 * ])
 * 
 * @example
 * // Requiere TODOS los permisos (AND)
 * @RequirePermission([
 *   { module: 'users', action: 'create' },
 *   { module: 'users', action: 'delete' }
 * ], { requireAll: true })
 */
export const RequirePermission = (
  permissions: PermissionRequirement | PermissionRequirement[],
  options?: { requireAll?: boolean }
) => SetMetadata(PERMISSION_KEY, { permissions, options });
```

#### Implementación del Guard:
```typescript
// guards/permission.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionEvaluatorService } from '../services/permission-evaluator.service';
import { PERMISSION_KEY } from '../decorators/require-permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionEvaluator: PermissionEvaluatorService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Obtener metadata del decorador
    const permissionMetadata = this.reflector.getAllAndOverride(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no hay metadata, permitir acceso
    if (!permissionMetadata) {
      return true;
    }

    // 2. Obtener usuario de la request (ya autenticado por JwtAuthGuard)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.sub) {
      return false;
    }

    const userId = user.sub;

    // 3. Evaluar permisos
    const { permissions, options } = permissionMetadata;
    const permissionArray = Array.isArray(permissions) ? permissions : [permissions];
    const requireAll = options?.requireAll || false;

    // 4. Verificar permisos según lógica (AND u OR)
    if (requireAll) {
      // Requiere TODOS los permisos (AND)
      for (const perm of permissionArray) {
        const hasPermission = await this.permissionEvaluator.hasPermission(
          userId,
          perm.module,
          perm.action,
          perm.scope
        );
        if (!hasPermission) {
          return false; // Falta un permiso
        }
      }
      return true; // Tiene todos
    } else {
      // Requiere AL MENOS UNO de los permisos (OR)
      for (const perm of permissionArray) {
        const hasPermission = await this.permissionEvaluator.hasPermission(
          userId,
          perm.module,
          perm.action,
          perm.scope
        );
        if (hasPermission) {
          return true; // Tiene al menos uno
        }
      }
      return false; // No tiene ninguno
    }
  }
}
```

#### Uso en Controladores:
```typescript
@Controller('users')
@UseGuards(JwtAuthGuard, PermissionGuard) // Primero autenticar, luego verificar permisos
export class UsersController {
  
  // Solo usuarios con permiso 'users.create'
  @Post()
  @RequirePermission({ module: 'users', action: 'create' })
  createUser(@Body() dto: CreateUserDto) {
    // ...
  }

  // Solo usuarios con permiso 'users.delete' en scope 'organization'
  @Delete(':id')
  @RequirePermission({ 
    module: 'users', 
    action: 'delete', 
    scope: PermissionScope.ORGANIZATION 
  })
  deleteUser(@Param('id') id: number) {
    // ...
  }

  // Requiere uno de varios permisos (OR)
  @Get(':id')
  @RequirePermission([
    { module: 'users', action: 'read' },
    { module: 'users', action: 'read_all' }
  ])
  getUser(@Param('id') id: number) {
    // ...
  }

  // Requiere TODOS los permisos (AND)
  @Put(':id/promote-to-admin')
  @RequirePermission([
    { module: 'users', action: 'update' },
    { module: 'roles', action: 'assign' }
  ], { requireAll: true })
  promoteToAdmin(@Param('id') id: number) {
    // ...
  }
}
```

---

### Módulo 6: **Permission Cache Service**

#### Archivos a Crear:
```
src/modules/permissions/
└── services/
    └── permission-cache.service.ts
```

#### Funcionalidad:
```typescript
/**
 * Cachea permisos de usuario en Redis
 */
async cacheUserPermissions(userId: number, permissions: any[], ttl = 300): Promise<void>

/**
 * Obtiene permisos cacheados
 */
async getCachedUserPermissions(userId: number): Promise<any[] | null>

/**
 * Invalida cache de un usuario
 */
async invalidateUserPermissionsCache(userId: number): Promise<void>

/**
 * Invalida cache de un rol (todos los usuarios con ese rol)
 */
async invalidateRolePermissionsCache(roleId: number): Promise<void>
```

---

## 📋 ESTRUCTURA FINAL DEL MÓDULO DE PERMISOS

```
src/modules/permissions/
├── permissions.module.ts
│
├── controllers/
│   ├── permission-definitions.controller.ts
│   ├── role-permissions.controller.ts
│   └── user-permissions.controller.ts
│
├── services/
│   ├── permission-definitions.service.ts
│   ├── role-permissions.service.ts
│   ├── user-permissions.service.ts
│   ├── permission-evaluator.service.ts
│   └── permission-cache.service.ts
│
├── guards/
│   └── permission.guard.ts
│
├── decorators/
│   └── require-permission.decorator.ts
│
├── dtos/
│   ├── create-permission-definition.dto.ts
│   ├── update-permission-definition.dto.ts
│   ├── assign-permission-to-role.dto.ts
│   ├── assign-permission-to-user.dto.ts
│   ├── permission-definition-response.dto.ts
│   ├── role-permissions-response.dto.ts
│   └── user-permissions-response.dto.ts
│
├── interfaces/
│   └── permission-check-result.interface.ts
│
└── models/
    └── permission-definition.model.ts
```

---

## 🎯 PLAN DE IMPLEMENTACIÓN PASO A PASO

### **Fase 1: Definiciones de Permisos (2-3 horas)**

#### Paso 1.1: Crear DTOs
```bash
# Crear archivos:
src/modules/permissions/dtos/create-permission-definition.dto.ts
src/modules/permissions/dtos/update-permission-definition.dto.ts
src/modules/permissions/dtos/permission-definition-response.dto.ts
```

**Contenido de `create-permission-definition.dto.ts`:**
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsEnum, IsOptional, IsString, IsBoolean } from 'class-validator';
import { PermissionScope, PermissionLevel } from 'src/shared/enums';

export class CreatePermissionDefinitionDto {
  @ApiProperty({
    description: 'ID del módulo',
    example: 1,
  })
  @IsInt()
  module_id: number;

  @ApiProperty({
    description: 'ID de la acción',
    example: 1,
  })
  @IsInt()
  action_id: number;

  @ApiProperty({
    description: 'Alcance del permiso',
    enum: PermissionScope,
    example: PermissionScope.ORGANIZATION,
  })
  @IsEnum(PermissionScope)
  scope: PermissionScope;

  @ApiProperty({
    description: 'Nivel del permiso',
    enum: PermissionLevel,
    example: PermissionLevel.USER,
  })
  @IsEnum(PermissionLevel)
  level: PermissionLevel;

  @ApiProperty({
    description: 'Descripción del permiso',
    example: 'Permite crear usuarios en toda la organización',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Si el permiso está activo',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
```

#### Paso 1.2: Crear Servicio
```bash
# Crear archivo:
src/modules/permissions/services/permission-definitions.service.ts
```

**Funciones principales:**
- `create(dto)` - Crear definición de permiso
- `findAll(filters)` - Listar con paginación
- `findOne(id)` - Obtener por ID
- `findByCode(code)` - Buscar por código único
- `update(id, dto)` - Actualizar
- `remove(id)` - Eliminar
- `toggleActive(id)` - Activar/Desactivar

#### Paso 1.3: Crear Controlador
```bash
# Crear archivo:
src/modules/permissions/controllers/permission-definitions.controller.ts
```

**Endpoints:**
- `POST /api/permissions/definitions`
- `GET /api/permissions/definitions`
- `GET /api/permissions/definitions/:id`
- `GET /api/permissions/definitions/code/:code`
- `PUT /api/permissions/definitions/:id`
- `DELETE /api/permissions/definitions/:id`
- `PATCH /api/permissions/definitions/:id/toggle`

---

### **Fase 2: Permisos de Roles (1-2 horas)**

#### Paso 2.1: Crear Servicio
```bash
src/modules/permissions/services/role-permissions.service.ts
```

**Funciones:**
- `assignPermissionToRole(roleId, permissionId)` - Asignar permiso
- `getRolePermissions(roleId, includeInherited)` - Listar permisos
- `removePermissionFromRole(roleId, permissionId)` - Remover permiso
- `bulkAssignPermissions(roleId, permissionIds)` - Asignar múltiples

#### Paso 2.2: Crear Controlador
```bash
src/modules/permissions/controllers/role-permissions.controller.ts
```

**Endpoints:**
- `POST /api/roles/:roleId/permissions/:permissionId`
- `GET /api/roles/:roleId/permissions`
- `DELETE /api/roles/:roleId/permissions/:permissionId`
- `POST /api/roles/:roleId/permissions/bulk`

---

### **Fase 3: Permisos de Usuarios (1-2 horas)**

Similar a Fase 2 pero para usuarios.

**Endpoints:**
- `POST /api/users/:userId/permissions/:permissionId`
- `GET /api/users/:userId/permissions`
- `DELETE /api/users/:userId/permissions/:permissionId`

---

### **Fase 4: Motor de Evaluación (2-3 horas)**

#### Paso 4.1: Crear Permission Evaluator Service
```bash
src/modules/permissions/services/permission-evaluator.service.ts
```

**Implementar lógica de evaluación:**
1. Obtener permisos del rol del usuario
2. Obtener permisos directos del usuario
3. Resolver conflictos (deny > grant > rol)
4. Validar scope
5. Cachear resultado

#### Paso 4.2: Crear Permission Cache Service
```bash
src/modules/permissions/services/permission-cache.service.ts
```

**Gestión de cache en Redis:**
- Cache por usuario: `permissions:user:{userId}`
- TTL: 5 minutos
- Invalidar al cambiar permisos

---

### **Fase 5: Guard y Decorador (1-2 horas)**

#### Paso 5.1: Crear Decorador
```bash
src/modules/permissions/decorators/require-permission.decorator.ts
```

#### Paso 5.2: Crear Guard
```bash
src/modules/permissions/guards/permission.guard.ts
```

#### Paso 5.3: Actualizar Módulo Principal
```typescript
// permissions.module.ts
@Module({
  imports: [DatabaseModule, CacheModule],
  controllers: [
    PermissionDefinitionsController,
    RolePermissionsController,
    UserPermissionsController,
  ],
  providers: [
    PermissionDefinitionsService,
    RolePermissionsService,
    UserPermissionsService,
    PermissionEvaluatorService,
    PermissionCacheService,
    PermissionGuard,
  ],
  exports: [
    PermissionEvaluatorService,
    PermissionGuard,
  ],
})
export class PermissionsModule {}
```

---

### **Fase 6: Testing y Documentación (1 hora)**

#### Paso 6.1: Crear Permisos de Ejemplo
```sql
-- Script para crear permisos iniciales
INSERT INTO permission_definition (module_id, action_id, scope, level, description)
VALUES
  (1, 1, 'organization', 'user', 'Crear usuarios en la organización'),
  (1, 2, 'own', 'user', 'Ver propio perfil'),
  (1, 3, 'own', 'user', 'Actualizar propio perfil'),
  (1, 4, 'organization', 'admin', 'Eliminar usuarios'),
  -- ... más permisos
```

#### Paso 6.2: Asignar Permisos a Roles
```sql
-- Admin tiene todos los permisos
INSERT INTO role_permissions (role_id, permission_definition_id)
SELECT 1, id FROM permission_definition; -- role_id 1 = Admin

-- Manager tiene permisos de lectura/escritura
INSERT INTO role_permissions (role_id, permission_definition_id)
SELECT 2, id FROM permission_definition 
WHERE level IN ('user', 'manager');

-- User tiene permisos básicos
INSERT INTO role_permissions (role_id, permission_definition_id)
SELECT 3, id FROM permission_definition 
WHERE level = 'user' AND scope IN ('own', 'team');
```

#### Paso 6.3: Probar en Swagger
```bash
# Iniciar aplicación
npm run start:dev

# Abrir Swagger
http://localhost:3000/api-docs

# Probar endpoints:
1. Crear definición de permiso
2. Asignar permiso a rol
3. Verificar que guard funcione en endpoint protegido
```

---

## 📊 TIEMPO ESTIMADO DE IMPLEMENTACIÓN

| Fase | Descripción | Tiempo |
|------|-------------|--------|
| **Fase 1** | Definiciones de Permisos | 2-3 horas |
| **Fase 2** | Permisos de Roles | 1-2 horas |
| **Fase 3** | Permisos de Usuarios | 1-2 horas |
| **Fase 4** | Motor de Evaluación + Cache | 2-3 horas |
| **Fase 5** | Guard y Decorador | 1-2 horas |
| **Fase 6** | Testing y Documentación | 1 hora |
| **TOTAL** | **8-13 horas** | **1-2 días** |

---

## 🔥 EJEMPLO DE USO FINAL

### 1. Crear Módulo y Acción (Ya existe)
```bash
# Ya tienes endpoints para esto
POST /api/modules        # Crear módulo 'users'
POST /api/actions        # Crear acción 'create'
```

### 2. Crear Definición de Permiso
```bash
POST /api/permissions/definitions
{
  "module_id": 1,
  "action_id": 1,
  "scope": "organization",
  "level": "user",
  "description": "Permite crear usuarios en toda la organización"
}

# Respuesta: { id: 1, code: "users.create.organization", ... }
```

### 3. Asignar Permiso a Rol
```bash
POST /api/roles/2/permissions/1  # Asignar a rol "Manager"
```

### 4. Proteger Endpoint con Decorador
```typescript
@Controller('users')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class UsersController {
  
  @Post()
  @RequirePermission({ module: 'users', action: 'create' })
  createUser(@Body() dto: CreateUserDto) {
    // Solo usuarios con permiso 'users.create' pueden acceder
    return this.usersService.create(dto);
  }
}
```

### 5. Verificar Permiso en Código
```typescript
// En cualquier servicio
constructor(
  private readonly permissionEvaluator: PermissionEvaluatorService
) {}

async someMethod(userId: number) {
  const hasPermission = await this.permissionEvaluator.hasPermission(
    userId,
    'users',
    'delete'
  );
  
  if (!hasPermission) {
    throw new ForbiddenException('No tienes permiso para eliminar usuarios');
  }
  
  // Continuar con la lógica
}
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Definiciones ✅
- [ ] Crear DTOs de permiso
- [ ] Crear `PermissionDefinitionsService`
- [ ] Crear `PermissionDefinitionsController`
- [ ] Agregar endpoints a Swagger
- [ ] Probar CRUD básico

### Fase 2: Roles ✅
- [ ] Crear `RolePermissionsService`
- [ ] Crear `RolePermissionsController`
- [ ] Implementar asignación de permisos
- [ ] Implementar listado con herencia
- [ ] Probar asignación y remoción

### Fase 3: Usuarios ✅
- [ ] Crear `UserPermissionsService`
- [ ] Crear `UserPermissionsController`
- [ ] Implementar overrides (grant/deny)
- [ ] Implementar listado efectivo
- [ ] Probar overrides

### Fase 4: Evaluación ✅
- [ ] Crear `PermissionEvaluatorService`
- [ ] Implementar `hasPermission()`
- [ ] Implementar resolución de conflictos
- [ ] Crear `PermissionCacheService`
- [ ] Integrar cache Redis
- [ ] Probar evaluación completa

### Fase 5: Guard ✅
- [ ] Crear decorador `@RequirePermission`
- [ ] Crear `PermissionGuard`
- [ ] Integrar con NestJS
- [ ] Probar en endpoint real
- [ ] Validar con Swagger

### Fase 6: Testing ✅
- [ ] Crear permisos de ejemplo
- [ ] Asignar a roles base
- [ ] Probar todos los endpoints
- [ ] Documentar en Swagger
- [ ] Crear guía de uso

---

## 📚 DOCUMENTACIÓN ADICIONAL

### Formato de Códigos de Permiso
```
{module}.{action}.{scope}

Ejemplos:
- users.create.organization
- users.read.own
- roles.update.global
- transactions.approve.branch
```

### Jerarquía de Scope
```
OWN < TEAM < BRANCH < ORGANIZATION < GLOBAL

Explicación:
- Si usuario tiene 'users.read.organization', también puede acceder a 'users.read.team' y 'users.read.own'
- Scope más amplio incluye scopes más restrictivos
```

### Jerarquía de Level
```
GUEST < USER < MANAGER < ADMIN < SYSTEM

Explicación:
- Level define la "peligrosidad" de la acción
- Admin puede hacer acciones de Manager, User, Guest
- System solo para operaciones críticas del sistema
```

---

## 🎯 PRÓXIMOS PASOS INMEDIATOS

1. **Revisar este plan** ✅
2. **Crear estructura de carpetas** del módulo permissions
3. **Empezar con Fase 1** - Definiciones de Permisos
4. **Iterar fase por fase** hasta completar
5. **Probar en Swagger** cada fase antes de continuar

---

**¿Comenzamos con la Fase 1?** 🚀

Te puedo generar el código completo de cada fase paso a paso.
