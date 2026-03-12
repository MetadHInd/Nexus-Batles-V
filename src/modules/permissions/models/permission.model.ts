import { ApiProperty } from '@nestjs/swagger';
import { ICacheable } from 'src/shared/cache/interfaces/cacheable.interface';

export class PermissionModel implements ICacheable {
  @ApiProperty({
    example: 1,
    description: 'ID único del permiso',
  })
  id: number;

  @ApiProperty({
    example: 'CREATE_ORDER',
    description: 'Código único del permiso',
  })
  code: string;

  @ApiProperty({
    example: 'Create Order',
    description: 'Nombre descriptivo del permiso',
  })
  name: string;

  @ApiProperty({
    example: 'Allows user to create new orders',
    description: 'Descripción detallada del permiso',
    required: false,
  })
  description: string | null;

  @ApiProperty({
    example: true,
    description: 'Indica si el permiso está activo',
  })
  is_active: boolean;

  @ApiProperty({
    example: ['development', 'production'],
    description: 'IDs de tenants asociados',
    type: [String],
  })
  tenant_ids: string[];

  @ApiProperty({
    example: 1,
    description: 'ID de la acción asociada',
    required: false,
  })
  action_id: number | null;

  @ApiProperty({
    example: 1,
    description: 'ID del módulo asociado',
  })
  module_id: number;

  @ApiProperty({
    example: 'orders-management:create',
    description: 'Slug único del permiso',
    required: false,
  })
  slug: string | null;

  constructor(
    id: number,
    code: string,
    name: string,
    description: string | null,
    is_active: boolean,
    tenant_ids: string[],
    action_id: number | null,
    module_id: number,
    slug: string | null,
  ) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.description = description;
    this.is_active = is_active;
    this.tenant_ids = tenant_ids;
    this.action_id = action_id;
    this.module_id = module_id;
    this.slug = slug;
  }

  // Métodos de ICacheable
  cacheKey(): string {
    return `permission:${this.id}`;
  }

  cacheTTL(): number {
    return 3600; // 1 hora en segundos
  }

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      code: this.code,
      name: this.name,
      description: this.description,
      is_active: this.is_active,
      tenant_ids: this.tenant_ids,
      action_id: this.action_id,
      module_id: this.module_id,
      slug: this.slug,
    };
  }

  static fromJSON(json: {
    id: number;
    code: string;
    name: string;
    description: string | null;
    is_active: boolean;
    tenant_ids: string[];
    action_id: number | null;
    module_id: number;
    slug: string | null;
  }): PermissionModel {
    return new PermissionModel(
      json.id,
      json.code,
      json.name,
      json.description,
      json.is_active,
      json.tenant_ids,
      json.action_id,
      json.module_id,
      json.slug,
    );
  }
}
