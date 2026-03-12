import { SetMetadata } from '@nestjs/common';

export const BRANCH_ACCESS_KEY = 'branchAccess';

export interface BranchAccessConfig {
  requireManager?: boolean;
  paramName?: string; // nombre del parámetro que contiene el branchId
  bodyField?: string; // campo en el body que contiene el branchId
}

/**
 * Decorador para controlar acceso a branches específicas
 * @param config Configuración del acceso a branch
 *
 * @example
 * // Requiere acceso a la branch (parámetro branchId)
 * @RequireBranchAccess()
 *
 * // Requiere ser manager de la branch
 * @RequireBranchAccess({ requireManager: true })
 *
 * // Usar parámetro personalizado
 * @RequireBranchAccess({ paramName: 'id' })
 *
 * // Usar campo del body
 * @RequireBranchAccess({ bodyField: 'branch_id' })
 */
export const RequireBranchAccess = (config: BranchAccessConfig = {}) =>
  SetMetadata(BRANCH_ACCESS_KEY, config);

/**
 * Decorador específico para managers
 */
export const RequireBranchManager = (paramName?: string) =>
  RequireBranchAccess({ requireManager: true, paramName });
