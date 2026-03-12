import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

/**
 * Interface para el contexto del schema/tenant actual
 */
export interface SchemaContext {
  /**
   * UUID del tenant activo
   */
  tenantUuid: string;

  /**
   * Nombre del schema/conexión de base de datos
   */
  schemaName: string;

  /**
   * Nombre del tenant (para logs)
   */
  tenantName: string;

  /**
   * UUID del usuario que hace la request
   */
  userUuid: string;

  /**
   * Rol del usuario en este tenant
   */
  roleInTenant?: string;
}

/**
 * 🔐 Schema Context Service
 * 
 * Maneja el contexto del schema/tenant usando AsyncLocalStorage
 * para mantener el contexto aislado por request sin pasar parámetros.
 * 
 * Thread-safe y compatible con async/await.
 */
@Injectable()
export class SchemaContextService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<SchemaContext>();

  /**
   * Ejecutar código dentro de un contexto de schema específico
   */
  run<T>(context: SchemaContext, callback: () => T): T {
    return this.asyncLocalStorage.run(context, callback);
  }

  /**
   * Obtener el contexto actual del schema
   */
  getContext(): SchemaContext | undefined {
    return this.asyncLocalStorage.getStore();
  }

  /**
   * Obtener el nombre del schema actual
   */
  getCurrentSchema(): string | undefined {
    const context = this.getContext();
    return context?.schemaName;
  }

  /**
   * Obtener el UUID del tenant actual
   */
  getCurrentTenantUuid(): string | undefined {
    const context = this.getContext();
    return context?.tenantUuid;
  }

  /**
   * Verificar si hay un contexto activo
   */
  hasContext(): boolean {
    return this.getContext() !== undefined;
  }

  /**
   * Limpiar el contexto (útil para testing)
   */
  clearContext(): void {
    // AsyncLocalStorage se limpia automáticamente al salir del scope
    // Este método es principalmente para compatibilidad y testing
  }
}
