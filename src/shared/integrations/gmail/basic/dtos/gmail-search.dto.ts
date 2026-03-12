// gmail-search.dto.ts
import { IsOptional, IsString, IsNumber, IsBoolean, IsArray, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GmailSearchDto {
  @ApiPropertyOptional({ 
    description: 'Gmail search query (same format as Gmail search)',
    example: 'from:example@gmail.com is:unread'
  })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({ 
    description: 'Maximum number of messages to return',
    minimum: 1,
    maximum: 500,
    default: 10
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(500)
  maxResults?: number = 10;

  @ApiPropertyOptional({ 
    description: 'Page token for pagination'
  })
  @IsOptional()
  @IsString()
  pageToken?: string;

  @ApiPropertyOptional({ 
    description: 'Include spam and trash',
    default: false
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  includeSpamTrash?: boolean = false;

  @ApiPropertyOptional({ 
    description: 'Label IDs to filter by',
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labelIds?: string[];
}