/**
 * Interfaces para gestión de mensajes en Firestore
 */

export enum MessageDirection {
  INBOUND = 'inbound',   // Usuario -> Sistema
  OUTBOUND = 'outbound', // Sistema -> Usuario
}

export enum MessageChannel {
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  EMAIL = 'email',
  PUSH = 'push',
  WEB = 'web',
  VOICE = 'voice',
}

export enum MessageStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
}

/**
 * Estructura de mensaje en Firestore
 */
export interface FirestoreMessage {
  id?: string;
  conversationId: string;
  sessionId?: string;
  direction: MessageDirection;
  channel: MessageChannel;
  status: MessageStatus;
  
  // Participantes
  from: string;
  to: string;
  
  // Contenido
  body: string;
  mediaUrls?: string[];
  metadata?: Record<string, any>;
  
  // Proveedor
  provider?: string;
  providerMessageId?: string;
  
  // Usuario/Sistema
  userId?: string;
  userName?: string;
  serviceId?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  
  // Error
  error?: string;
  errorCode?: string;
}

/**
 * Conversación en Firestore
 */
export interface FirestoreConversation {
  id?: string;
  channel: MessageChannel;
  participants: {
    userId?: string;
    phoneNumber?: string;
    email?: string;
    name?: string;
  }[];
  
  // Estado
  isActive: boolean;
  lastMessageAt: Date;
  lastMessagePreview?: string;
  messageCount: number;
  unreadCount: number;
  
  // Metadata
  serviceId?: string;
  metadata?: Record<string, any>;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Filtros para búsqueda de mensajes
 */
export interface MessageQueryFilters {
  conversationId?: string;
  sessionId?: string;
  userId?: string;
  channel?: MessageChannel;
  direction?: MessageDirection;
  status?: MessageStatus;
  from?: string;
  to?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}
