import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsString,
} from 'class-validator';
import { PaginationDto } from 'src/shared/common/dtos/pagination.dto';

export class CreateRolePermissionDto {
  @ApiProperty({
    example: 1,
    description: 'Role ID',
  })
  @IsNumber()
  @IsNotEmpty()
  role_id: number;

  @ApiProperty({
    example: 'CREATE_ORDER',
    description: 'Permission code',
  })
  @IsString()
  @IsNotEmpty()
  permission_code: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the permission is active for this role',
    required: false,
    default: true,
  })
  @IsOptional()
  is_active?: boolean;
}

export class UpdateRolePermissionDto {
  @ApiProperty({
    example: 1,
    description: 'Role ID',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  role_id?: number;

  @ApiProperty({
    example: 'CREATE_ORDER',
    description: 'Permission code',
    required: false,
  })
  @IsString()
  @IsOptional()
  permission_code?: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the permission is active for this role',
    required: false,
  })
  @IsOptional()
  is_active?: boolean;
}

export class RolePermissionPaginationDto extends PaginationDto {
  @ApiProperty({
    example: 1,
    description: 'Filter by role ID',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  role_id?: number;

  @ApiProperty({
    example: 'CREATE_ORDER',
    description: 'Filter by permission code',
    required: false,
  })
  @IsString()
  @IsOptional()
  permission_code?: string;
}

export class AssignPermissionsToRoleDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'Permission IDs to assign to the role',
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  permission_ids: number[];
}
