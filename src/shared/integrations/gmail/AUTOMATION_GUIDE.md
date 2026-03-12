# 🤖 Gmail Automation - Guía Rápida

## ¿Qué hace?

El sistema de automatización de Gmail **detecta automáticamente cuando llegan correos nuevos** y ejecuta acciones predefinidas **sin intervención manual**. Es perfecto para:

- 📧 Procesar correos de soporte automáticamente
- 📋 Crear tickets cuando llegan problemas
- 💰 Extraer datos de facturas
- 🔔 Enviar notificaciones al equipo
- 📊 Registrar todos los correos en logs

## 🚀 Uso Inmediato (3 pasos)

### 1. Obtener tokens de Gmail
```bash
# Primero obtén la URL de autorización
GET /gmail/auth-url

# Ve a la URL, autoriza y obtén el código
# Luego intercambia el código por tokens
POST /gmail/exchange-code
{
  "authorizationCode": "tu_codigo_aqui"
}
```

### 2. Registrar para monitoreo automático
```bash
# Configuración más simple - registra TODO
POST /gmail/automation/examples/setup-simple-logging
{
  "userId": "tu_usuario_123",
  "accessToken": "ya29.a0Ae4lv...",
  "refreshToken": "1//04..."
}
```

**¡Y LISTO!** 🎉 Desde ese momento, cada 30 segundos el sistema:
- ✅ Verifica si hay correos nuevos
- ✅ Los procesa automáticamente
- ✅ Los registra en los logs
- ✅ Ejecuta las acciones configuradas

### 3. Ver los resultados
Los correos nuevos aparecerán automáticamente en tus logs:
```
[NUEVO CORREO] Usuario: tu_usuario_123
De: cliente@ejemplo.com
Asunto: Problema con mi pedido
Fecha: 2024-01-20T14:30:00.000Z
Contenido: Hola, tengo un problema con mi pedido #12345...
Adjuntos: 1
---
```

## 🎯 Configuraciones Pre-hechas

### Opción 1: Solo Logging (Recomendado para empezar)
```bash
POST /gmail/automation/examples/setup-simple-logging
```
- ✅ Procesa TODOS los correos nuevos
- ✅ Los registra en logs detallados
- ✅ Perfecto para empezar y entender el flujo

### Opción 2: Correos de Soporte
```bash
POST /gmail/automation/examples/setup-support-automation
```
- ✅ Solo procesa correos a support@galatealabs.ai
- ✅ Crea tickets automáticamente
- ✅ Notifica al equipo

## 🔧 Endpoints Principales

| Endpoint | Descripción |
|----------|-------------|
| `POST /gmail/automation/register` | Registrar usuario para monitoreo |
| `DELETE /gmail/automation/users/:userId` | Desregistrar usuario |
| `POST /gmail/automation/users/:userId/test` | Probar configuración manualmente |
| `POST /gmail/automation/force-check` | Forzar verificación de todos |
| `GET /gmail/automation/status` | Estado del servicio |

## ⚡ Flujo Automático

```
Cada 30 segundos → Verificar correos nuevos → ¿Hay nuevos? 
    ↓                                              ↓
Registrar logs ← Ejecutar acciones ← Aplicar filtros ← SÍ
```

## 🎮 Personalización Avanzada

### Crear filtros personalizados
```javascript
const config = {
  userId: "tu_usuario",
  accessToken: "token",
  refreshToken: "refresh_token",
  filters: [
    {
      name: "Facturas urgentes",
      query: "subject:(factura urgent) has:attachment",
      enabled: true
    }
  ],
  actions: [
    {
      name: "Webhook a contabilidad",
      type: "webhook",
      config: {
        url: "https://tu-sistema.com/api/facturas",
        headers: { "Authorization": "Bearer tu-token" }
      },
      enabled: true
    }
  ]
};
```

### Acciones disponibles
- 🔗 **webhook**: Envía datos a URL externa
- ⚙️ **function**: Ejecuta función personalizada
- 💾 **database**: Guarda en base de datos
- 🔔 **notification**: Envía notificaciones
- ✅ **mark_read**: Marca como leído

## 🛠️ Funciones Personalizadas Incluidas

### `processSupport`
Crea tickets de soporte automáticamente
```javascript
{
  name: "Crear ticket",
  type: "function",
  config: { functionName: "processSupport" }
}
```

### `extractInvoice`
Extrae datos de facturas con IA
```javascript
{
  name: "Procesar factura",
  type: "function", 
  config: { functionName: "extractInvoice" }
}
```

### `autoReply`
Envía respuestas automáticas
```javascript
{
  name: "Respuesta automática",
  type: "function",
  config: { functionName: "autoReply" }
}
```

## 🔍 Monitoreo y Debug

### Ver estado del servicio
```bash
GET /gmail/automation/status
```

### Forzar verificación manual
```bash
POST /gmail/automation/force-check
```

### Probar usuario específico
```bash
POST /gmail/automation/users/tu_usuario/test
```

## 💡 Tips y Mejores Prácticas

### ✅ Recomendado
- Empieza con `setup-simple-logging` para entender el flujo
- Revisa los logs para ver qué correos se procesan
- Usa filtros específicos para evitar procesar demasiados correos
- Prueba configuraciones con `/test` antes de activar

### ❌ Evitar
- No registres el mismo usuario múltiples veces
- No uses filtros muy amplios que procesen miles de correos
- No olvides manejar el refresh de tokens

## 🆘 Troubleshooting

### Error: "Usuario no registrado"
```bash
# Registra el usuario primero
POST /gmail/automation/examples/setup-simple-logging
```

### Error: "Token expirado"
El sistema refresca tokens automáticamente, pero si persiste:
```bash
# Reregistra con tokens nuevos
POST /gmail/automation/register
```

### No se procesan correos
```bash
# Verifica que el servicio esté activo
GET /gmail/automation/status

# Fuerza una verificación
POST /gmail/automation/force-check
```

## 🎯 ¡Perfecto para GALATEA!

Este sistema es ideal para tu proyecto porque:
- ✅ **Automatización real**: No necesitas hacer nada manual
- ✅ **Escalable**: Puede manejar múltiples usuarios
- ✅ **Flexible**: Fácil agregar nuevas acciones
- ✅ **Integrable**: Se conecta con tus módulos existentes
- ✅ **Logs detallados**: Puedes ver exactamente qué pasa

¿Listo para probarlo? Solo ejecuta el paso 2 y verás los correos aparecer automáticamente en tus logs! 🚀

