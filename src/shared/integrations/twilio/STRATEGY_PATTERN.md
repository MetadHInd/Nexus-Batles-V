# Sistema de Mensajería con Patrón Strategy

## 🎯 Arquitectura

Sistema flexible de mensajería usando patrón **Strategy** que permite gestionar múltiples proveedores y configuraciones independientes.

### Componentes Principales

```
twilio/
├── strategies/
│   ├── messaging-strategy.interface.ts   # Interfaces Strategy
│   └── twilio.strategy.ts                # Implementación Twilio
├── messaging-strategy-manager.service.ts # Context/Manager
├── controllers/
│   └── messaging-strategy.controller.ts  # API REST
└── twilio.module.ts                      # Módulo NestJS
```

## 📊 Base de Datos

### Tablas Creadas

1. **messaging_provider**: Proveedores disponibles (Twilio, etc.)
2. **messaging_service**: Servicios de mensajería independientes
3. **messaging_service_credential**: Credenciales por servicio
4. **phone_number**: Números de teléfono asignados a servicios
5. **messaging_log**: Log de mensajes enviados

### Relaciones

```
messaging_provider (1) ──→ (N) messaging_service
messaging_service (1) ──→ (N) messaging_service_credential
messaging_service (1) ──→ (N) phone_number
messaging_service (1) ──→ (N) messaging_log
```

## 🔧 Uso del Sistema

### 1. Enviar SMS

```typescript
import { MessagingStrategyManager } from '@/twilio/messaging-strategy-manager.service';

// Inyectar servicio
constructor(private strategyManager: MessagingStrategyManager) {}

// Enviar SMS
const result = await this.strategyManager.sendSms(
  {
    to: '+1234567890',
    body: 'Hola desde Strategy!',
  },
  'mi-servicio-id', // ID del servicio
);
```

### 2. Enviar WhatsApp

```typescript
const result = await this.strategyManager.sendWhatsApp(
  {
    to: '+1234567890',
    body: 'Mensaje por WhatsApp',
    type: 'text',
  },
  'mi-servicio-id',
);
```

### 3. Registrar Nueva Estrategia

```typescript
// Crear nueva estrategia (ej: AWS SNS)
class SNSStrategy implements ISmsStrategy {
  readonly name = 'aws-sns';
  readonly type = 'sms';
  
  async sendSms(message: SmsMessage, config: MessagingConfig) {
    // Implementación AWS SNS
  }
}

// Registrar en el manager
strategyManager.registerStrategy('aws-sns', new SNSStrategy());
```

## 🌐 API Endpoints

### Listar Estrategias
```http
GET /messaging-strategy/strategies
```

**Response:**
```json
{
  "strategies": ["twilio"]
}
```

### Obtener Configuración de Servicio
```http
GET /messaging-strategy/service/:serviceId/config
```

**Response:**
```json
{
  "success": true,
  "config": {
    "serviceId": "default",
    "serviceName": "default",
    "provider": "twilio",
    "phoneNumberId": "+1234567890",
    "credentials": {
      "accountSid": "AC...",
      "authToken": "..."
    }
  }
}
```

### Enviar SMS
```http
POST /messaging-strategy/sms/send
Content-Type: application/json

{
  "message": {
    "to": "+1234567890",
    "body": "Hola mundo"
  },
  "serviceId": "default"
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "SM...",
  "provider": "twilio",
  "timestamp": "2026-01-10T..."
}
```

### Enviar WhatsApp
```http
POST /messaging-strategy/whatsapp/send
Content-Type: application/json

{
  "message": {
    "to": "+1234567890",
    "body": "Hola por WhatsApp",
    "type": "text"
  },
  "serviceId": "default"
}
```

## 🗄️ Configuración de Base de Datos

### 1. Crear Tablas

```bash
psql -U postgres -d gestion_contable -f database-setup-messaging.sql
```

### 2. Configurar Servicio

```sql
-- Insertar servicio
INSERT INTO messaging_service (name, description, provider_id)
VALUES (
  'mi-servicio',
  'Servicio de mensajería para mi app',
  (SELECT id FROM messaging_provider WHERE name = 'twilio')
);

-- Insertar credenciales
INSERT INTO messaging_service_credential (service_id, credential_key, credential_value)
VALUES 
  ((SELECT id FROM messaging_service WHERE name = 'mi-servicio'), 'account_sid', 'AC123...'),
  ((SELECT id FROM messaging_service WHERE name = 'mi-servicio'), 'auth_token', 'abc123...');

-- Asignar número de teléfono
INSERT INTO phone_number (phone_number, formatted_number, provider_id, service_id)
VALUES (
  '+1234567890',
  '+1 (234) 567-890',
  (SELECT id FROM messaging_provider WHERE name = 'twilio'),
  (SELECT id FROM messaging_service WHERE name = 'mi-servicio')
);
```

## 🔐 Variables de Entorno

```env
# Twilio (Fallback si no hay config en BD)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890
```

## 🚀 Ventajas del Sistema

### 1. **Flexibilidad**
- Múltiples proveedores (Twilio, AWS SNS, Vonage, etc.)
- Configuración independiente por servicio
- Fácil agregar nuevos proveedores

### 2. **Escalabilidad**
- Diferentes números para diferentes servicios
- Gestión de credenciales por servicio
- Log completo de mensajes

### 3. **Mantenibilidad**
- Patrón Strategy bien definido
- Sin lógica de negocio en estrategias
- Fácil testing (mock de estrategias)

### 4. **Gestión Centralizada**
- Todas las configuraciones en BD
- Auditoría completa de mensajes
- Activar/desactivar servicios sin código

## 📝 Ejemplo: Agregar Nuevo Proveedor

```typescript
// 1. Crear estrategia
class VonageStrategy implements ISmsStrategy {
  readonly name = 'vonage';
  readonly type = 'sms';
  
  validateConfig(config: MessagingConfig): boolean {
    return !!(config.credentials.apiKey && config.credentials.apiSecret);
  }
  
  async sendSms(message: SmsMessage, config: MessagingConfig): Promise<SmsResult> {
    // Implementación Vonage
    const vonage = new Vonage({
      apiKey: config.credentials.apiKey,
      apiSecret: config.credentials.apiSecret,
    });
    
    const result = await vonage.message.sendSms(
      config.phoneNumberId,
      message.to,
      message.body,
    );
    
    return {
      success: true,
      messageId: result.messageId,
      provider: 'vonage',
      timestamp: new Date().toISOString(),
    };
  }
}

// 2. Registrar en module
@Module({
  providers: [
    TwilioStrategy,
    VonageStrategy, // Nueva estrategia
    MessagingStrategyManager,
  ],
})
export class TwilioModule {
  constructor(
    private strategyManager: MessagingStrategyManager,
    private vonageStrategy: VonageStrategy,
  ) {
    // Registrar al inicializar
    this.strategyManager.registerStrategy('vonage', this.vonageStrategy);
  }
}

// 3. Insertar en BD
INSERT INTO messaging_provider (name, type) VALUES ('vonage', 'sms');
```

## 🧪 Testing

```typescript
describe('MessagingStrategyManager', () => {
  it('should send SMS using Twilio strategy', async () => {
    const result = await strategyManager.sendSms(
      { to: '+1234567890', body: 'Test' },
      'test-service',
    );
    
    expect(result.success).toBe(true);
    expect(result.provider).toBe('twilio');
  });
});
```

## 📚 Referencias

- [Patrón Strategy](https://refactoring.guru/design-patterns/strategy)
- [Twilio API](https://www.twilio.com/docs/sms)
- [NestJS Providers](https://docs.nestjs.com/providers)
