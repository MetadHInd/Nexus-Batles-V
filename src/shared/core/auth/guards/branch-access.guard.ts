import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BRANCH_ACCESS_KEY } from '../decorators/branch-access.decorator';

export interface BranchAccessConfig {
  requireManager?: boolean;
  paramName?: string; // nombre del parámetro que contiene el branchId
  bodyField?: string; // campo en el body que contiene el branchId
}

@Injectable()
export class BranchAccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const config = this.reflector.getAllAndOverride<BranchAccessConfig>(
      BRANCH_ACCESS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!config) {
      return true; // No hay restricción de branch
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.profile) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Extraer branchId del request
    let branchId: number;

    if (config.paramName) {
      branchId = parseInt(request.params[config.paramName]);
    } else if (config.bodyField) {
      branchId = parseInt(request.body[config.bodyField]);
    } else {
      // Buscar en parámetros comunes
      branchId = parseInt(
        request.params.branchId ||
          request.params.branch_id ||
          request.body.branchId ||
          request.body.branch_id,
      );
    }

    if (isNaN(branchId)) {
      throw new BadRequestException('ID de sucursal inválido o faltante');
    }

    // Verificar acceso a la branch
    if (!user.profile.canAccessBranch(branchId)) {
      throw new ForbiddenException('No tiene acceso a esta sucursal');
    }

    // Verificar si requiere ser manager
    if (config.requireManager && !user.profile.canManageBranch(branchId)) {
      throw new ForbiddenException(
        'Requiere permisos de administrador en esta sucursal',
      );
    }

    // Agregar branchId al request para uso posterior
    request.currentBranchId = branchId;

    return true;
  }
}
