import { ForbiddenException, Logger } from '@nestjs/common';
import { ServiceCache } from '../core/services/service-cache/service-cache';

/**
 * Utilidad para validar jerarquías de roles
 * 
 * Esta utilidad valida que un usuario tenga suficiente jerarquía para realizar
 * operaciones sobre otros usuarios o roles.
 */
export class HierarchyValidator {
  private static readonly logger = new Logger(HierarchyValidator.name);

  /**
   * Valida que el usuario actual tenga mayor jerarquía que el rol objetivo
   * 
   * @param currentUserRoleId - ID del rol del usuario que realiza la acción
   * @param targetRoleId - ID del rol objetivo sobre el que se quiere actuar
   * @param operationDescription - Descripción de la operación (para logs)
   * @throws ForbiddenException si no tiene suficiente jerarquía
   */
  static async validateRoleHierarchy(
    currentUserRoleId: number,
    targetRoleId: number,
    operationDescription: string = 'esta operación',
  ): Promise<void> {
    const currentHierarchy = await this.getRoleHierarchy(currentUserRoleId);
    const targetHierarchy = await this.getRoleHierarchy(targetRoleId);

    if (currentHierarchy === null) {
      this.logger.warn(`⚠️ No se pudo determinar jerarquía del rol ${currentUserRoleId}`);
      throw new ForbiddenException('No se pudo determinar tu nivel de jerarquía');
    }

    if (targetHierarchy === null) {
      this.logger.warn(`⚠️ No se pudo determinar jerarquía del rol objetivo ${targetRoleId}`);
      throw new ForbiddenException('No se pudo determinar la jerarquía del rol objetivo');
    }

    // Jerarquía: números mayores = más privilegios, números menores = menos privilegios
    // Solo puedes actuar sobre roles con hierarchy_level MENOR al tuyo (menor privilegio)
    if (currentHierarchy <= targetHierarchy) {
      const targetRole = await this.getRoleDescription(targetRoleId);
      this.logger.warn(
        `🚫 Usuario con rol ${currentUserRoleId} (jerarquía: ${currentHierarchy}) ` +
        `intentó realizar ${operationDescription} sobre rol '${targetRole}' (jerarquía: ${targetHierarchy})`
      );
      throw new ForbiddenException(
        `No tienes suficiente jerarquía para realizar ${operationDescription}. ` +
        `Tu nivel: ${currentHierarchy}, Nivel objetivo: ${targetHierarchy}. ` +
        `Solo puedes actuar sobre roles con nivel menor a ${currentHierarchy}`
      );
    }

    this.logger.debug(
      `✅ Usuario con rol ${currentUserRoleId} (jerarquía: ${currentHierarchy}) ` +
      `autorizado para ${operationDescription} sobre rol ${targetRoleId} (jerarquía: ${targetHierarchy})`
    );
  }

  /**
   * Valida que el usuario actual tenga mayor jerarquía que el usuario objetivo
   * 
   * @param currentUserRoleId - ID del rol del usuario que realiza la acción
   * @param targetUserId - ID del usuario objetivo sobre el que se quiere actuar
   * @param operationDescription - Descripción de la operación (para logs)
   * @throws ForbiddenException si no tiene suficiente jerarquía
   */
  static async validateUserHierarchy(
    currentUserRoleId: number,
    targetUserId: number,
    operationDescription: string = 'esta operación',
  ): Promise<void> {
    const targetUser = await ServiceCache.Database.Prisma.sysUser.findUnique({
      where: { idsysUser: targetUserId },
      select: {
        userName: true,
        role: true,
      },
    });

    if (!targetUser || !targetUser.role) {
      this.logger.warn(`⚠️ Usuario objetivo ${targetUserId} no encontrado o sin rol asignado`);
      throw new ForbiddenException('Usuario objetivo no encontrado o sin rol asignado');
    }

    await this.validateRoleHierarchy(
      currentUserRoleId,
      targetUser.role,
      `${operationDescription} sobre el usuario ${targetUser.userName || targetUserId}`,
    );
  }

  /**
   * Valida que el rol a crear/asignar no tenga mayor o igual jerarquía que el usuario actual
   * 
   * @param currentUserRoleId - ID del rol del usuario que realiza la acción
   * @param roleToAssign - ID del rol que se quiere crear/asignar
   * @param operationDescription - Descripción de la operación (para logs)
   * @throws ForbiddenException si intenta crear/asignar un rol de mayor o igual jerarquía
   */
  static async validateRoleCreationOrAssignment(
    currentUserRoleId: number,
    roleToAssign: number,
    operationDescription: string = 'crear/asignar este rol',
  ): Promise<void> {
    await this.validateRoleHierarchy(currentUserRoleId, roleToAssign, operationDescription);
  }

  /**
   * Obtiene el nivel de jerarquía de un rol
   * 
   * @param roleId - ID del rol
   * @returns Nivel de jerarquía o null si no se encuentra
   */
  private static async getRoleHierarchy(roleId: number): Promise<number | null> {
    try {
      const role = await ServiceCache.Database.Prisma.role.findUnique({
        where: { idrole: roleId },
        select: { hierarchy_level: true },
      });

      return role?.hierarchy_level ?? null;
    } catch (error) {
      this.logger.error(`❌ Error al obtener jerarquía del rol ${roleId}:`, error);
      return null;
    }
  }

  /**
   * Obtiene la descripción de un rol
   * 
   * @param roleId - ID del rol
   * @returns Descripción del rol o 'Desconocido'
   */
  private static async getRoleDescription(roleId: number): Promise<string> {
    try {
      const role = await ServiceCache.Database.Prisma.role.findUnique({
        where: { idrole: roleId },
        select: { description: true },
      });

      return role?.description || 'Desconocido';
    } catch (error) {
      this.logger.error(`❌ Error al obtener descripción del rol ${roleId}:`, error);
      return 'Desconocido';
    }
  }
}
