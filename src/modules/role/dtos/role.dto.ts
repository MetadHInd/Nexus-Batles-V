import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
  IsNotEmpty,
  IsArray,
  IsNumber,
  Min,
  Max,
  IsInt,
} from 'class-validator';
import { PaginationDto } from 'src/shared/common/dtos/pagination.dto';
import { Type } from 'class-transformer';

export class CreateRoleDto {
  @ApiProperty({
    example: 'Administrador del Sistema',
    description: 'Role description',
    maxLength: 45,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  description: string;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'Permission IDs to assign to the role',
    required: false,
    type: [Number],
  })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  permission_ids?: number[];

  @ApiProperty({
    example: false,
    description: 'Indicates if it is a super administrator role',
    required: false,
    default: false,
  })
  @IsOptional()
  is_super?: boolean;

  @ApiProperty({
    example: 50,
    description: 'Hierarchical level of the role (1-100). Higher number = higher authority',
    required: false,
    default: 50,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  hierarchy_level?: number;
}

export class UpdateRoleDto {
  @ApiProperty({
    example: 'Administrador del Sistema',
    description: 'Role description',
    maxLength: 45,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(45)
  description?: string;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'Permission IDs to assign to the role (replaces existing permissions)',
    required: false,
    type: [Number],
  })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  permission_ids?: number[];

  @ApiProperty({
    example: false,
    description: 'Indicates if it is a super administrator role',
    required: false,
  })
  @IsOptional()
  is_super?: boolean;

  @ApiProperty({
    example: 50,
    description: 'Hierarchical level of the role (1-100). Higher number = higher authority',
    required: false,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  hierarchy_level?: number;
}

export class RolePaginationDto extends PaginationDto {
  @ApiProperty({
    example: 'admin',
    description: 'Search by role description',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    example: 'development',
    description: 'Filter by tenant ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  tenant_id?: string;
}

export class RoleResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Role ID',
  })
  idrole: number;

  @ApiProperty({
    example: 'Administrador del Sistema',
    description: 'Role description',
  })
  description: string | null;

  @ApiProperty({
    example: ['development'],
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
  })
  hierarchy_level: number;
}
