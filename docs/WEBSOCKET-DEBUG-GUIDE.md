# WebSocket Debug Guide - GALATEA Intelligence System

## 🔍 Overview

Este documento explica cómo usar los logs de debugging del sistema WebSocket de GALATEA Intelligence para diagnosticar problemas de conectividad, procesamiento de jobs y comunicación en tiempo real.

## 🏷️ Log Filtering

Todos los logs de debugging del sistema WebSocket contienen la etiqueta **"WS Debug"** para facilitar el filtrado:

```bash
# Filtrar solo logs de WebSocket debugging
npm run start | grep "WS Debug"

# En desarrollo con watch mode
npm run start:dev | grep "WS Debug"

# Filtrar logs específicos por componente
npm run start:dev | grep "WS Debug.*Gateway"     # Solo Gateway
npm run start:dev | grep "WS Debug.*Job"         # Solo Jobs
npm run start:dev | grep "WS Debug.*Event Bus"   # Solo Event Bus
```

## 📊 Log Categories

### 🔌 **Connection Logs (Gateway)**

#### **Successful Connection Flow**
```
WS Debug 🔌 Cliente AIA conectado: abc123
WS Debug 📋 Handshake data: {"auth":{"token":"jwt-token"},"headers":{...}}
WS Debug 🔐 Validando token para cliente abc123
WS Debug ✅ Token validado para manager 456
WS Debug 🆔 Sesión creada: session-789 para manager 456
WS Debug 📊 Estado actual - Clientes conectados: 1, Sesiones activas: 1
WS Debug 🏠 Cliente abc123 unido a sala: manager-456
WS Debug 📤 Evento AIA_SESSION_CREATED enviado: {"sessionId":"session-789",...}
WS Debug ✅ Conexión AIA completada exitosamente - Cliente: abc123, Sesión: session-789, Manager: 456
```

#### **Connection Problems**
```
WS Debug ❌ Error en conexión AIA para cliente abc123: [error details]
WS Debug 📤 Evento AIA_ERROR enviado: {"error":"Error al conectar con AIA",...}
```

### 🚀 **Job Processing Logs**

#### **Job Creation**
```
WS Debug 🆕 Creando nuevo job para manager 456
WS Debug 📋 Job data: {"sessionId":"session-789","managerId":"456","query":"¿Órdenes de hoy?..."}
WS Debug ✅ Job job-123 creado exitosamente para manager 456
WS Debug 📊 Estado de cola - Jobs pendientes: 1, Jobs totales: 1
WS Debug 🚀 Iniciando procesamiento inmediato del job job-123
```

#### **Job Processing Flow**
```
WS Debug 🔄 Verificando cola de procesamiento - Jobs en cola: 1, Procesando: false
WS Debug 📤 Job extraído de cola - SessionId: session-789, ManagerId: 456
WS Debug 🎯 Job encontrado - JobId: job-123, Status: PENDING
WS Debug 🚀 Iniciando procesamiento de job job-123 para manager 456
WS Debug 📊 Emitiendo progreso inicial (10%)
WS Debug 📊 Emitiendo progreso de consulta (30%)
WS Debug 🤖 Llamando a Manager Assistant Service
WS Debug ✅ Manager Assistant respondió - Longitud respuesta: 1250 caracteres
WS Debug 📊 Emitiendo progreso de procesamiento (70%)
WS Debug 📊 Emitiendo progreso final (90%)
WS Debug 📡 Emitiendo evento COMPLETED via Event Bus
WS Debug ✅ Job job-123 completado exitosamente en 2500ms
WS Debug 🏁 Procesamiento finalizado - isProcessing: false
```

#### **Job Processing Errors**
```
WS Debug ❌ Error procesando job job-123: [error message]
WS Debug 📡 Emitiendo evento FAILED via Event Bus
```

### 📡 **Event Bus Communication**

#### **Progress Events**
```
WS Debug 📊 Emitiendo progreso - JobId: job-123, Stage: analyzing, Progress: 10%
WS Debug 📈 JobInfo actualizado - Progress: 10%
WS Debug 📡 Emitiendo evento PROGRESS via Event Bus: {"event":"aia:job:progress","jobId":"job-123",...}
WS Debug ✅ Evento PROGRESS emitido exitosamente para job job-123
```

#### **Event Bus Problems**
```
WS Debug ⚠️ No se encontró jobInfo para actualizar progreso - JobId: job-123
WS Debug ❌ No se encontró jobInfo para sessionId: session-789
```

## 🛠️ Common Debugging Scenarios

### **Scenario 1: Frontend No Se Conecta**

**Symptoms:**
- Frontend muestra "Disconnected"
- No aparecen logs de conexión

**Debug Steps:**
1. Verificar logs de conexión:
```bash
npm run start:dev | grep "WS Debug.*🔌"
```

2. Verificar handshake data:
```bash
npm run start:dev | grep "WS Debug.*📋"
```

**Common Issues:**
- Token JWT inválido o expirado
- CORS configuration problems
- Wrong WebSocket URL in frontend

### **Scenario 2: Jobs No Se Procesan**

**Symptoms:**
- Frontend envía query pero no recibe respuesta
- Progress indicators no aparecen

**Debug Steps:**
1. Verificar creación de jobs:
```bash
npm run start:dev | grep "WS Debug.*🆕"
```

2. Verificar cola de procesamiento:
```bash
npm run start:dev | grep "WS Debug.*🔄"
```

