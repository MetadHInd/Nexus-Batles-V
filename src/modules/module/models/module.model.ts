import { ApiProperty } from '@nestjs/swagger';
import { ICacheable } from 'src/shared/cache/interfaces/cacheable.interface';

export class ModuleModel implements ICacheable {
  @ApiProperty({
    example: 1,
    description: 'ID único del módulo',
  })
  id: number;

  @ApiProperty({
    example: 'Orders Management',
    description: 'Nombre del módulo',
  })
  name: string;

  @ApiProperty({
    example: 'orders',
    description: 'Identificador del módulo',
  })
  module: string;

  @ApiProperty({
    example: 'Módulo para gestión completa de órdenes',
    description: 'Descripción detallada del módulo',
    required: false,
  })
  description: string | null;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID único del módulo',
  })
  uuid: string;

  @ApiProperty({
    example: 'orders-management',
    description: 'Slug único del módulo',
    required: false,
  })
  slug: string | null;

  constructor(
    id: number,
    name: string,
    module: string,
    description: string | null,
    uuid: string,
    slug: string | null,
  ) {
    this.id = id;
    this.name = name;
    this.module = module;
    this.description = description;
    this.uuid = uuid;
    this.slug = slug;
  }

  cacheKey(): string {
    return `module_${this.id}`;
  }

  cacheTTL(): number {
    return 3600; // 1 hora en segundos
  }

  static fromDatabase(data: any): ModuleModel {
    return new ModuleModel(
      data.id,
      data.name,
      data.module,
      data.description,
      data.uuid,
      data.slug,
    );
  }

  static fromJSON(json: Record<string, any>): ModuleModel {
    return new ModuleModel(
      json.id,
      json.name,
      json.module,
      json.description,
      json.uuid,
      json.slug,
    );
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      module: this.module,
      description: this.description,
      uuid: this.uuid,
      slug: this.slug,
    };
  }
}
