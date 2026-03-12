import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { SchemaContextService } from '../core/services/schema-context/schema-context.service';

/**
 * 🏢 Multi-Tenant Prisma Service
 *
 * Maneja múltiples conexiones de Prisma, una por cada schema/restaurante.
 * 
 * Características:
 * - Pool de conexiones por schema
 * - Lazy loading (crea conexiones bajo demanda)
 * - Reutiliza conexiones existentes
 * - Set search_path automático por schema
 * - Compatible con Prisma Accelerate
 */
@Injectable()
export class MultiTenantPrismaService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(MultiTenantPrismaService.name);

  /**
   * Map de schema → PrismaClient
   * Mantiene un cliente por cada schema activo
   */
  private readonly schemaClients = new Map<string, any>();

  /**
   * Cliente default (para casos sin multi-tenancy)
   */
  private defaultClient: any = null;

  constructor(private readonly schemaContext: SchemaContextService) {}

  async onModuleInit() {
    this.logger.log('🏢 Inicializando Multi-Tenant Prisma Service...');

    // Crear cliente default
    this.defaultClient = await this.createPrismaClient('default');

    this.logger.log('✅ Multi-Tenant Prisma Service inicializado');
  }

  async onModuleDestroy() {
    this.logger.log('🔌 Desconectando todos los clientes Prisma...');

    // Desconectar cliente default
    if (this.defaultClient) {
      await this.disconnectClient(this.defaultClient, 'default');
    }

    // Desconectar todos los clientes de schemas
    for (const [schema, client] of this.schemaClients.entries()) {
      await this.disconnectClient(client, schema);
    }

    this.logger.log('✅ Todos los clientes desconectados');
  }

  /**
   * Obtener el cliente Prisma correcto según el contexto
   *
   * - Si hay contexto de schema → devuelve cliente del schema
   * - Si NO hay contexto → lanza NotFoundException
   * 
   * NOTA: Este método es síncrono para compatibilidad con getters
   */
  getClient(): any {
    const context = this.schemaContext.getContext();

    if (!context || !context.schemaName) {
      // No hay contexto → lanzar error
      this.logger.error(
        '❌ No schema context found. Multi-tenant requests require restaurant context.',
      );
      throw new NotFoundException(
        'Restaurant context not found. Please provide a valid restaurantsub header.',
      );
    }

    // Si el cliente ya existe, devolverlo (síncrono)
    if (this.schemaClients.has(context.schemaName)) {
      this.logger.debug(`♻️ Reusing existing client for schema: ${context.schemaName}`);
      return this.schemaClients.get(context.schemaName);
    }

    // Si no existe, necesitamos crearlo - pero esto requiere validación async
    // Lanzamos error indicando que el schema no ha sido inicializado
    this.logger.error(
      `❌ Schema client for '${context.schemaName}' not initialized yet.`,
    );
    throw new NotFoundException(
      `Schema '${context.schemaName}' client not initialized. Please ensure the schema is properly configured.`,
    );
  }

  /**
   * Obtener cliente para un schema específico
   * Si no existe, lo crea y conecta
   * Si el schema no existe en la BD, lanza NotFoundException
   */
  async getSchemaClient(schemaName: string): Promise<any> {
    // Verificar si ya existe el cliente
    if (this.schemaClients.has(schemaName)) {
      this.logger.debug(`♻️ Reusing existing client for schema: ${schemaName}`);
      return this.schemaClients.get(schemaName);
    }

    // Verificar que el schema existe en la base de datos
    const schemaExists = await this.validateSchemaExists(schemaName);
    if (!schemaExists) {
      this.logger.error(
        `❌ Schema '${schemaName}' does not exist in database`,
      );
      throw new NotFoundException(
        `Restaurant schema '${schemaName}' not found in database. Please verify the restaurant configuration.`,
      );
    }

    // No existe → crear nuevo cliente
    this.logger.log(`🆕 Creating new Prisma client for schema: ${schemaName}`);

    const client = this.createPrismaClient(schemaName);

    // Guardar en el map
    this.schemaClients.set(schemaName, client);

    return client;
  }

  /**
   * Validar que un schema existe en la base de datos
   */
  private async validateSchemaExists(schemaName: string): Promise<boolean> {
    try {
      // Usar el cliente default para consultar los schemas disponibles
      const result = await this.defaultClient.$queryRaw<{ schema_name: string }[]>`
        SELECT schema_name 
        FROM information_schema.schemata 
        WHERE schema_name = ${schemaName}
      `;

      return result.length > 0;
    } catch (error) {
      this.logger.error(
        `Error validating schema ${schemaName}:`,
        error,
      );
      return false;
    }
  }

  /**
   * Crear un nuevo cliente Prisma con search_path configurado
   */
  private createPrismaClient(schemaName: string): any {
    this.logger.debug(`Creating Prisma client for schema: ${schemaName}`);

    // Obtener DATABASE_URL
    const databaseUrl =
      process.env.DATABASE_URL || process.env.DATABASE_URL_DEV;

    if (!databaseUrl) {
      throw new Error('DATABASE_URL not configured');
    }

    // 🔥 MODIFICAR LA URL PARA INCLUIR EL SCHEMA directamente
    let connectionString = databaseUrl;
    
    if (schemaName !== 'default' && schemaName !== 'public') {
      // Remover cualquier ?schema= existente
      connectionString = connectionString.split('?')[0];
      // Agregar el schema correcto
      connectionString = `${connectionString}?schema=${schemaName}`;
      
      this.logger.debug(`Using connection string with schema: ${schemaName}`);
    }

    // Crear cliente con el connection string modificado
    const client: any = new PrismaClient({
      datasources: {
        db: {
          url: connectionString,
        },
      },
      log: ['error', 'warn'],
    });

    // Aplicar Accelerate si es necesario
    if (this.isDatabaseUrlAccelerate(databaseUrl)) {
      return client.$extends(withAccelerate());
    }

    return client;
  }

  /**
   * Configurar el search_path para un cliente específico
   */
  private async setupSchemaPath(client: any, schemaName: string) {
    try {
      this.logger.debug(`Setting search_path to: ${schemaName}`);

      // Ejecutar SET search_path en la conexión
      await client.$executeRawUnsafe(
        `SET search_path TO "${schemaName}", public;`,
      );

      this.logger.debug(`✅ Search path configured for schema: ${schemaName}`);
    } catch (error) {
      this.logger.error(
        `❌ Error setting search_path for schema ${schemaName}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Desconectar un cliente
   */
  private async disconnectClient(client: any, schemaName: string) {
    try {
      this.logger.debug(`Disconnecting client for schema: ${schemaName}`);
      await client.$disconnect();
      this.logger.debug(`✅ Disconnected: ${schemaName}`);
    } catch (error) {
      this.logger.error(
        `❌ Error disconnecting client ${schemaName}:`,
        error,
      );
    }
  }

  /**
   * Verificar si la URL usa Prisma Accelerate
   */
  private isDatabaseUrlAccelerate(url: string): boolean {
    return url.includes('prisma+postgres://accelerate.prisma-data.net');
  }

  /**
   * Health check del cliente actual
   */
  async healthCheck() {
    const client = this.getClient();
    const context = this.schemaContext.getContext();
    const schema = context?.schemaName || 'default';

    const start = Date.now();
    try {
      await client.$queryRaw`SELECT 1`;
      return {
        status: 'healthy',
        latency: Date.now() - start,
        schema: schema,
        accelerate: this.isDatabaseUrlAccelerate(
          process.env.DATABASE_URL || '',
        ),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        latency: Date.now() - start,
        schema: schema,
        error: error.message,
      };
    }
  }

  /**
   * Obtener estadísticas de conexiones activas
   */
  getConnectionStats() {
    return {
      totalSchemas: this.schemaClients.size,
      schemas: Array.from(this.schemaClients.keys()),
      hasDefault: !!this.defaultClient,
      currentContext: this.schemaContext.getContext(),
    };
  }
}
