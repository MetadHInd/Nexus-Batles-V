# 🧪 Guía de Prueba del Sistema SSE

Esta guía te ayudará a probar el sistema de Server-Sent Events (SSE) sin necesidad de tener Unity implementado.

## 📋 Requisitos

1. Servidor NestJS corriendo (por defecto en `http://localhost:3000`)
2. Navegador web moderno (Chrome, Firefox, Edge, Safari)

## 🚀 Paso a Paso

### 1. Iniciar el Servidor

```powershell
cd c:\Users\alejo\galatea-backend
npm run start:dev
```

Verifica que el servidor esté corriendo visitando: `http://localhost:3000`

### 2. Abrir la Herramienta de Prueba

Abre en tu navegador:
```
http://localhost:3000/sse-test.html
```

### 3. Probar Sesión Única (Single Session)

#### Test Básico:

1. **Abre la página en 2 pestañas diferentes** del navegador
2. En **ambas pestañas**:
   - Deja el Manager ID como `test_user_123` (mismo usuario)
   - Deja el resto de campos por defecto
3. **En la Pestaña 1**: Click en "🔌 Conectar"
   - Verás estado "Conectado" (luz verde)
   - Comenzarán a llegar eventos de heartbeat cada 30 segundos
4. **En la Pestaña 2**: Click en "🔌 Conectar"
   - Verás estado "Conectado" en la pestaña 2
   - **Revisa la Pestaña 1**: Recibirá un evento `session_terminated` con el mensaje:
     ```
     "Tu sesión fue cerrada porque iniciaste sesión desde otro dispositivo"
     ```
   - La Pestaña 1 se desconectará automáticamente

✅ **Resultado esperado**: Solo puede haber una conexión activa por usuario

#### Test Múltiples Usuarios:

1. Abre 2 pestañas
2. **Pestaña 1**: Manager ID = `usuario_1`
3. **Pestaña 2**: Manager ID = `usuario_2`
4. Conecta ambas
5. **Resultado**: Ambas permanecen conectadas (son usuarios diferentes)

### 4. Probar Desconexión Forzada

Simula casos como cambio de contraseña, ban, etc:

1. Conecta desde una pestaña con `test_user_123`
2. Verifica que esté conectada
3. Click en "🔴 Desconexión Forzada (API)"
4. **Resultado**: La sesión se cierra inmediatamente con mensaje personalizado

### 5. Enviar Eventos de Prueba

1. Conecta desde una pestaña
2. Click en "📤 Enviar Evento de Prueba"
3. **Resultado**: Recibirás un evento `test_event` en la misma pestaña

## 🧪 Tests Adicionales con cURL/PowerShell

### Ver Sesiones Activas

```powershell
# Ver sesiones de un usuario
curl http://localhost:3000/sse/test/sessions/test_user_123
```

Respuesta:
```json
{
  "managerId": "test_user_123",
  "sessionsCount": 1,
  "sessions": [
    {
      "clientId": "client_abc123",
      "connectedAt": "2026-01-30T...",
      "lastHeartbeat": "2026-01-30T...",
      "metadata": {
        "isTest": true,
        "userAgent": "Mozilla/5.0...",
        "ip": "::1"
      }
    }
  ]
}
```

### Forzar Desconexión

```powershell
curl -X POST http://localhost:3000/sse/test/force-disconnect `
  -H "Content-Type: application/json" `
  -d '{"managerId": "test_user_123", "reason": "Test desde PowerShell"}'
```

### Enviar Evento a Usuario Específico

```powershell
curl -X POST http://localhost:3000/sse/test/send-event `
  -H "Content-Type: application/json" `
  -d '{
    "managerId": "test_user_123",
    "eventType": "custom_notification",
    "payload": {
      "title": "Hola desde PowerShell",
      "message": "Este es un mensaje de prueba"
    }
  }'
```

### Broadcast a Todos

```powershell
curl -X POST http://localhost:3000/sse/test/broadcast `
  -H "Content-Type: application/json" `
  -d '{
    "eventType": "system_announcement",
    "payload": {
      "message": "Mantenimiento en 10 minutos",
      "priority": "high"
    }
  }'
```

### Toggle Modo Sesión Única

```powershell
# Deshabilitar sesión única (permitir múltiples conexiones)
curl -X POST http://localhost:3000/sse/test/single-session-mode `
  -H "Content-Type: application/json" `
  -d '{"enabled": false}'

# Habilitar sesión única
curl -X POST http://localhost:3000/sse/test/single-session-mode `
  -H "Content-Type: application/json" `
  -d '{"enabled": true}'
```

### Ver Estado del Sistema