3. Verificar Manager Assistant calls:
```bash
npm run start:dev | grep "WS Debug.*🤖"
```

**Common Issues:**
- Manager Assistant service errors
- Database connection problems
- Tool execution failures

### **Scenario 3: Progress Updates No Llegan**

**Symptoms:**
- Job se procesa pero frontend no muestra progreso
- Progress bar stuck at 0%

**Debug Steps:**
1. Verificar Event Bus emissions:
```bash
npm run start:dev | grep "WS Debug.*📡.*PROGRESS"
```

2. Verificar WebSocket room membership:
```bash
npm run start:dev | grep "WS Debug.*🏠"
```

**Common Issues:**
- Client not joined to correct room
- Event Bus listener not set up
- WebSocket connection dropped

### **Scenario 4: Responses No Llegan al Frontend**

**Symptoms:**
- Job completes successfully but frontend doesn't receive response
- Infinite loading state

**Debug Steps:**
1. Verificar job completion:
```bash
npm run start:dev | grep "WS Debug.*✅.*completado"
```

2. Verificar Event Bus COMPLETED events:
```bash
npm run start:dev | grep "WS Debug.*📡.*COMPLETED"
```

**Common Issues:**
- Gateway event handlers not working
- WebSocket room issues
- Frontend event listener problems

## 🔧 Advanced Debugging

### **Enable Verbose Logging**

Para debugging más detallado, puedes modificar el nivel de logs:

```typescript
// En main.ts o app.module.ts
app.useLogger(['error', 'warn', 'log', 'debug', 'verbose']);
```

### **Monitor Event Bus Activity**

Agregar logs temporales al Event Bus:

```typescript
// En cualquier servicio
eventBus.on('*', (eventName, data) => {
  console.log(`WS Debug 📻 Event Bus: ${eventName}`, data);
});
```

### **WebSocket Connection Monitoring**

Verificar estado de conexiones WebSocket:

```typescript
// En AIAGateway
setInterval(() => {
  const stats = this.getStatistics();
  console.log(`WS Debug 📊 Gateway Stats:`, stats);
}, 30000); // Cada 30 segundos
```

## 📈 Performance Monitoring

### **Job Processing Times**

Filtrar logs de tiempo de ejecución:
```bash
npm run start:dev | grep "WS Debug.*completado.*ms"
```

### **Queue Length Monitoring**

Verificar acumulación de jobs:
```bash
npm run start:dev | grep "WS Debug.*Jobs pendientes"
```

### **Memory Usage**

Monitorear crecimiento de mapas en memoria:
```bash
npm run start:dev | grep "WS Debug.*Estado actual"
```

## 🚨 Error Patterns

### **Common Error Signatures**

#### **Token Validation Errors**
```
WS Debug ❌ Error en conexión AIA para cliente abc123: Invalid token
```
**Solution:** Verificar JWT token generation y validation logic

#### **Manager Assistant Timeouts**
```
WS Debug ❌ Error procesando job job-123: Request timeout
```
**Solution:** Verificar database connections y tool performance

#### **Event Bus Communication Failures**
```
WS Debug ⚠️ No se encontró jobInfo para actualizar progreso
```
**Solution:** Verificar job lifecycle y cleanup logic

#### **WebSocket Room Issues**
```
WS Debug 🏠 Cliente abc123 unido a sala: manager-456
# Pero no hay logs de eventos enviados a esa sala
```
**Solution:** Verificar room naming consistency y client management

## 📋 Debugging Checklist

### **Before Starting Debug Session**

- [ ] Clear logs and restart server
- [ ] Verify database connectivity
- [ ] Check Event Bus service status
- [ ] Confirm WebSocket port availability

### **During Debug Session**

- [ ] Monitor connection establishment
- [ ] Track job creation and queuing
- [ ] Verify Event Bus emissions
- [ ] Check WebSocket room assignments
- [ ] Monitor Manager Assistant responses

### **After Debug Session**

- [ ] Document findings
- [ ] Update error handling if needed
- [ ] Consider performance optimizations
- [ ] Update monitoring alerts

## 🎯 Quick Debug Commands

```bash
# Full WebSocket debugging
npm run start:dev | grep "WS Debug" | tee websocket-debug.log

# Connection issues only
npm run start:dev | grep "WS Debug.*\(🔌\|❌\|✅.*conectado\)"

# Job processing only
npm run start:dev | grep "WS Debug.*\(🆕\|🚀\|✅.*completado\|❌.*Error\)"

# Event Bus activity only
npm run start:dev | grep "WS Debug.*📡"

# Performance monitoring
npm run start:dev | grep "WS Debug.*\(ms\|Jobs pendientes\|conectados\)"
```

## 💡 Tips & Best Practices

1. **Use Multiple Terminals:** Run different grep filters in separate terminals for comprehensive monitoring

2. **Log Correlation:** Use sessionId and jobId to correlate logs across different components

3. **Timing Analysis:** Pay attention to timestamps to identify bottlenecks

4. **Pattern Recognition:** Look for recurring error patterns that might indicate systemic issues

5. **Load Testing:** Use multiple frontend connections to test concurrent behavior

6. **Cleanup Monitoring:** Watch for memory leaks in job and session management

Este sistema de debugging te permitirá identificar y resolver rápidamente cualquier problema en el sistema WebSocket de AIA Intelligence.