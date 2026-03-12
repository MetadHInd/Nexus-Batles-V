import { ApiProperty } from '@nestjs/swagger';
import { ICacheable } from 'src/shared/cache/interfaces/cacheable.interface';

export class ActionModel implements ICacheable {
  @ApiProperty({
    example: 1,
    description: 'ID único de la acción',
  })
  id: number;

  @ApiProperty({
    example: 'Permite crear nuevos registros',
    description: 'Descripción de la acción',
    required: false,
  })
  description: string | null;

  @ApiProperty({
    example: 'create',
    description: 'Slug único de la acción',
    required: false,
  })
  slug: string | null;

  constructor(
    id: number,
    description: string | null,
    slug: string | null,
  ) {
    this.id = id;
    this.description = description;
    this.slug = slug;
  }

  cacheKey(): string {
    return `action_${this.id}`;
  }

  cacheTTL(): number {
    return 3600; // 1 hora en segundos
  }

  static fromDatabase(data: any): ActionModel {
    return new ActionModel(
      data.id,
      data.description,
      data.slug,
    );
  }

  static fromJSON(json: Record<string, any>): ActionModel {
    return new ActionModel(
      json.id,
      json.description,
      json.slug,
    );
  }

  toJSON() {
    return {
      id: this.id,
      description: this.description,
      slug: this.slug,
    };
  }
}
