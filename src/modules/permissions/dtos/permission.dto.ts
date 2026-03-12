import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
  IsNotEmpty,
  IsBoolean,
  IsArray,
  IsNumber,
} from 'class-validator';
import { PaginationDto } from 'src/shared/common/dtos/pagination.dto';

export class CreatePermissionDto {
  @ApiProperty({
    example: 'Create Order',
    description: 'Nombre descriptivo del permiso (se genera automáticamente si no se proporciona)',
    maxLength: 255,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @ApiProperty({
    example: 'Allows user to create new orders',
    description: 'Descripción detallada del permiso',
    maxLength: 500,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Indica si el permiso está activo',
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({
    example: 1,
    description: 'ID de la acción asociada',
  })
  @IsNumber()
  @IsNotEmpty()
  action_id: number;

  @ApiProperty({
    example: 1,
    description: 'ID del módulo asociado',
  })
  @IsNumber()
  @IsNotEmpty()
  module_id: number;
}

export class UpdatePermissionDto {
  @ApiProperty({
    example: 'CREATE_ORDER',
    description: 'Código único del permiso',
    maxLength: 100,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  code?: string;

  @ApiProperty({
    example: 'Create Order',
    description: 'Nombre descriptivo del permiso',
    maxLength: 255,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @ApiProperty({
    example: 'Allows user to create new orders',
    description: 'Descripción detallada del permiso',
    maxLength: 500,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Indica si el permiso está activo',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({
    example: 1,
    description: 'ID de la acción asociada',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  action_id?: number;

  @ApiProperty({
    example: 1,
    description: 'ID del módulo asociado',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  module_id?: number;
}

export class PermissionPaginationDto extends PaginationDto {
  @ApiProperty({
    example: true,
    description: 'Filtrar por permisos activos/inactivos',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({
    example: 'CREATE',
    description: 'Buscar por código de permiso (coincidencia parcial)',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;
}
