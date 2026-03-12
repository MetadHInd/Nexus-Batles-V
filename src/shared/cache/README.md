# 🧹 Cache Management Module

## Descripción

Módulo de gestión de caché con interfaz visual en Swagger para limpiar y monitorear el caché Redis de la aplicación.

## Archivos del Módulo

```
src/shared/cache/
├── cache.module.ts                    # Módulo principal
├── redis-cache.service.ts             # Servicio base de Redis
├── base-cache.service.ts              # Servicio base abstracto
├── cache-management.service.ts        # Servicio de gestión de caché
├── cache-management.controller.ts     # Controller con endpoints Swagger
└── dtos/
    └── clear-cache.dto.ts             # DTOs con validación
```

## Características

✅ **6 Endpoints RESTful** documentados en Swagger  
✅ **Limpieza selectiva** por módulos o patterns  
✅ **Soporte multi-tenant** automático  
✅ **Estadísticas en tiempo real**  
✅ **Validación de DTOs** con class-validator  
✅ **Logs detallados** de cada operación  

## Instalación

El módulo ya está integrado en `CacheModule` y disponible globalmente.

## Uso Rápido

### Desde Swagger UI

1. Ir a `/api/docs`
2. Buscar sección **🧹 Cache Management**
3. Probar los endpoints interactivamente

### Desde Código

```typescript
import { CacheManagementService } from '@shared/cache/cache-management.service';

@Injectable()
export class MyService {
  constructor(
    private readonly cacheManagement: CacheManagementService,
  ) {}

  async cleanCache() {
    // Limpiar módulos específicos
    await this.cacheManagement.clearCache({
      modules: ['order', 'customer'],
    });
  }
}
```

## Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/cache-management/clear` | Limpiar caché (flexible) |
| `GET` | `/cache-management/keys` | Listar claves |
| `GET` | `/cache-management/stats` | Estadísticas |
| `GET` | `/cache-management/modules` | Módulos disponibles |
| `POST` | `/cache-management/clear-module/:name` | Limpiar módulo específico |
| `POST` | `/cache-management/clear-tenant` | Limpiar tenant |

## Ejemplos

### Limpiar módulos específicos
```bash
curl -X POST http://localhost:3000/cache-management/clear \
  -H "Content-Type: application/json" \
  -d '{"modules": ["order", "customer"]}'
```

### Ver estadísticas
```bash
curl http://localhost:3000/cache-management/stats
```

### Listar módulos
```bash
curl http://localhost:3000/cache-management/modules
```

## Documentación Completa

Ver [CACHE_MANAGEMENT_DOCUMENTATION.md](../../CACHE_MANAGEMENT_DOCUMENTATION.md) para guía completa de uso.
