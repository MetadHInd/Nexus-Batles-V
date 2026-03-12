import { ApiProperty } from '@nestjs/swagger';
import { ICacheable } from 'src/shared/cache/interfaces/cacheable.interface';

export class RolePermissionModel implements ICacheable {
  @ApiProperty({
    example: 1,
    description: 'ID único del role_permission',
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: 'ID del rol',
  })
  role_id: number;

  @ApiProperty({
    example: 1,
    description: 'ID del permiso',
  })
  permission_id: number;

  @ApiProperty({
    example: ['development', 'production'],
    description: 'IDs de tenants asociados',
    type: [String],
  })
  tenant_ids: string[];

  @ApiProperty({
    example: true,
    description: 'Indica si el permiso está activo para este rol',
  })
  is_active: boolean;

  constructor(
    id: number,
    role_id: number,
    permission_id: number,
    tenant_ids: string[],
    is_active: boolean,
  ) {
    this.id = id;
    this.role_id = role_id;
    this.permission_id = permission_id;
    this.tenant_ids = tenant_ids;
    this.is_active = is_active;
  }

  // Métodos de ICacheable
  cacheKey(): string {
    return `role_permission:${this.id}`;
  }

  cacheTTL(): number {
    return 3600; // 1 hora en segundos
  }

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      role_id: this.role_id,
      permission_id: this.permission_id,
      tenant_ids: this.tenant_ids,
      is_active: this.is_active,
    };
  }

  static fromJSON(json: {
    id: number;
    role_id: number;
    permission_id: number;
    tenant_ids: string[];
    is_active: boolean;
  }): RolePermissionModel {
    return new RolePermissionModel(
      json.id,
      json.role_id,
      json.permission_id,
      json.tenant_ids,
      json.is_active,
    );
  }
}

export class RolePermissionDetailModel extends RolePermissionModel {
  @ApiProperty({
    example: {
      id: 1,
      code: 'CREATE_ORDER',
      name: 'Create Order',
      description: 'Allows user to create new orders',
      is_active: true,
    },
    description: 'Detalles del permiso',
    required: false,
  })
  permission?: {
    id: number;
    code: string;
    name: string;
    description: string | null;
    is_active: boolean | null;
  };

  @ApiProperty({
    example: {
      idrole: 1,
      description: 'Administrator',
    },
    description: 'Detalles del rol',
    required: false,
  })
  role?: {
    idrole: number;
    description: string | null;
  };

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      role_id: this.role_id,
      permission_id: this.permission_id,
      tenant_ids: this.tenant_ids,
      ...(this.permission && { permission: this.permission }),
      ...(this.role && { role: this.role }),
    };
  }

  static fromJSON(json: any): RolePermissionDetailModel {
    const model = new RolePermissionDetailModel(
      json.id,
      json.role_id,
      json.permission_id,
      json.tenant_ids,
      json.is_active,
    );
    if (json.permission) model.permission = json.permission;
    if (json.role) model.role = json.role;
    return model;
  }
}
