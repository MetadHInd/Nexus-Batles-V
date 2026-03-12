# Sistema de Caché Global

## Descripción
El proyecto implementa un sistema de caché global usando Redis para optimizar el rendimiento de las consultas a la base de datos.

## Arquitectura

### Componentes principales:

1. **RedisCacheService** (`src/shared/cache/redis-cache.service.ts`)
   - Servicio principal que maneja la conexión y operaciones con Redis
   - Implementa reintentos automáticos y manejo de errores
   - Soporte para autenticación y TLS en producción

2. **BaseCacheService** (`src/shared/cache/base-cache.service.ts`)
   - Clase base abstracta para servicios que requieren caché
   - Proporciona el método `tryCacheOrExecute` para caché automático
   - Maneja serialización/deserialización automática

3. **CacheModule** (`src/shared/cache/cache.module.ts`)
   - Módulo global que exporta RedisCacheService
   - Disponible en toda la aplicación sin necesidad de importar en cada módulo

## Implementación en Servicios

### Ejemplo: UsersService
```typescript
@Injectable()
export class UsersService extends BaseCacheService {
  private readonly userCacheKey = 'user';
  private readonly userListSufixKey = '_list';

  constructor(cache: RedisCacheService) {
    super(cache);
  }

  async findAll(useCache = true): Promise<UserModel[]> {
    return this.tryCacheOrExecute(
      this.userCacheKey,
      { key: this.userListSufixKey },
      useCache,
      async () => {
        // Lógica de consulta a BD
      }
    );
  }
}
```

### Ejemplo: UserProfileService
```typescript
@Injectable()
export class UserProfileService extends BaseCacheService {
  private readonly profileCacheKey = 'userprofile';
  private readonly profileCacheTTL = 1800; // 30 minutos

  constructor(cache: RedisCacheService) {
    super(cache);
  }

  async getUserProfile(userId: number, useCache = true): Promise<any> {
    return this.tryCacheOrExecute(
      this.profileCacheKey,
      { userId },
      useCache,
      async () => {
        // Lógica de consulta a BD
      }
    );
  }
}
```

## Módulos con Caché Implementado

| Módulo | Clave de Caché | TTL | Estado |
|--------|----------------|-----|--------|
| Users | `user` | 30 min | ✅ Implementado |
| User Profile | `userprofile` | 30 min | ✅ Implementado |
| Branch | Por implementar | - | ⏳ Pendiente |
| Menu | Por implementar | - | ⏳ Pendiente |
| Order | Por implementar | - | ⏳ Pendiente |

## Configuración

### Variables de Entorno
```env
# Desarrollo
REDIS_HOST=localhost
REDIS_PORT=6379

# Producción
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-secure-password
REDIS_USERNAME=default
REDIS_TLS=true
```

## Operaciones Disponibles

### 1. Guardar en Caché
```typescript
await this.cache.set({ key: 'user', params: { id: 1 } }, userData, 1800);
```

### 2. Obtener del Caché
```typescript
const cached = await this.cache.get<UserModel>('user', { id: 1 });
```

### 3. Actualizar Caché
```typescript
await this.cache.update({ key: 'user', params: { id: 1 } }, newData, 1800);
```

### 4. Eliminar del Caché
```typescript
await this.cache.delete('user', { id: 1 });
```

### 5. Limpiar Todo el Caché
```typescript
await this.cache.clear();
```

### 6. Eliminar por Patrón
```typescript
await this.cache.deletePattern('user:*');
```

## Formato de Claves

Las claves se construyen automáticamente siguiendo el patrón:
```
{clave_base}:{param1}={valor1}:{param2}={valor2}
```

Ejemplos:
- `user:id=1`
- `user:email=john@example.com`
- `userprofile:userId=1`
- `userprofile:userSub=550e8400-e29b-41d4-a716-446655440000`

## Manejo de Errores

El sistema está diseñado para fallar silenciosamente:
- Si Redis no está disponible, las consultas van directo a la BD
- Los errores se registran en logs pero no interrumpen el servicio
- No se lanzan excepciones por fallos de caché

## Mejores Prácticas

1. **Siempre proporcionar un parámetro `useCache`** en métodos públicos
   ```typescript
   async findById(id: number, useCache = true): Promise<Model> {
   ```

2. **Invalidar caché al modificar datos**
   ```typescript
   await this.cacheDelete(this.cacheKey, { id });
   ```

3. **Usar TTL apropiado según la naturaleza de los datos**
   - Datos estáticos: 1-24 horas
   - Datos dinámicos: 5-30 minutos
   - Datos críticos: 1-5 minutos

4. **Implementar invalidación cruzada** cuando un cambio afecte múltiples cachés

5. **Monitorear el uso de memoria** de Redis regularmente

## Comandos Útiles de Redis

```bash
# Verificar conexión
redis-cli ping

# Ver todas las claves
redis-cli keys *

# Ver claves de usuarios
redis-cli keys "user:*"

# Obtener valor de una clave
redis-cli get "user:id=1"

# Eliminar una clave
redis-cli del "user:id=1"

# Limpiar toda la base de datos
redis-cli flushall

# Información del servidor
redis-cli info

# Monitor en tiempo real
redis-cli monitor
```

## Próximos Pasos

1. Implementar caché en módulos restantes
2. Agregar métricas de hit/miss ratio
3. Implementar warming de caché para datos críticos
4. Configurar políticas de evicción en Redis
5. Agregar compresión para valores grandes
