"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GmailAutomationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GmailAutomationService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const gmail_service_1 = require("../basic/services/gmail.service");
let GmailAutomationService = GmailAutomationService_1 = class GmailAutomationService {
    gmailService;
    httpService;
    logger = new common_1.Logger(GmailAutomationService_1.name);
    activeConfigs = new Map();
    processingInProgress = false;
    processedMessages = new Set();
    monitoringInterval = null;
    constructor(gmailService, httpService) {
        this.gmailService = gmailService;
        this.httpService = httpService;
    }
    async onModuleInit() {
        this.logger.log('Gmail Automation Service iniciado');
        await this.loadConfigurations();
        this.startMonitoring();
    }
    async onModuleDestroy() {
        this.logger.log('Gmail Automation Service detenido');
        this.stopMonitoring();
    }
    startMonitoring() {
        if (this.monitoringInterval) {
            return;
        }
        this.logger.log('Iniciando monitoreo automático de correos cada 30 segundos');
        this.monitoringInterval = setInterval(() => {
            this.checkForNewEmails().catch(error => {
                this.logger.error('Error en verificación automática:', error);
            });
        }, 30000);
    }
    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
            this.logger.log('Monitoreo automático detenido');
        }
    }
    async forceCheck() {
        this.logger.log('Forzando verificación manual de correos');
        await this.checkForNewEmails();
    }
    async registerUser(config) {
        try {
            await this.gmailService.getProfile(config.accessToken);
            this.activeConfigs.set(config.userId, config);
            this.logger.log(`Usuario ${config.userId} registrado para monitoreo automático`);
            await this.processUserEmails(config.userId);
            await this.saveConfiguration(config);
        }
        catch (error) {
            this.logger.error(`Error registrando usuario ${config.userId}:`, error);
            throw error;
        }
    }
    async unregisterUser(userId) {
        this.activeConfigs.delete(userId);
        this.logger.log(`Usuario ${userId} desregistrado del monitoreo`);
        await this.removeConfiguration(userId);
    }
    async updateUserConfig(userId, updates) {
        const existing = this.activeConfigs.get(userId);
        if (!existing) {
            throw new Error(`Usuario ${userId} no está registrado`);
        }
        const updated = { ...existing, ...updates };
        this.activeConfigs.set(userId, updated);
        await this.saveConfiguration(updated);
        this.logger.log(`Configuración actualizada para usuario ${userId}`);
    }
    async checkForNewEmails() {
        if (this.processingInProgress || this.activeConfigs.size === 0) {
            return;
        }
        this.processingInProgress = true;
        try {
            const promises = Array.from(this.activeConfigs.keys()).map(userId => this.processUserEmails(userId).catch(error => {
                this.logger.error(`Error procesando correos para usuario ${userId}:`, error);
            }));
            await Promise.all(promises);
        }
        catch (error) {
            this.logger.error('Error en verificación automática de correos:', error);
        }
        finally {
            this.processingInProgress = false;
        }
    }
    async processUserEmailsManually(userId) {
        return this.processUserEmails(userId);
    }
    async processUserEmails(userId) {
        const config = this.activeConfigs.get(userId);
        if (!config)
            return;
        try {
            const accessToken = await this.ensureValidToken(config);
            const newMessages = await this.findNewMessages(accessToken, config);
            if (newMessages.length === 0) {
                return;
            }
            this.logger.log(`Encontrados ${newMessages.length} correos nuevos para usuario ${userId}`);
            for (const message of newMessages) {
                await this.processMessage(userId, message, config);
            }
            if (newMessages.length > 0) {
                const lastMessage = newMessages[0];
                config.lastProcessedMessageId = lastMessage.id;
                config.lastProcessedDate = new Date();
                this.activeConfigs.set(userId, config);
                await this.saveConfiguration(config);
            }
        }
        catch (error) {
            this.logger.error(`Error procesando correos para usuario ${userId}:`, error);
            if (error.status === 401) {
                await this.refreshUserToken(userId);
            }
        }
    }
    async findNewMessages(accessToken, config) {
        let query = 'is:unread';
        if (config.filters && config.filters.length > 0) {
            const enabledFilters = config.filters.filter(f => f.enabled);
            if (enabledFilters.length > 0) {
                const filterQueries = enabledFilters.map(f => f.query).join(' OR ');
                query = `(${query}) AND (${filterQueries})`;
            }
        }
        query += ' newer_than:1h';
        const result = await this.gmailService.searchMessages(accessToken, {
            query,
            maxResults: 50
        });
        const newMessages = result.messages.filter(msg => !this.processedMessages.has(msg.id) &&
            (!config.lastProcessedMessageId || msg.id !== config.lastProcessedMessageId));
        return newMessages;
    }
    async processMessage(userId, message, config) {
        if (this.processedMessages.has(message.id)) {
            return;
        }
        this.processedMessages.add(message.id);
        try {
            const parsedEmail = this.gmailService.parseEmailContent(message);
            this.logger.log(`Procesando correo para ${userId}: ${parsedEmail.subject} de ${parsedEmail.from}`);
            const actionResults = await this.executeActions(userId, message, parsedEmail, config);
            const processed = {
                messageId: message.id,
                userId,
                processed: new Date(),
                actions: actionResults.map(r => r.action),
                success: actionResults.every(r => r.success),
                error: actionResults.find(r => !r.success)?.error
            };
            await this.saveProcessedEmail(processed);
            if (config.actions?.some(a => a.type === 'mark_read' && a.enabled)) {
                await this.gmailService.markAsRead(config.accessToken, message.id);
            }
        }
        catch (error) {
            this.logger.error(`Error procesando mensaje ${message.id} para usuario ${userId}:`, error);
            await this.saveProcessedEmail({
                messageId: message.id,
                userId,
                processed: new Date(),
                actions: [],
                success: false,
                error: error.message
            });
        }
        finally {
            setTimeout(() => {
                this.processedMessages.delete(message.id);
            }, 5 * 60 * 1000);
        }
    }
    async executeActions(userId, message, parsedEmail, config) {
        const results = [];
        if (!config.actions || config.actions.length === 0) {
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
            }
            catch (error) {
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
    async executeWebhookAction(action, userId, message, parsedEmail) {
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
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(action.config.url, payload, {
            headers: {
                'Content-Type': 'application/json',
                ...action.config.headers
            },
            timeout: action.config.timeout || 30000
        }));
        this.logger.log(`Webhook ejecutado para ${action.name}: ${response.status}`);
        return { webhookResponse: response.data };
    }
    async executeFunctionAction(action, userId, message, parsedEmail) {
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
    async executeDatabaseAction(action, userId, message, parsedEmail) {
        this.logger.log(`Guardando email en base de datos: ${parsedEmail.subject}`);
        return { saved: true };
    }
    async executeNotificationAction(action, userId, message, parsedEmail) {
        this.logger.log(`Enviando notificación: Nuevo correo de ${parsedEmail.from}`);
        return { notificationSent: true };
    }
    async processSupportEmail(userId, email) {
        this.logger.log(`Procesando correo de soporte de ${email.from}: ${email.subject}`);
        return { ticketCreated: true, ticketId: `TICKET-${Date.now()}` };
    }
    async extractInvoiceData(userId, email) {
        this.logger.log(`Extrayendo datos de factura de ${email.from}`);
        return { invoiceData: { amount: 0, vendor: email.from } };
    }
    async sendAutoReply(userId, email) {
        this.logger.log(`Enviando respuesta automática a ${email.from}`);
        return { autoReplySent: true };
    }
    async executeDefaultAction(userId, message, parsedEmail) {
        try {
            this.logger.log(`[NUEVO CORREO] Usuario: ${userId}`);
            this.logger.log(`De: ${parsedEmail.from}`);
            this.logger.log(`Asunto: ${parsedEmail.subject}`);
            this.logger.log(`Fecha: ${parsedEmail.date}`);
            this.logger.log(`Contenido: ${parsedEmail.textContent?.substring(0, 200)}...`);
            this.logger.log(`Adjuntos: ${parsedEmail.attachments.length}`);
            this.logger.log('---');
            return { action: 'default_log', success: true };
        }
        catch (error) {
            return { action: 'default_log', success: false, error: error.message };
        }
    }
    async ensureValidToken(config) {
        try {
            await this.gmailService.getProfile(config.accessToken);
            return config.accessToken;
        }
        catch (error) {
            if (error.status === 401) {
                this.logger.log(`Refrescando token para usuario ${config.userId}`);
                const newToken = await this.gmailService.refreshAccessToken({
                    clientId: process.env.GMAIL_CLIENT_ID,
                    clientSecret: process.env.GMAIL_CLIENT_SECRET,
                    redirectUri: process.env.GMAIL_REDIRECT_URI,
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
    async loadConfigurations() {
        this.logger.log('Cargando configuraciones de usuarios...');
    }
    async saveConfiguration(config) {
    }
    async removeConfiguration(userId) {
    }
    async saveProcessedEmail(processed) {
    }
    async refreshUserToken(userId) {
    }
};
exports.GmailAutomationService = GmailAutomationService;
exports.GmailAutomationService = GmailAutomationService = GmailAutomationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [gmail_service_1.GmailService,
        axios_1.HttpService])
], GmailAutomationService);
//# sourceMappingURL=gmail-automation.service.js.map