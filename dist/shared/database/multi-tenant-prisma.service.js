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
var MultiTenantPrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiTenantPrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const extension_accelerate_1 = require("@prisma/extension-accelerate");
const schema_context_service_1 = require("../core/services/schema-context/schema-context.service");
let MultiTenantPrismaService = MultiTenantPrismaService_1 = class MultiTenantPrismaService {
    schemaContext;
    logger = new common_1.Logger(MultiTenantPrismaService_1.name);
    schemaClients = new Map();
    defaultClient = null;
    constructor(schemaContext) {
        this.schemaContext = schemaContext;
    }
    async onModuleInit() {
        this.logger.log('🏢 Inicializando Multi-Tenant Prisma Service...');
        this.defaultClient = await this.createPrismaClient('default');
        this.logger.log('✅ Multi-Tenant Prisma Service inicializado');
    }
    async onModuleDestroy() {
        this.logger.log('🔌 Desconectando todos los clientes Prisma...');
        if (this.defaultClient) {
            await this.disconnectClient(this.defaultClient, 'default');
        }
        for (const [schema, client] of this.schemaClients.entries()) {
            await this.disconnectClient(client, schema);
        }
        this.logger.log('✅ Todos los clientes desconectados');
    }
    getClient() {
        const context = this.schemaContext.getContext();
        if (!context || !context.schemaName) {
            this.logger.error('❌ No schema context found. Multi-tenant requests require restaurant context.');
            throw new common_1.NotFoundException('Restaurant context not found. Please provide a valid restaurantsub header.');
        }
        if (this.schemaClients.has(context.schemaName)) {
            this.logger.debug(`♻️ Reusing existing client for schema: ${context.schemaName}`);
            return this.schemaClients.get(context.schemaName);
        }
        this.logger.error(`❌ Schema client for '${context.schemaName}' not initialized yet.`);
        throw new common_1.NotFoundException(`Schema '${context.schemaName}' client not initialized. Please ensure the schema is properly configured.`);
    }
    async getSchemaClient(schemaName) {
        if (this.schemaClients.has(schemaName)) {
            this.logger.debug(`♻️ Reusing existing client for schema: ${schemaName}`);
            return this.schemaClients.get(schemaName);
        }
        const schemaExists = await this.validateSchemaExists(schemaName);
        if (!schemaExists) {
            this.logger.error(`❌ Schema '${schemaName}' does not exist in database`);
            throw new common_1.NotFoundException(`Restaurant schema '${schemaName}' not found in database. Please verify the restaurant configuration.`);
        }
        this.logger.log(`🆕 Creating new Prisma client for schema: ${schemaName}`);
        const client = this.createPrismaClient(schemaName);
        this.schemaClients.set(schemaName, client);
        return client;
    }
    async validateSchemaExists(schemaName) {
        try {
            const result = await this.defaultClient.$queryRaw `
        SELECT schema_name 
        FROM information_schema.schemata 
        WHERE schema_name = ${schemaName}
      `;
            return result.length > 0;
        }
        catch (error) {
            this.logger.error(`Error validating schema ${schemaName}:`, error);
            return false;
        }
    }
    createPrismaClient(schemaName) {
        this.logger.debug(`Creating Prisma client for schema: ${schemaName}`);
        const databaseUrl = process.env.DATABASE_URL || process.env.DATABASE_URL_DEV;
        if (!databaseUrl) {
            throw new Error('DATABASE_URL not configured');
        }
        let connectionString = databaseUrl;
        if (schemaName !== 'default' && schemaName !== 'public') {
            connectionString = connectionString.split('?')[0];
            connectionString = `${connectionString}?schema=${schemaName}`;
            this.logger.debug(`Using connection string with schema: ${schemaName}`);
        }
        const client = new client_1.PrismaClient({
            datasources: {
                db: {
                    url: connectionString,
                },
            },
            log: ['error', 'warn'],
        });
        if (this.isDatabaseUrlAccelerate(databaseUrl)) {
            return client.$extends((0, extension_accelerate_1.withAccelerate)());
        }
        return client;
    }
    async setupSchemaPath(client, schemaName) {
        try {
            this.logger.debug(`Setting search_path to: ${schemaName}`);
            await client.$executeRawUnsafe(`SET search_path TO "${schemaName}", public;`);
            this.logger.debug(`✅ Search path configured for schema: ${schemaName}`);
        }
        catch (error) {
            this.logger.error(`❌ Error setting search_path for schema ${schemaName}:`, error);
            throw error;
        }
    }
    async disconnectClient(client, schemaName) {
        try {
            this.logger.debug(`Disconnecting client for schema: ${schemaName}`);
            await client.$disconnect();
            this.logger.debug(`✅ Disconnected: ${schemaName}`);
        }
        catch (error) {
            this.logger.error(`❌ Error disconnecting client ${schemaName}:`, error);
        }
    }
    isDatabaseUrlAccelerate(url) {
        return url.includes('prisma+postgres://accelerate.prisma-data.net');
    }
    async healthCheck() {
        const client = this.getClient();
        const context = this.schemaContext.getContext();
        const schema = context?.schemaName || 'default';
        const start = Date.now();
        try {
            await client.$queryRaw `SELECT 1`;
            return {
                status: 'healthy',
                latency: Date.now() - start,
                schema: schema,
                accelerate: this.isDatabaseUrlAccelerate(process.env.DATABASE_URL || ''),
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                latency: Date.now() - start,
                schema: schema,
                error: error.message,
            };
        }
    }
    getConnectionStats() {
        return {
            totalSchemas: this.schemaClients.size,
            schemas: Array.from(this.schemaClients.keys()),
            hasDefault: !!this.defaultClient,
            currentContext: this.schemaContext.getContext(),
        };
    }
};
exports.MultiTenantPrismaService = MultiTenantPrismaService;
exports.MultiTenantPrismaService = MultiTenantPrismaService = MultiTenantPrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [schema_context_service_1.SchemaContextService])
], MultiTenantPrismaService);
//# sourceMappingURL=multi-tenant-prisma.service.js.map