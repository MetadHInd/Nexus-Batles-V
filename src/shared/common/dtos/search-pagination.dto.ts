import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationDto } from 'src/shared/common';

export class SearchPaginationDto extends PaginationDto {
  @ApiProperty({
    example: 'Juan',
    description: 'Término de búsqueda',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  searchTerm?: string;
}
