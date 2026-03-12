import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from './pagination.dto';

export class RolePaginationDto extends PaginationDto {
  @ApiProperty({
    example: 1,
    description: 'ID del rol a filtrar',
    required: true,
  })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  roleId: number;
}

export class StatusPaginationDto extends PaginationDto {
  @ApiProperty({
    example: 1,
    description: 'ID del estado a filtrar',
    required: true,
  })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  statusId: number;
}