```powershell
curl http://localhost:3000/sse/test/status
```

## 📊 Casos de Prueba Recomendados

### Caso 1: Sesión Única Básica
- ✅ Conectar desde dispositivo A
- ✅ Conectar desde dispositivo B (mismo usuario)
- ✅ Verificar que A reciba `session_terminated`
- ✅ Verificar que A se desconecte

### Caso 2: Múltiples Usuarios Simultáneos
- ✅ Conectar usuario 1 desde dispositivo A
- ✅ Conectar usuario 2 desde dispositivo B
- ✅ Verificar que ambos permanezcan conectados

### Caso 3: Reconexión Rápida
- ✅ Conectar y desconectar rápidamente
- ✅ Reconectar
- ✅ Verificar que la nueva sesión funcione correctamente

### Caso 4: Heartbeat
- ✅ Conectar y esperar 30 segundos
- ✅ Verificar que lleguen eventos `heartbeat`
- ✅ Los heartbeats mantienen la conexión viva

### Caso 5: Desconexión Forzada
- ✅ Conectar
- ✅ Llamar API de force-disconnect
- ✅ Verificar mensaje personalizado en evento
- ✅ Verificar `reconnect: false` en payload

### Caso 6: Cambio Dinámico de Modo
- ✅ Conectar 2 sesiones del mismo usuario (sesión única OFF)
- ✅ Activar sesión única via API
- ✅ Conectar tercera sesión
- ✅ Verificar que las 2 anteriores se cierren

## 🔍 Qué Observar

### En la Interfaz HTML:
1. **Indicador de Estado**: Verde = Conectado, Rojo = Desconectado
2. **Estadísticas**:
   - Eventos Recibidos
   - Heartbeats (incrementa cada 30s)
   - Reconexiones
   - Sesiones Terminadas
3. **Lista de Eventos**: Muestra eventos en tiempo real

### En los Logs del Servidor:
```
[SSEConnectionManagerService] ✅ SSE Client connected: client_xxx
[SSEConnectionManagerService] 🔄 Session takeover: manager test_user_123 had 1 previous session(s)
[SSEConnectionManagerService] ❌ SSE Client disconnected: client_xxx (Reason: New session from another device)
[SSEConnectionManagerService] 💓 Heartbeat sent to 5 active connections
```

## ⚠️ Troubleshooting

### "Error de conexión" en el navegador
- Verifica que el servidor esté corriendo
- Verifica la URL (debe ser `http://localhost:3000`)
- Revisa la consola del navegador (F12)

### No llegan eventos
- Verifica que la conexión esté establecida (luz verde)
- Revisa los logs del servidor
- Intenta refrescar la página

### Heartbeats no llegan cada 30s
- Los heartbeats solo se envían si hay clientes conectados
- Espera al menos 30 segundos después de conectar

### Session terminated no funciona
- Verifica que `singleSessionPerManager` esté en `true`
- Verifica que uses el MISMO `managerId` en ambas pestañas
- Revisa logs del servidor

## 🎯 Escenarios de Producción a Simular

1. **Usuario cambia de contraseña**: 
   ```powershell
   curl -X POST .../force-disconnect -d '{"managerId":"user","reason":"Password changed"}'
   ```

2. **Administrador banea usuario**:
   ```powershell
   curl -X POST .../force-disconnect -d '{"managerId":"user","reason":"Account suspended by admin"}'
   ```

3. **Mantenimiento programado**:
   ```powershell
   curl -X POST .../broadcast -d '{"eventType":"maintenance","payload":{"starts_in":"10m"}}'
   ```

4. **Usuario inicia sesión en móvil después de tenerla en PC**: Usar HTML en 2 dispositivos diferentes

## 📝 Notas Importantes

1. **El TestSSEController NO tiene autenticación**: Es solo para desarrollo
2. **Remover en producción**: El controller de prueba debe eliminarse antes de deploy
3. **CORS**: Si pruebas desde otro dominio, asegúrate de tener CORS habilitado
4. **HTTPS**: En producción, SSE debe usarse solo con HTTPS

## 🚀 Siguiente Paso: Implementar en Unity

Una vez validado el sistema con esta herramienta, puedes implementar el cliente Unity con confianza:

```csharp
// Ejemplo básico Unity
var eventSource = new EventSource($"{serverUrl}/sse/galatea/stream?token={jwt}&managerId={userId}");

eventSource.OnMessage += (sender, e) => {
    if (e.EventType == "session_terminated") {
        // Manejar cierre de sesión
        ShowSessionTerminatedDialog(e.Data);
    }
};
```

¡Listo para producción! 🎉
