# SSE (Server-Sent Events) Module

Sistema completo de comunicación unidireccional en tiempo real basado en Server-Sent Events para la arquitectura GALATEA.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Arquitectura](#arquitectura)
- [Instalación](#instalación)
- [Uso Básico](#uso-básico)
- [Casos de Uso](#casos-de-uso)
- [API Reference](#api-reference)
- [Seguridad](#seguridad)
- [Monitoreo](#monitoreo)
- [Troubleshooting](#troubleshooting)

---

## ✨ Características

- ✅ **Gestión Automática de Conexiones**: Registro, cleanup y heartbeat automático
- ✅ **Event Bridge**: Integración transparente con el EventBus existente
- ✅ **Multi-Tenancy**: Soporte nativo para múltiples tenants
- ✅ **Seguridad**: Guards de autenticación JWT y rate limiting
- ✅ **Escalable**: Diseño preparado para miles de conexiones simultáneas
- ✅ **Monitoreo**: Métricas en tiempo real y health checks
- ✅ **Reconexión Automática**: Soporte nativo del protocolo SSE
- ✅ **Type-Safe**: Totalmente tipado con TypeScript

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│               APPLICATION LAYER                         │
│  (GalateaService, AIAService, etc.)                    │
│  └─> eventBus.emit('EVENT_NAME', payload)             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│               EVENT BUS LAYER                           │
│  (EventBusService)                                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│           SSE EVENT BRIDGE LAYER                        │
│  (SSEEventBridgeService)                                │
│  └─> Escucha eventos y los reenvía por SSE            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│        CONNECTION MANAGEMENT LAYER                      │
│  (SSEConnectionManagerService)                          │
│  └─> Gestiona clientes y envía mensajes               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              TRANSPORT LAYER                            │
│  (HTTP/SSE Protocol)                                    │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Instalación

El módulo SSE ya está incluido en tu proyecto. Para usarlo:

### 1. Importar el módulo

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { SSEModule } from './shared/core/sse/sse.module';

@Module({
  imports: [
    SSEModule, // Importar SSE Module
    // ... otros módulos
  ],
})
export class AppModule {}
```

### 2. Configurar variables de entorno

```env
# .env
JWT_SECRET=your-secret-key-here
```

---

## 🚀 Uso Básico

### Paso 1: Crear un Controller SSE

```typescript
// src/modules/galatea/controllers/galatea-sse.controller.ts
import { Controller, Sse, Req } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { BaseSSEController } from '@/shared/core/sse/controllers/base-sse.controller';
import { SSEConnectionManagerService } from '@/shared/core/sse/services/sse-connection-manager.service';
import { SSESecure, ManagerId, TenantId } from '@/shared/core/sse/decorators';

@Controller('sse/galatea')
export class GalateaSSEController extends BaseSSEController {
  constructor(connectionManager: SSEConnectionManagerService) {
    super(connectionManager);
  }

  /**
   * Endpoint SSE para eventos de GALATEA
   * GET /sse/galatea/stream?token=JWT_TOKEN&managerId=mgr_123
   */
  @Sse('stream')
  @SSESecure() // Aplica autenticación y rate limiting
  streamGalateaEvents(
    @Req() req: Request,
    @ManagerId() managerId: string,
    @TenantId() tenantId: string,
  ): Observable<MessageEvent> {
    return this.createSSEStream(req, managerId, tenantId);
  }
}
```

### Paso 2: Registrar Listeners de Eventos

```typescript
// src/modules/galatea/galatea.module.ts
import { Module, OnModuleInit } from '@nestjs/common';
import { SSEEventBridgeService } from '@/shared/core/sse/services/sse-event-bridge.service';
import { GalateaSSEController } from './controllers/galatea-sse.controller';

@Module({
  controllers: [GalateaSSEController],
})
export class GalateaModule implements OnModuleInit {
  constructor(private readonly eventBridge: SSEEventBridgeService) {}

  onModuleInit() {
    // Registrar listeners de eventos GALATEA
    this.eventBridge.registerEventListeners('GALATEA', [
      {
        eventName: 'GALATEA_PROGRESS',
        handler: (payload) => {
          this.eventBridge.sendToManagerFromPayload('GALATEA_PROGRESS', payload);
        },
      },
      {
        eventName: 'GALATEA_RESPONSE',
        handler: (payload) => {
          this.eventBridge.sendToManagerFromPayload('GALATEA_RESPONSE', payload);
        },
      },
      {
        eventName: 'GALATEA_ERROR',
        handler: (payload) => {
          this.eventBridge.sendToManagerFromPayload('GALATEA_ERROR', payload);
        },
      },
    ]);
  }
}
```

### Paso 3: Emitir Eventos desde tu Servicio

```typescript
// src/modules/galatea/services/galatea.service.ts
import { Injectable } from '@nestjs/common';
import { EventBusService } from '@/shared/core/services/service-cache/event-bus.service';

@Injectable()
export class GalateaService {
  constructor(private readonly eventBus: EventBusService) {}

  async processQuery(managerId: string, query: string) {
    // Emitir evento de progreso
    this.eventBus.emit('GALATEA_PROGRESS', {
      managerId,
      stage: 'analyzing',
      message: 'Analizando consulta...',
      progress: 10,
    });

    // ... procesamiento ...

    // Emitir respuesta
    this.eventBus.emit('GALATEA_RESPONSE', {
      managerId,
      response: 'Aquí está tu respuesta...',
      timestamp: new Date().toISOString(),
    });
  }
}
```

---

## 📖 Casos de Uso

### Caso 1: Notificaciones en Tiempo Real

```typescript
// Emitir notificación desde cualquier servicio
this.eventBus.emit('USER_NOTIFICATION', {
  managerId: 'mgr_123',
  type: 'info',
  message: 'Nueva actualización disponible',
});

// El cliente Unity recibe automáticamente:
// event: USER_NOTIFICATION
// data: {"managerId":"mgr_123","type":"info","message":"..."}
```

### Caso 2: Progreso de Tareas Largas

```typescript
async processLongTask(managerId: string) {
  for (let i = 0; i <= 100; i += 10) {
    this.eventBus.emit('TASK_PROGRESS', {
      managerId,
      progress: i,
      message: `Procesando... ${i}%`,
    });
    
    await this.doWork();
  }
  
  this.eventBus.emit('TASK_COMPLETE', {
    managerId,
    result: 'Tarea completada',
  });
}
```

### Caso 3: Chat en Tiempo Real

```typescript
async sendMessage(fromId: string, toId: string, message: string) {
  // Guardar mensaje en DB
  await this.saveMessage(fromId, toId, message);
  
  // Notificar al receptor vía SSE
  this.eventBus.emit('NEW_MESSAGE', {
    managerId: toId,
    from: fromId,
    message,
    timestamp: new Date().toISOString(),
  });
}
```

---

## 📚 API Reference

### SSEConnectionManagerService

#### Métodos Principales

```typescript
// Enviar a cliente específico
sendToClient(clientId: string, event: string, data: any): boolean

// Enviar a todos los clientes de un manager
sendToManager(managerId: string, event: string, data: any): SSESendResult

// Enviar a todos los clientes de un tenant
sendToTenant(tenantId: string, event: string, data: any): SSESendResult

// Broadcast a todos los clientes
broadcast(event: string, data: any, options?: SSESendOptions): SSESendResult

// Obtener estadísticas
getStats(): SSEConnectionStats

// Obtener métricas
getMetrics(): object
```

### SSEEventBridgeService

#### Métodos Principales

```typescript
// Registrar grupo de listeners
registerEventListeners(
  groupName: string,
  listeners: SSEEventListener[],
  enabled?: boolean
): void

// Habilitar/deshabilitar grupo
enableGroup(groupName: string): void
disableGroup(groupName: string): void

// Helpers de envío
sendToManagerFromPayload(eventName: string, payload: any): void
sendToTenantFromPayload(eventName: string, payload: any): void
broadcastFromPayload(eventName: string, payload: any): void

// Obtener información
listGroups(): string[]
getMetrics(): object
```

### Decorators

```typescript
// Seguridad
@SSESecure()      // Auth + Rate Limit
@SSEAuth()        // Solo Auth
@SSERateLimit()   // Solo Rate Limit

// Parámetros
@ManagerId()      // Extrae managerId
@TenantId()       // Extrae tenantId
@SessionId()      // Extrae sessionId
@SSEUser()        // Extrae usuario JWT
@ClientMetadata() // Extrae metadata
```

---

## 🔒 Seguridad

### Autenticación JWT

Los clientes deben enviar el token JWT como query parameter:

```
GET /sse/galatea/stream?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...&managerId=mgr_123
```

**⚠️ Importante:**
- Usar HTTPS en producción (tokens en URL son visibles)
- Usar tokens de corta duración (5-15 min)
- Considerar tokens de un solo uso para SSE

### Rate Limiting

Configuración por defecto:
- **5 intentos de conexión** por IP por minuto
- **3 conexiones simultáneas** máximo por IP
- **10,000 conexiones globales** máximo

Para ajustar:

```typescript
// En tu módulo
import { SSERateLimitGuard } from '@/shared/core/sse/guards/sse-rate-limit.guard';

rateLimitGuard.updateConfig({
  maxAttemptsPerWindow: 10,
  maxConcurrentPerIp: 5,
});
```

### Nginx Configuration

Si usas Nginx como proxy, desactiva buffering para SSE:

```nginx
location /sse/ {
    proxy_pass http://backend:3000;
    
    # SSE Configuration
    proxy_buffering off;
    proxy_cache off;
    proxy_set_header Connection '';
    proxy_http_version 1.1;
    proxy_read_timeout 600s;
    
    # Headers
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

---

## 📊 Monitoreo

### Endpoints de Métricas

```bash
# Métricas completas
GET /sse/metrics

# Health check
GET /sse/health

# Readiness probe (Kubernetes)
GET /sse/health/ready

# Liveness probe (Kubernetes)
GET /sse/health/live

# Dashboard stats
GET /sse/stats

# Conexiones activas
GET /sse/connections

# Estado del Event Bridge
GET /sse/events

# Rate limiting stats
GET /sse/rate-limit

# Métricas Prometheus
GET /sse/metrics/prometheus
```

### Ejemplo de Response

```json
{
  "connections": {
    "active": 347,
    "managers": 89,
    "tenants": 5,
    "throughput": {
      "eventsSent": 12458,
      "eventsPerSecond": 23.45
    }
  },
  "health": {
    "status": "healthy",
    "checks": {
      "connections": "pass",
      "memory": "pass",
      "uptime": "pass"
    }
  }
}
```

---

## 🎮 Cliente Unity (C# Example)

```csharp
using System;
using System.Collections;
using UnityEngine;
using UnityEngine.Networking;

public class SSEClient : MonoBehaviour
{
    private string sseUrl = "https://api.galatea.com/sse/galatea/stream";
    private string authToken;
    private string managerId;
    
    void Start()
    {
        StartCoroutine(ConnectSSE());
    }
    
    IEnumerator ConnectSSE()
    {
        string url = $"{sseUrl}?token={authToken}&managerId={managerId}";
        
        using (UnityWebRequest request = UnityWebRequest.Get(url))
        {
            request.downloadHandler = new SSEDownloadHandler(OnSSEMessage);
            request.SetRequestHeader("Accept", "text/event-stream");
            
            yield return request.SendWebRequest();
            
            if (request.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError($"SSE Error: {request.error}");
                // Reconexión automática
                yield return new WaitForSeconds(3);
                StartCoroutine(ConnectSSE());
            }
        }
    }
    
    void OnSSEMessage(string eventType, string data)
    {
        Debug.Log($"SSE Event: {eventType}");
        
        switch(eventType)
        {
            case "connected":
                Debug.Log("SSE Connected!");
                break;
                
            case "GALATEA_PROGRESS":
                var progress = JsonUtility.FromJson<ProgressData>(data);
                UpdateProgressBar(progress.progress);
                ShowMessage(progress.message);
                break;
                
            case "GALATEA_RESPONSE":
                var response = JsonUtility.FromJson<ResponseData>(data);
                DisplayResponse(response.response);
                break;
                
            case "heartbeat":
                // Mantener conexión viva
                break;
        }
    }
}
```

---

## 🔧 Troubleshooting

### Problema: Conexiones no se establecen

**Solución:**
```bash
# Verificar health check
curl http://localhost:3000/sse/health

# Verificar JWT
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/sse/health
```

### Problema: Eventos no llegan al cliente

**Solución:**
```typescript
// Verificar que los listeners están registrados
const groups = eventBridge.listGroups();
console.log('Registered groups:', groups);

// Verificar métricas
const metrics = eventBridge.getMetrics();
console.log('Events processed:', metrics.eventsProcessed);
```

### Problema: Rate limit bloqueando clientes legítimos

**Solución:**
```typescript
// Resetear rate limit para IP específica
rateLimitGuard.resetIp('192.168.1.100');

// O ajustar configuración
rateLimitGuard.updateConfig({
  maxAttemptsPerWindow: 10,
  windowMs: 120000, // 2 minutos
});
```

---

## 📝 Mejores Prácticas

1. **Siempre usar HTTPS en producción** para proteger tokens
2. **Implementar reconexión exponencial** en el cliente
3. **Limitar tamaño de payloads** (max 64KB por defecto)
4. **Monitorear métricas regularmente** para detectar problemas
5. **Usar eventos específicos** en lugar de eventos genéricos
6. **Implementar timeout en clientes** para detectar desconexiones
7. **Logear eventos críticos** para auditoría
8. **Testear con alta carga** antes de producción

---

## 🎮 Modo Sesión Única (Single Session Mode)

El sistema SSE incluye un modo "sesión única" similar a videojuegos o servicios de streaming, donde un usuario solo puede tener una conexión activa a la vez. Cuando intenta conectarse desde un nuevo dispositivo, la sesión anterior se cierra automáticamente.

### Configuración

Por defecto, el modo sesión única está **HABILITADO**. Puedes controlarlo dinámicamente:

```typescript
// En tu módulo o servicio
constructor(
  private readonly connectionManager: SSEConnectionManagerService,
) {}

// Habilitar modo sesión única
connectionManager.setSingleSessionMode(true);

// Deshabilitar (permitir múltiples sesiones)
connectionManager.setSingleSessionMode(false);

// Verificar estado actual
const isEnabled = connectionManager.isSingleSessionMode();
console.log(`Single session mode: ${isEnabled}`);
```

### Comportamiento

Cuando está habilitado y un usuario se conecta desde un nuevo dispositivo:

1. **Detección**: El sistema detecta que ya existe una sesión activa para ese `managerId`
2. **Notificación**: Se envía evento `session_terminated` a la sesión anterior:
   ```json
   {
     "event": "session_terminated",
     "data": {
       "reason": "new_device_login",
       "message": "Tu sesión fue cerrada porque iniciaste sesión desde otro dispositivo",
       "timestamp": "2024-01-15T10:30:00.000Z"
     }
   }
   ```
3. **Cierre**: La conexión anterior se cierra después de 100ms (tiempo para entregar el mensaje)
4. **Registro**: Se registra nueva sesión y continúa normalmente
5. **Logging**: Se genera log de auditoría del cambio de sesión

### Gestión Manual de Sesiones

Además del cierre automático, puedes forzar el cierre de sesiones:

```typescript
// Cerrar TODAS las sesiones de un usuario específico
// Útil para: cambio de contraseña, ban, logout forzado, etc.
const closedCount = connectionManager.disconnectManager(
  'mgr_12345',
  'Password changed - please login again'
);
console.log(`Closed ${closedCount} session(s)`);

// El cliente recibirá:
// {
//   "event": "session_terminated",
//   "data": {
//     "reason": "forced_disconnection",
//     "message": "Password changed - please login again",
//     "timestamp": "2024-01-15T10:30:00.000Z",
//     "reconnect": false
//   }
// }
```

### Consultar Sesiones Activas

Puedes obtener información sobre las sesiones activas de un usuario:

```typescript
const sessions = connectionManager.getManagerSessionsInfo('mgr_12345');

// Retorna:
// [
//   {
//     clientId: 'client_abc123',
//     connectedAt: Date,
//     lastHeartbeat: Date,
//     metadata: { /* datos personalizados */ }
//   }
// ]

console.log(`User has ${sessions.length} active session(s)`);
```

### Manejo en el Cliente (Unity)

Tu cliente Unity debe estar preparado para recibir el evento `session_terminated`:

```csharp
// Ejemplo en Unity C#
void OnSSEEvent(string eventName, string data)
{
    if (eventName == "session_terminated")
    {
        var termination = JsonUtility.FromJson<SessionTermination>(data);
        
        // Mostrar mensaje al usuario
        ShowDialog(
            "Sesión Cerrada",
            termination.message
        );
        
        // Si reconnect == false, no intentar reconectar
        if (!termination.reconnect)
        {
            DisableAutoReconnect();
            RedirectToLogin();
        }
    }
}
```

### Casos de Uso

1. **Login desde nuevo dispositivo**: Cierre automático de sesión anterior
2. **Cambio de contraseña**: `disconnectManager(id, 'Password changed')`
3. **Suspensión de cuenta**: `disconnectManager(id, 'Account suspended')`
4. **Logout administrativo**: `disconnectManager(id, 'Logged out by admin')`
5. **Mantenimiento**: Cerrar todas las sesiones de tenants específicos

### Métricas y Monitoreo

Las sesiones cerradas por este sistema se reflejan en las métricas:

```typescript
const metrics = connectionManager.getMetrics();
console.log(`
  Active connections: ${metrics.activeConnections}
  Disconnections today: ${metrics.totalDisconnections}
`);

// Los logs incluyen información de takeover:
// "🔄 Session takeover: manager mgr_12345 had 1 previous session(s)"
```

---

## 🚀 Próximos Pasos

1. Implementar tus eventos específicos en el Event Bridge
2. Crear controllers SSE para tus features
3. Configurar monitoreo con Prometheus/Grafana
4. Implementar cliente Unity completo con manejo de `session_terminated`
5. Agregar tests de integración
6. Decidir política de sesiones (única vs múltiple) según requerimientos

---

## 📞 Soporte

Para más información sobre la arquitectura SSE, consulta la documentación teórica en `/docs`.
