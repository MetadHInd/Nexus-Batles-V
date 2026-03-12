import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsInt,
  Min,
  IsString,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @ApiProperty({
    example: 1,
    description: 'Número de página (empezando desde 1)',
    minimum: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    example: 20,
    description: 'Cantidad de resultados por página',
    minimum: 1,
    maximum: 100,
    default: 20,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 20;

  @ApiProperty({
    example: 'id',
    description: 'Campo por el cual ordenar los resultados. Puede ser cualquier campo válido de la entidad (ej: id, name, createdAt, etc.)',
    required: false,
    default: 'id',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'id';

  @ApiProperty({
    example: 'asc',
    description: 'Orden de clasificación',
    enum: ['asc', 'desc'],
    default: 'asc',
    required: false,
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc';
}

export interface PaginationMeta {
  currentPage: number;
  nextPage: number | null;
  maxPage: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export class PaginationParams {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';

  constructor(dto: PaginationDto) {
    this.page = dto.page || 1;
    this.limit = Math.min(dto.limit || 20, 100); // Máximo 100 elementos
    this.skip = (this.page - 1) * this.limit;
    this.sortBy = dto.sortBy || 'id';
    this.sortOrder = dto.sortOrder || 'asc';
  }
}
