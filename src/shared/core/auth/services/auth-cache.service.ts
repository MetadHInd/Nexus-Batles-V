import { Injectable, Logger } from '@nestjs/common';
import { RedisCacheService } from '../../../cache/redis-cache.service';

@Injectable()
export class AuthCacheService {
  private readonly logger = new Logger(AuthCacheService.name);

  constructor(private readonly cacheService: RedisCacheService) {}

  /**
   * Invalidar caché cuando se actualiza el rol de un usuario
   */
  async invalidateOnRoleUpdate(
    userId: number,
    newRoleId: number,
  ): Promise<void> {
    try {
      // Invalidar caché del usuario
      await this.cacheService.delete(`user:${userId}`);
      await this.cacheService.delete(`user:profile:${userId}`);

      this.logger.log(
        `Caché invalidado para usuario ${userId} por cambio de rol a ${newRoleId}`,
      );
    } catch (error) {
      this.logger.error(
        `Error al invalidar caché por cambio de rol: ${error.message}`,
      );
    }
  }

  /**
   * Invalidar caché cuando se actualizan las branches de un usuario
   */
  async invalidateOnBranchAssignment(
    userId: number,
    branchId: number,
    isManager: boolean,
  ): Promise<void> {
    try {
      // Invalidar caché del usuario
      await this.cacheService.delete(`user:${userId}`);
      await this.cacheService.delete(`user:branches:${userId}`);

      this.logger.log(
        `Caché invalidado para usuario ${userId} por asignación a branch ${branchId} (manager: ${isManager})`,
      );
    } catch (error) {
      this.logger.error(
        `Error al invalidar caché por asignación de branch: ${error.message}`,
      );
    }
  }

  /**
   * Invalidar caché cuando se remueve un usuario de una branch
   */
  async invalidateOnBranchRemoval(
    userId: number,
    branchId: number,
  ): Promise<void> {
    try {
      await this.cacheService.delete(`user:${userId}`);
      await this.cacheService.delete(`user:branches:${userId}`);

      this.logger.log(
        `Caché invalidado para usuario ${userId} por remoción de branch ${branchId}`,
      );
    } catch (error) {
      this.logger.error(
        `Error al invalidar caché por remoción de branch: ${error.message}`,
      );
    }
  }

  /**
   * Invalidar caché cuando se actualiza el estado de un usuario
   */
  async invalidateOnStatusUpdate(
    userId: number,
    newStatusId: number,
  ): Promise<void> {
    try {
      await this.cacheService.delete(`user:${userId}`);
      await this.cacheService.delete(`user:profile:${userId}`);

      this.logger.log(
        `Caché invalidado para usuario ${userId} por cambio de estado a ${newStatusId}`,
      );
    } catch (error) {
      this.logger.error(
        `Error al invalidar caché por cambio de estado: ${error.message}`,
      );
    }
  }

  /**
   * Invalidar caché masivo cuando se actualiza información de una branch
   */
  async invalidateOnBranchUpdate(branchId: number): Promise<void> {
    try {
      // Invalidar todos los usuarios relacionados con la branch usando patrón
      await this.cacheService.deletePattern(`branch:${branchId}:*`);

      this.logger.log(
        `Caché invalidado masivamente por actualización de branch ${branchId}`,
      );
    } catch (error) {
      this.logger.error(
        `Error al invalidar caché masivo por branch: ${error.message}`,
      );
    }
  }

  /**
   * Forzar actualización del perfil en caché
   */
  async refreshUserProfile(userId: number): Promise<void> {
    try {
      // Invalidar primero
      await this.cacheService.delete(`user:${userId}`);
      await this.cacheService.delete(`user:profile:${userId}`);

      this.logger.log(`Perfil refrescado en caché para usuario ${userId}`);
    } catch (error) {
      this.logger.error(`Error al refrescar perfil en caché: ${error.message}`);
    }
  }

  /**
   * Verificar si un usuario existe en caché
   */
  async isUserInCache(userId: number): Promise<boolean> {
    try {
      const cached = await this.cacheService.get(`user:${userId}`);
      return cached !== null;
    } catch (error) {
      this.logger.error(
        `Error al verificar usuario en caché: ${error.message}`,
      );
      return false;
    }
  }

  /**
   * Obtener estadísticas de caché de usuarios
   */
  async getCacheStats(): Promise<{
    totalCachedUsers: number;
    cacheHitRate: number;
  }> {
    // Implementar si el sistema de caché lo soporta
    return {
      totalCachedUsers: 0,
      cacheHitRate: 0,
    };
  }
}
