import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
  IsNotEmpty,
  IsArray,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateModuleDto {
  @ApiProperty({
    example: 'Orders Management',
    description: 'Nombre del módulo',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiProperty({
    example: 'orders',
    description: 'Identificador del módulo',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  module: string;

  @ApiProperty({
    example: 'Módulo para gestión completa de órdenes',
    description: 'Descripción detallada del módulo',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'orders-management',
    description: 'Slug único del módulo',
    maxLength: 255,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  slug?: string;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array de IDs de actions para crear permisos automáticamente',
    type: [Number],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  @Type(() => Number)
  action_ids?: number[];
}

export class UpdateModuleDto {
  @ApiProperty({
    example: 'Orders Management Updated',
    description: 'Nombre del módulo',
    maxLength: 150,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(150)
  name?: string;

  @ApiProperty({
    example: 'orders-v2',
    description: 'Identificador del módulo',
    maxLength: 150,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(150)
  module?: string;

  @ApiProperty({
    example: 'Descripción actualizada',
    description: 'Descripción detallada del módulo',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'orders-management-v2',
    description: 'Slug único del módulo',
    maxLength: 255,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  slug?: string;
  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array de IDs de actions para crear permisos automáticamente',
    type: [Number],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  @Type(() => Number)
  action_ids?: number[];}

export class BulkDeleteModuleDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array de IDs de módulos a eliminar',
    type: [Number],
  })
  @IsNotEmpty()
  ids: number[];
}
