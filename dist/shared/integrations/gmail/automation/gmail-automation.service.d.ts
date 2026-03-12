import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { GmailService } from '../basic/services/gmail.service';
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
export declare class GmailAutomationService implements OnModuleInit, OnModuleDestroy {
    private readonly gmailService;
    private readonly httpService;
    private readonly logger;
    private activeConfigs;
    private processingInProgress;
    private processedMessages;
    private monitoringInterval;
    constructor(gmailService: GmailService, httpService: HttpService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private startMonitoring;
    private stopMonitoring;
    forceCheck(): Promise<void>;
    registerUser(config: EmailProcessorConfig): Promise<void>;
    unregisterUser(userId: string): Promise<void>;
    updateUserConfig(userId: string, updates: Partial<EmailProcessorConfig>): Promise<void>;
    private checkForNewEmails;
    processUserEmailsManually(userId: string): Promise<void>;
    private processUserEmails;
    private findNewMessages;
    private processMessage;
    private executeActions;
    private executeWebhookAction;
    private executeFunctionAction;
    private executeDatabaseAction;
    private executeNotificationAction;
    private processSupportEmail;
    private extractInvoiceData;
    private sendAutoReply;
    private executeDefaultAction;
    private ensureValidToken;
    private loadConfigurations;
    private saveConfiguration;
    private removeConfiguration;
    private saveProcessedEmail;
    private refreshUserToken;
}
