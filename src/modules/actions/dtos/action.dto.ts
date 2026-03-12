import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class CreateActionDto {
  @ApiProperty({
    example: 'Permite crear nuevos registros',
    description: 'Descripción de la acción',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'create',
    description: 'Slug único de la acción',
    required: false,
  })
  @IsString()
  @IsOptional()
  slug?: string;
}

export class UpdateActionDto {
  @ApiProperty({
    example: 'Permite actualizar registros existentes',
    description: 'Descripción de la acción',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'update',
    description: 'Slug único de la acción',
    required: false,
  })
  @IsString()
  @IsOptional()
  slug?: string;
}

export class BulkDeleteActionDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array de IDs de acciones a eliminar',
    type: [Number],
  })
  @IsNotEmpty()
  ids: number[];
}
