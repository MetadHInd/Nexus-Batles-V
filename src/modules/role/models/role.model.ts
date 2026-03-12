import { ApiProperty } from '@nestjs/swagger';
import { ICacheable } from 'src/shared/cache/interfaces/cacheable.interface';

export class RoleModel implements ICacheable {
  @ApiProperty({
    example: 1,
    description: 'Unique role ID',
  })
  idrole: number;

  @ApiProperty({
    example: 'Administrador',
    description: 'Role description',
    maxLength: 45,
  })
  description: string | null;

  @ApiProperty({
    example: ['development', 'production'],
    description: 'Associated tenant IDs',
    type: [String],
  })
  tenant_ids: string[];

  @ApiProperty({
    example: false,
    description: 'Indicates if it is a super administrator role',
  })
  is_super: boolean | null;

  @ApiProperty({
    example: 50,
    description: 'Hierarchical level of the role (1-100). Higher number = higher authority',
    minimum: 1,
    maximum: 100,
  })
  hierarchy_level: number;

  constructor(
    idrole: number,
    description: string | null,
    tenant_ids: string[],
    is_super: boolean | null,
    hierarchy_level: number = 50,
  ) {
    this.idrole = idrole;
    this.description = description;
    this.tenant_ids = tenant_ids;
    this.is_super = is_super;
    this.hierarchy_level = hierarchy_level;
  }

  cacheKey(): string {
    return `role:${this.idrole}`;
  }

  cacheTTL(): number {
    // 1 hora en segundos
    return 3600;
  }

  toJSON(): Record<string, any> {
    return {
      idrole: this.idrole,
      description: this.description,
      tenant_ids: this.tenant_ids,
      is_super: this.is_super,
      hierarchy_level: this.hierarchy_level,
    };
  }

  static fromJSON(json: {
    idrole: number;
    description: string | null;
    tenant_ids: string[];
    is_super: boolean | null;
    hierarchy_level?: number;
  }): RoleModel {
    return new RoleModel(
      json.idrole,
      json.description,
      json.tenant_ids,
      json.is_super,
      json.hierarchy_level || 50,
    );
  }

  static fromPrisma(data: any): RoleModel {
    return new RoleModel(
      data.idrole,
      data.description,
      data.tenant_ids,
      data.is_super,
      data.hierarchy_level || 50,
    );
  }
}
