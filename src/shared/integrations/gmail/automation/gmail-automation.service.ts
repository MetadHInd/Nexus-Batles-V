// gmail-automation.service.ts
import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { GmailService } from '../basic/services/gmail.service';
import { ParsedEmailContent, GmailMessage } from '../basic/interfaces';

export interface EmailProcessorConfig {
  userId: string;
  accessToken: string;
  refreshToken: string;
  lastProcessedMessageId?: string;
  lastProcessedDate?: Date;
  filters?: EmailFilter[];
  actions?: EmailAction[];
}

export interface EmailFilter {
  name: string;
  query: string;
  enabled: boolean;
}

export interface EmailAction {
  name: string;
  type: 'webhook' | 'function' | 'database' | 'notification' | 'mark_read';
  config: any;
  enabled: boolean;
}

export interface ProcessedEmail {
  messageId: string;
  userId: string;
  processed: Date;
  actions: string[];
  success: boolean;
  error?: string;
}

@Injectable()
export class GmailAutomationService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(GmailAutomationService.name);
  private activeConfigs: Map<string, EmailProcessorConfig> = new Map();
  private processingInProgress = false;
  private processedMessages: Set<string> = new Set();
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor(
    private readonly gmailService: GmailService,
    private readonly httpService: HttpService,
  ) {}

  async onModuleInit() {
    this.logger.log('Gmail Automation Service iniciado');
    // Cargar configuraciones desde base de datos si existe
    await this.loadConfigurations();
    // Iniciar monitoreo automático
    this.startMonitoring();
  }

  async onModuleDestroy() {
    this.logger.log('Gmail Automation Service detenido');
    this.stopMonitoring();
  }

  /**
   * Iniciar monitoreo automático con intervalo
   */
  private startMonitoring(): void {
    if (this.monitoringInterval) {
      return; // Ya está iniciado
    }

    this.logger.log('Iniciando monitoreo automático de correos cada 30 segundos');
    this.monitoringInterval = setInterval(() => {
      this.checkForNewEmails().catch(error => {
        this.logger.error('Error en verificación automática:', error);
      });
    }, 30000); // 30 segundos
  }

  /**
   * Detener monitoreo automático
   */
  private stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      this.logger.log('Monitoreo automático detenido');
    }
  }

  /**
   * Método público para forzar verificación manual
   */
  async forceCheck(): Promise<void> {
    this.logger.log('Forzando verificación manual de correos');
    await this.checkForNewEmails();
  }

  /**
   * Registrar un usuario para monitoreo automático de correos
   */
  async registerUser(config: EmailProcessorConfig): Promise<void> {
    try {
      // Validar tokens
      await this.gmailService.getProfile(config.accessToken);
      
      this.activeConfigs.set(config.userId, config);
      this.logger.log(`Usuario ${config.userId} registrado para monitoreo automático`);
      
      // Procesar correos existentes no leídos inmediatamente
      await this.processUserEmails(config.userId);
      
      // Guardar configuración en base de datos (opcional)
      await this.saveConfiguration(config);
    } catch (error) {
      this.logger.error(`Error registrando usuario ${config.userId}:`, error);
      throw error;
    }
  }

  /**
   * Desregistrar un usuario del monitoreo
   */
  async unregisterUser(userId: string): Promise<void> {
    this.activeConfigs.delete(userId);
    this.logger.log(`Usuario ${userId} desregistrado del monitoreo`);
    
    // Eliminar de base de datos si existe
    await this.removeConfiguration(userId);
  }

  /**
   * Actualizar configuración de un usuario
   */
  async updateUserConfig(userId: string, updates: Partial<EmailProcessorConfig>): Promise<void> {
    const existing = this.activeConfigs.get(userId);
    if (!existing) {
      throw new Error(`Usuario ${userId} no está registrado`);
    }

    const updated = { ...existing, ...updates };
    this.activeConfigs.set(userId, updated);
    
    await this.saveConfiguration(updated);
    this.logger.log(`Configuración actualizada para usuario ${userId}`);
  }

  /**
   * Cron job que ejecuta cada 30 segundos para verificar nuevos correos
   * Comentado temporalmente hasta instalar @nestjs/schedule
   */
  // @Cron('*/30 * * * * *') // Cada 30 segundos
  private async checkForNewEmails(): Promise<void> {
    if (this.processingInProgress || this.activeConfigs.size === 0) {
      return;
    }

    this.processingInProgress = true;
    
    try {
      const promises = Array.from(this.activeConfigs.keys()).map(userId => 
        this.processUserEmails(userId).catch(error => {
          this.logger.error(`Error procesando correos para usuario ${userId}:`, error);
        })
      );

      await Promise.all(promises);
    } catch (error) {
      this.logger.error('Error en verificación automática de correos:', error);
    } finally {
      this.processingInProgress = false;
    }
  }

  /**
   * Procesar correos de un usuario específico (método público)
   */
  async processUserEmailsManually(userId: string): Promise<void> {
    return this.processUserEmails(userId);
  }

  /**
   * Procesar correos de un usuario específico
   */
  private async processUserEmails(userId: string): Promise<void> {
    const config = this.activeConfigs.get(userId);
    if (!config) return;

    try {
      // Refrescar token si es necesario
      const accessToken = await this.ensureValidToken(config);
      
      // Buscar correos nuevos
      const newMessages = await this.findNewMessages(accessToken, config);
      
      if (newMessages.length === 0) {
        return;
      }

      this.logger.log(`Encontrados ${newMessages.length} correos nuevos para usuario ${userId}`);

      // Procesar cada mensaje
      for (const message of newMessages) {
        await this.processMessage(userId, message, config);
      }

      // Actualizar último mensaje procesado
      if (newMessages.length > 0) {
        const lastMessage = newMessages[0]; // El más reciente
        config.lastProcessedMessageId = lastMessage.id;
        config.lastProcessedDate = new Date();
        this.activeConfigs.set(userId, config);
        await this.saveConfiguration(config);
      }

    } catch (error) {
      this.logger.error(`Error procesando correos para usuario ${userId}:`, error);
      
      // Si es error de autenticación, intentar refrescar token
      if (error.status === 401) {
        await this.refreshUserToken(userId);
      }
    }
  }

  /**
   * Buscar mensajes nuevos desde la última verificación
   */
  private async findNewMessages(accessToken: string, config: EmailProcessorConfig): Promise<GmailMessage[]> {
    let query = 'is:unread';
    
    // Agregar filtros personalizados
    if (config.filters && config.filters.length > 0) {
      const enabledFilters = config.filters.filter(f => f.enabled);
      if (enabledFilters.length > 0) {
        const filterQueries = enabledFilters.map(f => f.query).join(' OR ');
        query = `(${query}) AND (${filterQueries})`;
      }
    }

    // Buscar solo correos de la última hora para evitar procesar demasiados
    query += ' newer_than:1h';

    const result = await this.gmailService.searchMessages(accessToken, {
      query,
      maxResults: 50
    });

    // Filtrar mensajes ya procesados
    const newMessages = result.messages.filter(msg => 
      !this.processedMessages.has(msg.id) && 
      (!config.lastProcessedMessageId || msg.id !== config.lastProcessedMessageId)
    );

    return newMessages;
  }

  /**
   * Procesar un mensaje individual
   */
  private async processMessage(userId: string, message: GmailMessage, config: EmailProcessorConfig): Promise<void> {
    if (this.processedMessages.has(message.id)) {
      return; // Ya se está procesando
    }

    this.processedMessages.add(message.id);

    try {
      const parsedEmail = this.gmailService.parseEmailContent(message);
      
      this.logger.log(`Procesando correo para ${userId}: ${parsedEmail.subject} de ${parsedEmail.from}`);

      // Ejecutar acciones configuradas
      const actionResults = await this.executeActions(userId, message, parsedEmail, config);

      // Registrar el procesamiento
      const processed: ProcessedEmail = {
        messageId: message.id,
        userId,
        processed: new Date(),
        actions: actionResults.map(r => r.action),
        success: actionResults.every(r => r.success),
        error: actionResults.find(r => !r.success)?.error
      };

      await this.saveProcessedEmail(processed);

      // Marcar como leído si está configurado
      if (config.actions?.some(a => a.type === 'mark_read' && a.enabled)) {
        await this.gmailService.markAsRead(config.accessToken, message.id);
      }

    } catch (error) {
      this.logger.error(`Error procesando mensaje ${message.id} para usuario ${userId}:`, error);
      
      await this.saveProcessedEmail({
        messageId: message.id,
        userId,
        processed: new Date(),
        actions: [],
        success: false,
        error: error.message
      });
    } finally {
      // Mantener en memoria por un tiempo para evitar reprocesar
      setTimeout(() => {
        this.processedMessages.delete(message.id);
      }, 5 * 60 * 1000); // 5 minutos
    }
  }

  /**
   * Ejecutar acciones configuradas para un correo
   */
  private async executeActions(
    userId: string, 
    message: GmailMessage, 
    parsedEmail: ParsedEmailContent, 
    config: EmailProcessorConfig
  ): Promise<{ action: string; success: boolean; error?: string }[]> {
    const results: { action: string; success: boolean; error?: string }[] = [];

    if (!config.actions || config.actions.length === 0) {
      // Acción por defecto: llamar webhook genérico
      results.push(await this.executeDefaultAction(userId, message, parsedEmail));
      return results;
    }

    for (const action of config.actions.filter(a => a.enabled)) {
      try {
        let result;
        
        switch (action.type) {
          case 'webhook':
            result = await this.executeWebhookAction(action, userId, message, parsedEmail);
            break;
          case 'function':
            result = await this.executeFunctionAction(action, userId, message, parsedEmail);
            break;
          case 'database':
            result = await this.executeDatabaseAction(action, userId, message, parsedEmail);
            break;
          case 'notification':
            result = await this.executeNotificationAction(action, userId, message, parsedEmail);
            break;
          default:
            throw new Error(`Tipo de acción no soportado: ${action.type}`);
        }

        results.push({
          action: action.name,
          success: true,
          ...result
        });

      } catch (error) {
        this.logger.error(`Error ejecutando acción ${action.name}:`, error);
        results.push({
          action: action.name,
          success: false,
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Ejecutar acción webhook
   */
  private async executeWebhookAction(
    action: EmailAction, 
    userId: string, 
    message: GmailMessage, 
    parsedEmail: ParsedEmailContent
  ): Promise<any> {
    const payload = {
      userId,
      messageId: message.id,
      email: {
        from: parsedEmail.from,
        to: parsedEmail.to,
        subject: parsedEmail.subject,
        date: parsedEmail.date,
        textContent: parsedEmail.textContent,
        htmlContent: parsedEmail.htmlContent,
        attachments: parsedEmail.attachments
      },
      timestamp: new Date()
    };

    const response = await firstValueFrom(
      this.httpService.post(action.config.url, payload, {
        headers: {
          'Content-Type': 'application/json',
          ...action.config.headers
        },
        timeout: action.config.timeout || 30000
      })
    );

    this.logger.log(`Webhook ejecutado para ${action.name}: ${response.status}`);
    return { webhookResponse: response.data };
  }

  /**
   * Ejecutar acción de función personalizada
   */
  private async executeFunctionAction(
    action: EmailAction, 
    userId: string, 
    message: GmailMessage, 
    parsedEmail: ParsedEmailContent
  ): Promise<any> {
    // Aquí puedes agregar funciones personalizadas
    switch (action.config.functionName) {
      case 'processSupport':
        return await this.processSupportEmail(userId, parsedEmail);
      case 'extractInvoice':
        return await this.extractInvoiceData(userId, parsedEmail);
      case 'autoReply':
        return await this.sendAutoReply(userId, parsedEmail);
      default:
        throw new Error(`Función no implementada: ${action.config.functionName}`);
    }
  }

  /**
   * Ejecutar acción de base de datos
   */
  private async executeDatabaseAction(
    action: EmailAction, 
    userId: string, 
    message: GmailMessage, 
    parsedEmail: ParsedEmailContent
  ): Promise<any> {
    // Aquí puedes guardar en tu base de datos
    this.logger.log(`Guardando email en base de datos: ${parsedEmail.subject}`);
    return { saved: true };
  }

  /**
   * Ejecutar acción de notificación
   */
  private async executeNotificationAction(
    action: EmailAction, 
    userId: string, 
    message: GmailMessage, 
    parsedEmail: ParsedEmailContent
  ): Promise<any> {
    // Aquí puedes enviar notificaciones (push, SMS, etc.)
    this.logger.log(`Enviando notificación: Nuevo correo de ${parsedEmail.from}`);
    return { notificationSent: true };
  }

  /**
   * Funciones de ejemplo para acciones personalizadas
   */
  private async processSupportEmail(userId: string, email: ParsedEmailContent): Promise<any> {
    this.logger.log(`Procesando correo de soporte de ${email.from}: ${email.subject}`);
    
    // Aquí puedes integrar con tu sistema de tickets
    // Por ejemplo, crear un ticket en tu base de datos
    
    return { ticketCreated: true, ticketId: `TICKET-${Date.now()}` };
  }

  private async extractInvoiceData(userId: string, email: ParsedEmailContent): Promise<any> {
    this.logger.log(`Extrayendo datos de factura de ${email.from}`);
    
    // Aquí puedes usar IA para extraer datos de facturas
    // Integrar con tu módulo de IA existente
    
    return { invoiceData: { amount: 0, vendor: email.from } };
  }

  private async sendAutoReply(userId: string, email: ParsedEmailContent): Promise<any> {
    this.logger.log(`Enviando respuesta automática a ${email.from}`);
    
    // Aquí puedes integrar con nodemailer o tu servicio de email
    
    return { autoReplySent: true };
  }

  /**
   * Acción por defecto cuando no hay acciones configuradas
   */
  private async executeDefaultAction(
    userId: string, 
    message: GmailMessage, 
    parsedEmail: ParsedEmailContent
  ): Promise<{ action: string; success: boolean; error?: string }> {
    try {
      this.logger.log(`[NUEVO CORREO] Usuario: ${userId}`);
      this.logger.log(`De: ${parsedEmail.from}`);
      this.logger.log(`Asunto: ${parsedEmail.subject}`);
      this.logger.log(`Fecha: ${parsedEmail.date}`);
      this.logger.log(`Contenido: ${parsedEmail.textContent?.substring(0, 200)}...`);
      this.logger.log(`Adjuntos: ${parsedEmail.attachments.length}`);
      this.logger.log('---');

      // Aquí puedes agregar tu lógica personalizada por defecto
      // Por ejemplo: guardar en base de datos, enviar notificación, etc.

      return { action: 'default_log', success: true };
    } catch (error) {
      return { action: 'default_log', success: false, error: error.message };
    }
  }

  /**
   * Asegurar que el token sea válido, refrescar si es necesario
   */
  private async ensureValidToken(config: EmailProcessorConfig): Promise<string> {
    try {
      // Probar el token actual
      await this.gmailService.getProfile(config.accessToken);
      return config.accessToken;
    } catch (error) {
      if (error.status === 401) {
        // Token expirado, refrescar
        this.logger.log(`Refrescando token para usuario ${config.userId}`);
        const newToken = await this.gmailService.refreshAccessToken({
          clientId: process.env.GMAIL_CLIENT_ID!,
          clientSecret: process.env.GMAIL_CLIENT_SECRET!,
          redirectUri: process.env.GMAIL_REDIRECT_URI!,
          refreshToken: config.refreshToken
        });
        
        config.accessToken = newToken;
        this.activeConfigs.set(config.userId, config);
        await this.saveConfiguration(config);
        
        return newToken;
      }
      throw error;
    }
  }

  /**
   * Métodos de persistencia (implementar según tu base de datos)
   */
  private async loadConfigurations(): Promise<void> {
    // Cargar configuraciones desde base de datos
    this.logger.log('Cargando configuraciones de usuarios...');
  }

  private async saveConfiguration(config: EmailProcessorConfig): Promise<void> {
    // Guardar configuración en base de datos
  }

  private async removeConfiguration(userId: string): Promise<void> {
    // Eliminar configuración de base de datos
  }

  private async saveProcessedEmail(processed: ProcessedEmail): Promise<void> {
    // Guardar registro de email procesado
  }

  private async refreshUserToken(userId: string): Promise<void> {
    // Lógica adicional para refrescar token
  }
}