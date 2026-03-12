# Gmail Integration Module

Este módulo proporciona una integración completa con la API de Gmail para leer correos electrónicos, gestionar mensajes y obtener información de la cuenta.

## Características

- **Autenticación OAuth 2.0**: Proceso completo de autenticación con Gmail
- **Búsqueda de mensajes**: Búsqueda avanzada con filtros personalizables
- **Lectura de correos**: Obtención y parseo de mensajes de Gmail
- **Gestión de adjuntos**: Descarga y manejo de archivos adjuntos
- **Gestión de etiquetas**: Obtención de etiquetas de Gmail
- **Hilos de conversación**: Manejo de threads de Gmail
- **Marcado de mensajes**: Marcar como leído/no leído

## Configuración

### Variables de entorno requeridas

```env
# Gmail OAuth Credentials
GMAIL_CLIENT_ID=your_google_client_id
GMAIL_CLIENT_SECRET=your_google_client_secret
GMAIL_REDIRECT_URI=http://localhost:3000/auth/gmail/callback
```

### Configuración en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la Gmail API
4. Crea credenciales OAuth 2.0
5. Configura las URLs de redirección autorizadas

## Uso básico

### 1. Importar el módulo

```typescript
import { GmailModule } from '@/shared/integrations/gmail';

@Module({
  imports: [GmailModule],
  // ...
})
export class YourModule {}
```

### 2. Usar el servicio

```typescript
import { GmailService } from '@/shared/integrations/gmail';

@Injectable()
export class YourService {
  constructor(private readonly gmailService: GmailService) {}

  async getEmails(accessToken: string) {
    return await this.gmailService.searchMessages(accessToken, {
      query: 'is:unread',
      maxResults: 10
    });
  }
}
```

## Endpoints disponibles

### Autenticación

- `GET /gmail/auth-url` - Obtiene URL de autorización OAuth
- `POST /gmail/exchange-code` - Intercambia código por tokens
- `POST /gmail/refresh-token` - Refresca token de acceso

### Perfil y configuración

- `GET /gmail/profile` - Obtiene perfil del usuario
- `GET /gmail/labels` - Obtiene todas las etiquetas

### Mensajes

- `GET /gmail/messages/search` - Busca mensajes
- `GET /gmail/messages/:messageId` - Obtiene mensaje específico
- `GET /gmail/messages/:messageId/parsed` - Obtiene mensaje parseado
- `GET /gmail/unread-count` - Cuenta mensajes no leídos

### Adjuntos

- `GET /gmail/messages/:messageId/attachments/:attachmentId` - Descarga adjunto

### Hilos

- `GET /gmail/threads/:threadId` - Obtiene hilo de conversación

### Gestión

- `POST /gmail/messages/:messageId/mark-read` - Marca como leído
- `POST /gmail/messages/:messageId/mark-unread` - Marca como no leído

## Ejemplos de búsqueda

### Búsquedas básicas

```typescript
// Mensajes no leídos
const unreadMessages = await gmailService.searchMessages(accessToken, {
  query: 'is:unread'
});

// Mensajes de un remitente específico
const fromSender = await gmailService.searchMessages(accessToken, {
  query: 'from:ejemplo@gmail.com'
});

// Mensajes con asunto específico
const withSubject = await gmailService.searchMessages(accessToken, {
  query: 'subject:"Asunto importante"'
});

// Mensajes con archivos adjuntos
const withAttachments = await gmailService.searchMessages(accessToken, {
  query: 'has:attachment'
});
```

### Búsquedas avanzadas

```typescript
// Mensajes de los últimos 7 días
const recent = await gmailService.searchMessages(accessToken, {
  query: 'newer_than:7d'
});

// Mensajes importantes no leídos
const importantUnread = await gmailService.searchMessages(accessToken, {
  query: 'is:important is:unread'
});

// Mensajes con etiquetas específicas
const labeled = await gmailService.searchMessages(accessToken, {
  labelIds: ['INBOX', 'IMPORTANT']
});
```

## Interfaces principales

### GmailMessage
```typescript
interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  historyId: string;
  internalDate: string;
  payload: GmailMessagePayload;
  sizeEstimate: number;
}
```

### ParsedEmailContent
```typescript
interface ParsedEmailContent {
  subject: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  date: Date;
  textContent?: string;
  htmlContent?: string;
  attachments: EmailAttachment[];
}
```

### GmailSearchOptions
```typescript
interface GmailSearchOptions {
  query?: string;
  maxResults?: number;
  pageToken?: string;
  includeSpamTrash?: boolean;
  labelIds?: string[];
}
```

## Manejo de errores

El módulo maneja automáticamente los errores comunes:

- **401 Unauthorized**: Token expirado o inválido
- **403 Forbidden**: Permisos insuficientes
- **404 Not Found**: Mensaje o recurso no encontrado
- **429 Too Many Requests**: Límite de rate limiting alcanzado

## Limitaciones de la API

- **Cuota diaria**: 1,000,000,000 unidades por día
- **Cuota por usuario**: 250 unidades por usuario por segundo
- **Cuota por 100 segundos**: 15,000 unidades por 100 segundos

## Seguridad

- Los tokens de acceso se manejan de forma segura
- Se recomienda usar HTTPS en producción
- Los tokens de refresco deben almacenarse de forma segura
- Validar siempre los permisos antes de realizar operaciones

## Desarrollo y testing

Para probar el módulo localmente:

1. Configura las variables de entorno
2. Ejecuta el servidor de desarrollo
3. Usa los endpoints documentados en Swagger
4. Verifica los logs para debugging

## Soporte

Para reportar issues o solicitar nuevas características, consulta la documentación del proyecto principal.