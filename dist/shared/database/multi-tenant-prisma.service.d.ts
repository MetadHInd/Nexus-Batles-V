import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { SchemaContextService } from '../core/services/schema-context/schema-context.service';
export declare class MultiTenantPrismaService implements OnModuleInit, OnModuleDestroy {
    private readonly schemaContext;
    private readonly logger;
    private readonly schemaClients;
    private defaultClient;
    constructor(schemaContext: SchemaContextService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    getClient(): any;
    getSchemaClient(schemaName: string): Promise<any>;
    private validateSchemaExists;
    private createPrismaClient;
    private setupSchemaPath;
    private disconnectClient;
    private isDatabaseUrlAccelerate;
    healthCheck(): Promise<{
        status: string;
        latency: number;
        schema: string;
        accelerate: boolean;
        error?: undefined;
    } | {
        status: string;
        latency: number;
        schema: string;
        error: any;
        accelerate?: undefined;
    }>;
    getConnectionStats(): {
        totalSchemas: number;
        schemas: string[];
        hasDefault: boolean;
        currentContext: import("../core/services/schema-context/schema-context.service").SchemaContext | undefined;
    };
}
