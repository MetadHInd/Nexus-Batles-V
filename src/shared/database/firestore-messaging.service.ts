import { Injectable, Logger } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import {
  FirestoreMessage,
  FirestoreConversation,
  MessageDirection,
  MessageChannel,
  MessageStatus,
  MessageQueryFilters,
} from './interfaces/firestore-message.interface';

/**
 * Servicio para gestionar mensajes en Firestore
 * Almacena todos los mensajes de usuario-sistema en ambas direcciones
 */
@Injectable()
export class FirestoreMessagingService {
  private readonly logger = new Logger(FirestoreMessagingService.name);
  private readonly messagesCollection = 'messages';
  private readonly conversationsCollection = 'conversations';

  constructor(private readonly firestore: FirestoreService) {}

  /**
   * Guardar mensaje en Firestore
   */
  async saveMessage(message: Omit<FirestoreMessage, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = new Date();
      const messageData: Omit<FirestoreMessage, 'id'> = {
        ...message,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await this.firestore.collection(this.messagesCollection).add(messageData);
      
      this.logger.log(`Message saved: ${docRef.id} (${message.direction} - ${message.channel})`);

      // Actualizar conversación
      await this.updateConversation(message.conversationId, message);

      return docRef.id;
    } catch (error) {
      this.logger.error(`Error saving message: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Guardar mensaje de entrada (usuario -> sistema)
   */
  async saveInboundMessage(data: {
    conversationId: string;
    sessionId?: string;
    channel: MessageChannel;
    from: string;
    to: string;
    body: string;
    userId?: string;
    userName?: string;
    provider?: string;
    providerMessageId?: string;
    metadata?: Record<string, any>;
  }): Promise<string> {
    return this.saveMessage({
      ...data,
      direction: MessageDirection.INBOUND,
      status: MessageStatus.DELIVERED, // Mensaje recibido
    });
  }

  /**
   * Guardar mensaje de salida (sistema -> usuario)
   */
  async saveOutboundMessage(data: {
    conversationId: string;
    sessionId?: string;
    channel: MessageChannel;
    from: string;
    to: string;
    body: string;
    serviceId?: string;
    provider?: string;
    providerMessageId?: string;
    metadata?: Record<string, any>;
  }): Promise<string> {
    return this.saveMessage({
      ...data,
      direction: MessageDirection.OUTBOUND,
      status: MessageStatus.SENT,
    });
  }

  /**
   * Actualizar estado de mensaje
   */
  async updateMessageStatus(
    messageId: string,
    status: MessageStatus,
    additionalData?: Partial<FirestoreMessage>,
  ): Promise<void> {
    try {
      const updateData: any = {
        status,
        updatedAt: new Date(),
      };

      if (status === MessageStatus.SENT && !additionalData?.sentAt) {
        updateData.sentAt = new Date();
      }
      if (status === MessageStatus.DELIVERED && !additionalData?.deliveredAt) {
        updateData.deliveredAt = new Date();
      }
      if (status === MessageStatus.READ && !additionalData?.readAt) {
        updateData.readAt = new Date();
      }

      if (additionalData) {
        Object.assign(updateData, additionalData);
      }

      await this.firestore
        .collection(this.messagesCollection)
        .doc(messageId)
        .update(updateData);

      this.logger.log(`Message ${messageId} status updated to ${status}`);
    } catch (error) {
      this.logger.error(`Error updating message status: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtener mensajes de una conversación
   */
  async getConversationMessages(
    conversationId: string,
    limit: number = 100,
  ): Promise<FirestoreMessage[]> {
    try {
      const snapshot = await this.firestore
        .collection(this.messagesCollection)
        .where('conversationId', '==', conversationId)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      const messages: FirestoreMessage[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as FirebaseFirestore.DocumentData;
        messages.push({
          id: doc.id,
          ...data,
        } as FirestoreMessage);
      });

      return messages.reverse(); // Orden cronológico
    } catch (error) {
      this.logger.error(`Error getting conversation messages: ${error.message}`);
      throw error;
    }
  }

  /**
   * Buscar mensajes con filtros
   */
  async searchMessages(filters: MessageQueryFilters): Promise<FirestoreMessage[]> {
    try {
      let query: any = this.firestore.collection(this.messagesCollection);

      if (filters.conversationId) {
        query = query.where('conversationId', '==', filters.conversationId);
      }
      if (filters.sessionId) {
        query = query.where('sessionId', '==', filters.sessionId);
      }
      if (filters.userId) {
        query = query.where('userId', '==', filters.userId);
      }
      if (filters.channel) {
        query = query.where('channel', '==', filters.channel);
      }
      if (filters.direction) {
        query = query.where('direction', '==', filters.direction);
      }
      if (filters.status) {
        query = query.where('status', '==', filters.status);
      }
      if (filters.from) {
        query = query.where('from', '==', filters.from);
      }
      if (filters.to) {
        query = query.where('to', '==', filters.to);
      }
      if (filters.startDate) {
        query = query.where('createdAt', '>=', filters.startDate);
      }
      if (filters.endDate) {
        query = query.where('createdAt', '<=', filters.endDate);
      }

      query = query.orderBy('createdAt', 'desc');

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const snapshot = await query.get();
      const messages: FirestoreMessage[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data() as FirebaseFirestore.DocumentData;
        messages.push({
          id: doc.id,
          ...data,
        } as FirestoreMessage);
      });

      return messages;
    } catch (error) {
      this.logger.error(`Error searching messages: ${error.message}`);
      throw error;
    }
  }

  /**
   * Crear o actualizar conversación
   */
  async updateConversation(
    conversationId: string,
    lastMessage: Partial<FirestoreMessage>,
  ): Promise<void> {
    try {
      const conversationRef = this.firestore
        .collection(this.conversationsCollection)
        .doc(conversationId);

      const conversationDoc = await conversationRef.get();
      const now = new Date();

      if (!conversationDoc.exists) {
        // Crear nueva conversación
        const newConversation: Omit<FirestoreConversation, 'id'> = {
          channel: lastMessage.channel!,
          participants: [
            {
              phoneNumber: lastMessage.from,
              userId: lastMessage.userId,
              name: lastMessage.userName,
            },
          ],
          isActive: true,
          lastMessageAt: now,
          lastMessagePreview: lastMessage.body?.substring(0, 100),
          messageCount: 1,
          unreadCount: lastMessage.direction === MessageDirection.INBOUND ? 1 : 0,
          serviceId: lastMessage.serviceId,
          metadata: lastMessage.metadata,
          createdAt: now,
          updatedAt: now,
        };

        await conversationRef.set(newConversation);
        this.logger.log(`Conversation created: ${conversationId}`);
      } else {
        // Actualizar conversación existente
        const conversationData = conversationDoc.data() as any;
        const updateData: any = {
          lastMessageAt: now,
          lastMessagePreview: lastMessage.body?.substring(0, 100),
          messageCount: (conversationData?.messageCount || 0) + 1,
          updatedAt: now,
        };

        if (lastMessage.direction === MessageDirection.INBOUND) {
          updateData.unreadCount = (conversationData?.unreadCount || 0) + 1;
        }

        await conversationRef.update(updateData);
      }
    } catch (error) {
      this.logger.error(`Error updating conversation: ${error.message}`);
      // No lanzar error para no bloquear el guardado del mensaje
    }
  }

  /**
   * Obtener conversación por ID
   */
  async getConversation(conversationId: string): Promise<FirestoreConversation | null> {
    try {
      const doc = await this.firestore
        .collection(this.conversationsCollection)
        .doc(conversationId)
        .get();

      if (!doc.exists) {
        return null;
      }

      const data = doc.data() as FirebaseFirestore.DocumentData;
      return {
        id: doc.id,
        ...data,
      } as FirestoreConversation;
    } catch (error) {
      this.logger.error(`Error getting conversation: ${error.message}`);
      return null;
    }
  }

  /**
   * Listar conversaciones activas
   */
  async listActiveConversations(limit: number = 50): Promise<FirestoreConversation[]> {
    try {
      const snapshot = await this.firestore
        .collection(this.conversationsCollection)
        .where('isActive', '==', true)
        .orderBy('lastMessageAt', 'desc')
        .limit(limit)
        .get();

      const conversations: FirestoreConversation[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as FirebaseFirestore.DocumentData;
        conversations.push({
          id: doc.id,
          ...data,
        } as FirestoreConversation);
      });

      return conversations;
    } catch (error) {
      this.logger.error(`Error listing conversations: ${error.message}`);
      throw error;
    }
  }

