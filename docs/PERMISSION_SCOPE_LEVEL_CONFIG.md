# 🔐 Sistema de Scopes y Levels - Configuración de Permisos

## 📋 Resumen

Este documento describe la configuración de **Scope** (alcance) y **Level** (nivel) del sistema de permisos implementado.

---

## 🎯 Permission Scope (Alcance)

Define el **alcance territorial/organizacional** de un permiso. Controla **QUÉ recursos** puede acceder el usuario.

### Valores Disponibles

| Scope | Código | Descripción | Ejemplo de Uso |
|-------|--------|-------------|----------------|
| **OWN** | `own` | Solo recursos propios del usuario | Ver mis propias facturas |
| **TEAM** | `team` | Recursos del equipo | Ver facturas de mi equipo |
| **BRANCH** | `branch` | Recursos de la sucursal | Ver facturas de mi sucursal |
| **ORGANIZATION** | `organization` | Toda la organización | Ver todas las facturas de la empresa |
| **GLOBAL** | `global` | Sin restricciones | Acceso administrativo total |
| **CUSTOM** | `custom` | Definido por condiciones | Reglas personalizadas complejas |

### Jerarquía de Scopes

```
OWN < TEAM < BRANCH < ORGANIZATION < GLOBAL
(más restrictivo → menos restrictivo)
```

---

## 📊 Permission Level (Nivel)

Define el **nivel de privilegio o criticidad** del permiso. Controla la **importancia/peligrosidad** de la acción.

### Valores Disponibles

| Level | Código | Prioridad | Descripción | Ejemplo de Uso |
|-------|--------|-----------|-------------|----------------|
| **GUEST** | `guest` | 1 | Acceso mínimo para invitados | Ver catálogo público |
| **USER** | `user` | 2 | Operaciones estándar | Crear facturas |
| **MANAGER** | `manager` | 3 | Gestión y supervisión | Aprobar facturas |
| **ADMIN** | `admin` | 4 | Administración de alto nivel | Configurar módulos |
| **SYSTEM** | `system` | 5 | Configuración crítica del sistema | Cambiar estructura de BD |

### Jerarquía de Levels

```
GUEST (1) < USER (2) < MANAGER (3) < ADMIN (4) < SYSTEM (5)
(menos privilegio → más privilegio)
```

---

## 💡 Ejemplos de Uso Combinado

### Caso 1: Usuario Estándar
```typescript
{
  action: 'order.create',
  scope: PermissionScope.OWN,        // Solo mis propias órdenes
  level: PermissionLevel.USER        // Operación estándar
}
```

### Caso 2: Supervisor de Equipo
```typescript
{
  action: 'order.approve',
  scope: PermissionScope.TEAM,       // Órdenes de mi equipo
  level: PermissionLevel.MANAGER     // Requiere nivel de supervisor
}
```

### Caso 3: Administrador de Sucursal
```typescript
{
  action: 'report.financial',
  scope: PermissionScope.BRANCH,     // Solo mi sucursal
  level: PermissionLevel.ADMIN       // Información sensible
}
```

### Caso 4: Super Administrador
```typescript
{
  action: 'system.configure',
  scope: PermissionScope.GLOBAL,     // Todo el sistema
  level: PermissionLevel.SYSTEM      // Configuración crítica
}
```

---

## 🔧 Validadores Disponibles

### Funciones Utilitarias

```typescript
import { 
  isValidScope,
  isValidLevel,
  hasEqualOrHigherLevel,
  getHighestLevel,
  isScopeMoreRestrictive,
  scopeRequiresContext
} from '@/shared/utils/permission-validators.util';

// Validar scope
isValidScope('own'); // true
isValidScope('invalid'); // false

// Validar level
isValidLevel('admin'); // true

// Comparar levels
hasEqualOrHigherLevel(PermissionLevel.ADMIN, PermissionLevel.USER); // true

// Verificar si scope requiere contexto adicional (team_id, branch_id, etc.)
scopeRequiresContext(PermissionScope.TEAM); // true
scopeRequiresContext(PermissionScope.OWN); // false

// Comparar restricción de scopes
isScopeMoreRestrictive(PermissionScope.OWN, PermissionScope.TEAM); // true
```

---

## 🗄️ Estructura en Base de Datos

### Tabla `permission_definition`

```sql
CREATE TABLE permission_definition (
  id SERIAL PRIMARY KEY,
  code VARCHAR(255) UNIQUE NOT NULL,
  resource VARCHAR(100) NOT NULL,
  action VARCHAR(50) NOT NULL,
  scope VARCHAR(50),                    -- ⬅️ Scope opcional
  level VARCHAR(50) DEFAULT 'system',   -- ⬅️ Level con default 'system'
  description TEXT,
  module_id INT REFERENCES modules(id),
  action_id INT REFERENCES actions(id),
  -- ... otros campos
);
```

### Valores por Defecto

- **scope**: `NULL` (sin restricción, se evalúa en runtime)
- **level**: `'system'` (nivel más alto por defecto)

---

## ✅ Uso Recomendado

### 1. Permisos de Lectura
```typescript
scope: PermissionScope.OWN,    // Empezar restrictivo
level: PermissionLevel.USER    // Bajo riesgo
```

### 2. Permisos de Escritura
```typescript
scope: PermissionScope.OWN,
level: PermissionLevel.USER    // Moderado
```

### 3. Permisos de Aprobación
```typescript
scope: PermissionScope.TEAM,
level: PermissionLevel.MANAGER // Supervisión
```

### 4. Permisos de Configuración
```typescript
scope: PermissionScope.ORGANIZATION,
level: PermissionLevel.ADMIN   // Alto riesgo
```

### 5. Permisos de Sistema
```typescript
scope: PermissionScope.GLOBAL,
level: PermissionLevel.SYSTEM  // Máximo riesgo
```

---

## 🚨 Consideraciones Importantes

### Scopes que Requieren Contexto

Los siguientes scopes **requieren información adicional** para funcionar:

- **TEAM**: Necesita `team_id`
- **BRANCH**: Necesita `branch_id`  
- **ORGANIZATION**: Necesita `organization_id`

Usa `scopeRequiresContext()` para verificar si un scope necesita contexto.

### Custom Scope

El scope **CUSTOM** permite definir reglas personalizadas en la tabla `permission_conditions`:

```typescript
{
  scope: PermissionScope.CUSTOM,
  // Las condiciones se definen en permission_conditions:
  // - field: 'department_id'
  // - operator: 'equals'
  // - value: user.department_id
}
```

---

## 📚 Archivos Relacionados

- **Enums**: `src/shared/enums/permission-scope.enum.ts`
- **Levels**: `src/shared/enums/permission-level.enum.ts`
- **Validadores**: `src/shared/utils/permission-validators.util.ts`
- **Schema**: `prisma/schema.prisma` (tabla `permission_definition`)

---

## 🎓 Mejores Prácticas

1. **Principio de Menor Privilegio**: Siempre empezar con el scope más restrictivo
2. **Escalado Gradual**: Ir ampliando el scope conforme se necesite
3. **Levels Apropiados**: Asignar level según la criticidad de la acción
4. **Documentar Custom**: Si usas CUSTOM, documentar las condiciones
5. **Auditoría**: Los scopes GLOBAL y level SYSTEM deben estar auditados

---

✅ **El sistema de Scope y Level está completamente configurado y listo para usar.**
