import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ServiceCache } from 'src/shared/core/services/service-cache/service-cache';
import {
  ISimpleDeliveryData,
  ISimpleDeliveryOperationResult,
} from '../core/interfaces/ISimpleDeliveryData';
import { ISimpleDeliveryService } from '../core/interfaces/ISimpleDeliveryService';

/**
 * Servicio principal de deliveries con estructura de datos simplificada
 */
@Injectable()
export class DeliveryService {
  private readonly logger = new Logger(DeliveryService.name);
  private readonly providerServices = new Map<number, ISimpleDeliveryService>();

  constructor() {
    this.logger.log('🚚 Delivery Service initialized');
  }

  /**
   * Registrar un servicio de proveedor específico
   */
  public registerProvider(
    providerId: number,
    service: ISimpleDeliveryService,
  ): void {
    this.providerServices.set(providerId, service);
    this.logger.log(`✅ Registered delivery provider: ${providerId}`);
  }

  /**
   * Enviar un delivery con datos simplificados
   */
  public async SendDelivery(
    providerId: number,
    deliveryData: ISimpleDeliveryData,
  ): Promise<ISimpleDeliveryOperationResult> {
    const startTime = Date.now();
    const operationId = this.generateOperationId();

    try {
      console.log("deliveryData", deliveryData);
      
      this.logger.log(
        `🚀 Starting delivery operation ${operationId} with provider ID: ${providerId}`,
      );

      // 1. Buscar información del proveedor en la base de datos
      const provider = await this.getProviderById(providerId);
      if (!provider) {
        throw new NotFoundException(`Provider with ID ${providerId} not found`);
      }

      this.logger.log(
        `📋 Provider found: ${provider.providerName} (Type: ${provider.providertype})`,
      );

      // 2. Obtener el servicio específico del proveedor
      const deliveryService = this.getProviderService(providerId);

      // 3. Configurar credenciales del proveedor
      await this.configureProviderCredentials(deliveryService, provider);

      // 4. Enviar el delivery
      this.logger.log(`📦 Sending delivery with provider ${providerId}...`);
      const response = await deliveryService.sendDelivery(deliveryData);
      this.logger.log(
        `✅ Delivery sent successfully with response:`, response);
        
      // 5. Guardar el resultado en la base de datos (opcional)
      await this.saveDeliveryRecord(response, providerId, deliveryData);

      const duration = Date.now() - startTime;
      this.logger.log(`✅ Delivery sent successfully in ${duration}ms`, {
        operationId,
        deliveryId: response.data?.id,
        provider: providerId,
      });

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `❌ Delivery operation ${operationId} failed after ${duration}ms:`,
        {
          providerId,
          error: (error as Error).message,
          stack: (error as Error).stack,
        },
      );

      return {
        success: false,
        error: {
          code: error.code || 'DELIVERY_ERROR',
          message: (error as Error).message,
          details: {
            providerId,
            operationId,
            duration,
          },
        },
        timestamp: new Date(),
      };
    }
  }

  /**
   * Obtener estado de un delivery
   */
  public async GetDeliveryStatus(
    deliveryId: string,
    providerId?: number,
  ): Promise<ISimpleDeliveryOperationResult> {
    try {
      this.logger.log(`🔍 Getting delivery status: ${deliveryId}`);

      // Si no se proporciona providerId, intentar encontrarlo en la base de datos
      if (!providerId) {
        const deliveryRecord = await this.findDeliveryRecord(deliveryId);
        providerId = deliveryRecord?.providerId;
      }

      if (!providerId) {
        throw new Error('Provider ID is required for getting delivery status');
      }

      const provider = await this.getProviderById(providerId);
      if (!provider) {
        throw new NotFoundException(`Provider with ID ${providerId} not found`);
      }

      const deliveryService = this.getProviderService(providerId);
      const status = await deliveryService.getDeliveryStatus(deliveryId);

      return status;
    } catch (error) {
      this.logger.error(
        `❌ Status check failed for delivery ${deliveryId}:`,
        error,
      );

      return {
        success: false,
        error: {
          code: 'STATUS_ERROR',
          message: (error as Error).message,
        },
        timestamp: new Date(),
      };
    }
  }

  /**
   * Actualizar un delivery
   */
  public async UpdateDelivery(
    providerId: number,
    updateData: any, // Usamos any para flexibilidad, el servicio específico validará
  ): Promise<ISimpleDeliveryOperationResult> {
    const startTime = Date.now();
    const operationId = this.generateOperationId();

    try {
      this.logger.log(
        `🔄 Starting delivery update operation ${operationId} with provider ID: ${providerId}`,
      );

      // 1. Buscar información del proveedor en la base de datos
      const provider = await this.getProviderById(providerId);
      if (!provider) {
        throw new NotFoundException(`Provider with ID ${providerId} not found`);
      }

      this.logger.log(
        `📋 Provider found: ${provider.providerName} (Type: ${provider.providertype})`,
      );

      // 2. Obtener el servicio específico del proveedor
      const deliveryService = this.getProviderService(providerId);

      // 3. Verificar si el servicio soporta actualización
      if (typeof (deliveryService as any).updateDelivery !== 'function') {
        throw new Error(`Provider ${providerId} does not support delivery updates`);
      }

      // 4. Configurar credenciales del proveedor
      await this.configureProviderCredentials(deliveryService, provider);

      // 5. Actualizar el delivery
      this.logger.log(`🔄 Updating delivery with provider ${providerId}...`);
      const response = await (deliveryService as any).updateDelivery(updateData);
      this.logger.log(
        `✅ Delivery updated successfully with response:`, response);

      const duration = Date.now() - startTime;
      this.logger.log(`✅ Delivery updated successfully in ${duration}ms`, {
        operationId,
        deliveryId: updateData.deliveryId,
        provider: providerId,
      });

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `❌ Delivery update operation ${operationId} failed after ${duration}ms:`,
        {
          providerId,
          error: (error as Error).message,
          stack: (error as Error).stack,
        },
      );

      return {
        success: false,
        error: {
          code: error.code || 'DELIVERY_UPDATE_ERROR',
          message: (error as Error).message,
          details: {
            providerId,
            operationId,
            duration,
          },
        },
        timestamp: new Date(),
      };
    }
  }

  /**
   * Cancelar un delivery
   */
  public async CancelDelivery(
    deliveryId: string,
    providerId: number,
    reason?: string,
  ): Promise<ISimpleDeliveryOperationResult> {
    try {
      this.logger.log(`❌ Cancelling delivery: ${deliveryId}`);

      const provider = await this.getProviderById(providerId);
      if (!provider) {
        throw new NotFoundException(`Provider with ID ${providerId} not found`);
      }

      const deliveryService = this.getProviderService(providerId);
      const cancelled = await deliveryService.cancelDelivery(
        deliveryId,
        reason,
      );

      return cancelled;
    } catch (error) {
      this.logger.error(
        `❌ Cancellation failed for delivery ${deliveryId}:`,
        error,
      );

      return {
        success: false,
        error: {
          code: 'CANCELLATION_ERROR',
          message: (error as Error).message,
        },
        timestamp: new Date(),
      };
    }
  }

  /**
   * 🚚 ACTUALIZAR TIP DE UN DELIVERY (método específico para proveedores como WeKnock)
   */
  public async UpdateDeliveryTip(
    providerId: number,
    externalDeliveryId: string,
    newTipAmount: number,
    newOrderAmount?: number,
  ): Promise<ISimpleDeliveryOperationResult> {
    const startTime = Date.now();
    const operationId = this.generateOperationId();

    try {
      this.logger.log(
        `🚚 Starting delivery tip update operation ${operationId} with provider ID: ${providerId}`,
        { externalDeliveryId, newTipAmount, newOrderAmount }
      );

      // 1. Buscar información del proveedor en la base de datos
      const provider = await this.getProviderById(providerId);
      if (!provider) {
        throw new NotFoundException(`Provider with ID ${providerId} not found`);
      }

      this.logger.log(
        `📋 Provider found: ${provider.providerName} (Type: ${provider.providertype})`,
      );

      // 2. Obtener el servicio específico del proveedor
      const deliveryService = this.getProviderService(providerId);

      // 3. Verificar si el servicio soporta actualización de tip
      if (typeof (deliveryService as any).updateDeliveryTip !== 'function') {
        this.logger.warn(`⚠️ Provider ${providerId} does not support tip updates`);
        return {
          success: false,
          error: {
            code: 'TIP_UPDATE_NOT_SUPPORTED',
            message: `Provider ${providerId} (${provider.providerName}) does not support tip updates`,
          },
          timestamp: new Date(),
        };
      }

      // 4. Configurar credenciales del proveedor
      await this.configureProviderCredentials(deliveryService, provider);

      // 5. Actualizar el tip del delivery
      this.logger.log(`💰 Updating delivery tip with provider ${providerId}...`);
      const response = await (deliveryService as any).updateDeliveryTip(
        externalDeliveryId,
        newTipAmount,
        newOrderAmount,
      );

      const duration = Date.now() - startTime;
      if (response.success) {
        this.logger.log(`✅ Delivery tip updated successfully in ${duration}ms`, {
          operationId,
          externalDeliveryId,
          provider: providerId,
          newTipAmount,
        });
      } else {
        this.logger.error(`❌ Delivery tip update failed in ${duration}ms`, {
          operationId,
          externalDeliveryId,
          provider: providerId,
          error: response.error,
        });
      }

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `❌ Delivery tip update operation ${operationId} failed after ${duration}ms:`,
        {
          providerId,
          externalDeliveryId,
          error: (error as Error).message,
          stack: (error as Error).stack,
        },
      );

      return {
        success: false,
        error: {
          code: error.code || 'DELIVERY_TIP_UPDATE_ERROR',
          message: (error as Error).message,
          details: {
            providerId,
            operationId,
            duration,
            externalDeliveryId,
          },
        },
        timestamp: new Date(),
      };
    }
  }

  /**
   * Obtener lista de proveedores disponibles
   */
  public async GetAvailableProviders(): Promise<
    Array<{ id: number; name: string; type: string; isActive: boolean }>
  > {
    try {
      const providers = await ServiceCache.Database.Prisma.provider.findMany({
        where: {
          providertype: 'delivery',
        },
        select: {
          idProvider: true,
          providerName: true,
          providertype: true,
        },
      });

      return providers.map((provider) => ({
        id: provider.idProvider,
        name: provider.providerName || 'Unknown Provider',
        type: provider.providertype || 'delivery',
        isActive: true,
      }));
    } catch (error) {
      this.logger.error(`❌ Failed to get available providers:`, error);
      return [];
    }
  }

  /**
   * Métodos privados
   */
  private async getProviderById(providerId: number) {
    return await ServiceCache.Database.Prisma.provider.findUnique({
      where: { idProvider: providerId },
    });
  }

  private getProviderService(providerId: number): ISimpleDeliveryService {
    const service = this.providerServices.get(providerId);
    if (!service) {
      throw new Error(
        `Delivery service not registered for provider: ${providerId}`,
      );
    }
    return service;
  }

  private async configureProviderCredentials(
    service: any,
    provider: any,
  ): Promise<void> {
    // Configurar credenciales específicas del proveedor
    if (provider.providerToken) {
      if (typeof service.setApiKey === 'function') {
        service.setApiKey(provider.providerToken);
      }
    }

    if (provider.providerCredential) {
      try {
        const credentials = JSON.parse(provider.providerCredential);
        if (typeof service.setCredentials === 'function') {
          service.setCredentials(credentials);
        }
      } catch {
        // Si no es JSON, usar como string simple
        if (typeof service.setSecret === 'function') {
          service.setSecret(provider.providerCredential);
        }
      }
    }
  }

  private async saveDeliveryRecord(
    response: ISimpleDeliveryOperationResult,
    providerId: number,
    deliveryData: ISimpleDeliveryData,
  ): Promise<void> {
    try {
      // Guardar el registro en la base de datos
      // Implementación depende de tu esquema de base de datos
      this.logger.debug(
        '📝 Simple delivery record saved (implementation pending)',
      );
    } catch (error) {
      this.logger.warn('⚠️ Failed to save simple delivery record:', error);
    }
  }

  private async findDeliveryRecord(deliveryId: string): Promise<any> {
    try {
      // Buscar registro de delivery en la base de datos
      // Implementación depende de tu esquema de base de datos
      return null;
    } catch (error) {
      this.logger.warn('⚠️ Failed to find delivery record:', error);
      return null;
    }
  }

  private generateOperationId(): string {
    return `delivery_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