  /**
   * Marcar mensajes como leídos
   */
  async markMessagesAsRead(conversationId: string): Promise<number> {
    try {
      const messages = await this.firestore
        .collection(this.messagesCollection)
        .where('conversationId', '==', conversationId)
        .where('direction', '==', MessageDirection.INBOUND)
        .where('status', '!=', MessageStatus.READ)
        .get();

      let count = 0;
      const batch = this.firestore.collection(this.messagesCollection).firestore.batch();

      messages.forEach((doc) => {
        batch.update(doc.ref, {
          status: MessageStatus.READ,
          readAt: new Date(),
          updatedAt: new Date(),
        });
        count++;
      });

      if (count > 0) {
        await batch.commit();
        
        // Actualizar contador de no leídos
        await this.firestore
          .collection(this.conversationsCollection)
          .doc(conversationId)
          .update({ unreadCount: 0 });
      }

      return count;
    } catch (error) {
      this.logger.error(`Error marking messages as read: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de mensajería
   */
  async getMessagingStats(filters?: {
    startDate?: Date;
    endDate?: Date;
    channel?: MessageChannel;
  }): Promise<{
    totalMessages: number;
    inbound: number;
    outbound: number;
    byChannel: Record<string, number>;
    byStatus: Record<string, number>;
  }> {
    try {
      let query: any = this.firestore.collection(this.messagesCollection);

      if (filters?.startDate) {
        query = query.where('createdAt', '>=', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.where('createdAt', '<=', filters.endDate);
      }
      if (filters?.channel) {
        query = query.where('channel', '==', filters.channel);
      }

      const snapshot = await query.get();
      
      const stats = {
        totalMessages: 0,
        inbound: 0,
        outbound: 0,
        byChannel: {} as Record<string, number>,
        byStatus: {} as Record<string, number>,
      };

      snapshot.forEach((doc) => {
        const message = doc.data() as FirestoreMessage;
        stats.totalMessages++;

        if (message.direction === MessageDirection.INBOUND) {
          stats.inbound++;
        } else {
          stats.outbound++;
        }

        stats.byChannel[message.channel] = (stats.byChannel[message.channel] || 0) + 1;
        stats.byStatus[message.status] = (stats.byStatus[message.status] || 0) + 1;
      });

      return stats;
    } catch (error) {
      this.logger.error(`Error getting messaging stats: ${error.message}`);
      throw error;
    }
  }
}
