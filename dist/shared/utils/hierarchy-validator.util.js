"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HierarchyValidator = void 0;
const common_1 = require("@nestjs/common");
const service_cache_1 = require("../core/services/service-cache/service-cache");
class HierarchyValidator {
    static logger = new common_1.Logger(HierarchyValidator.name);
    static async validateRoleHierarchy(currentUserRoleId, targetRoleId, operationDescription = 'esta operación') {
        const currentHierarchy = await this.getRoleHierarchy(currentUserRoleId);
        const targetHierarchy = await this.getRoleHierarchy(targetRoleId);
        if (currentHierarchy === null) {
            this.logger.warn(`⚠️ No se pudo determinar jerarquía del rol ${currentUserRoleId}`);
            throw new common_1.ForbiddenException('No se pudo determinar tu nivel de jerarquía');
        }
        if (targetHierarchy === null) {
            this.logger.warn(`⚠️ No se pudo determinar jerarquía del rol objetivo ${targetRoleId}`);
            throw new common_1.ForbiddenException('No se pudo determinar la jerarquía del rol objetivo');
        }
        if (currentHierarchy <= targetHierarchy) {
            const targetRole = await this.getRoleDescription(targetRoleId);
            this.logger.warn(`🚫 Usuario con rol ${currentUserRoleId} (jerarquía: ${currentHierarchy}) ` +
                `intentó realizar ${operationDescription} sobre rol '${targetRole}' (jerarquía: ${targetHierarchy})`);
            throw new common_1.ForbiddenException(`No tienes suficiente jerarquía para realizar ${operationDescription}. ` +
                `Tu nivel: ${currentHierarchy}, Nivel objetivo: ${targetHierarchy}. ` +
                `Solo puedes actuar sobre roles con nivel menor a ${currentHierarchy}`);
        }
        this.logger.debug(`✅ Usuario con rol ${currentUserRoleId} (jerarquía: ${currentHierarchy}) ` +
            `autorizado para ${operationDescription} sobre rol ${targetRoleId} (jerarquía: ${targetHierarchy})`);
    }
    static async validateUserHierarchy(currentUserRoleId, targetUserId, operationDescription = 'esta operación') {
        const targetUser = await service_cache_1.ServiceCache.Database.Prisma.sysUser.findUnique({
            where: { idsysUser: targetUserId },
            select: {
                userName: true,
                role: true,
            },
        });
        if (!targetUser || !targetUser.role) {
            this.logger.warn(`⚠️ Usuario objetivo ${targetUserId} no encontrado o sin rol asignado`);
            throw new common_1.ForbiddenException('Usuario objetivo no encontrado o sin rol asignado');
        }
        await this.validateRoleHierarchy(currentUserRoleId, targetUser.role, `${operationDescription} sobre el usuario ${targetUser.userName || targetUserId}`);
    }
    static async validateRoleCreationOrAssignment(currentUserRoleId, roleToAssign, operationDescription = 'crear/asignar este rol') {
        await this.validateRoleHierarchy(currentUserRoleId, roleToAssign, operationDescription);
    }
    static async getRoleHierarchy(roleId) {
        try {
            const role = await service_cache_1.ServiceCache.Database.Prisma.role.findUnique({
                where: { idrole: roleId },
                select: { hierarchy_level: true },
            });
            return role?.hierarchy_level ?? null;
        }
        catch (error) {
            this.logger.error(`❌ Error al obtener jerarquía del rol ${roleId}:`, error);
            return null;
        }
    }
    static async getRoleDescription(roleId) {
        try {
            const role = await service_cache_1.ServiceCache.Database.Prisma.role.findUnique({
                where: { idrole: roleId },
                select: { description: true },
            });
            return role?.description || 'Desconocido';
        }
        catch (error) {
            this.logger.error(`❌ Error al obtener descripción del rol ${roleId}:`, error);
            return 'Desconocido';
        }
    }
}
exports.HierarchyValidator = HierarchyValidator;
//# sourceMappingURL=hierarchy-validator.util.js.map