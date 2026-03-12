// gmail-message-params.dto.ts
import { IsOptional, IsString, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GmailMessageParamsDto {
  @ApiPropertyOptional({ description: 'Message ID' })
  @IsString()
  messageId: string;

  @ApiPropertyOptional({ 
    description: 'Message format (full, metadata, minimal, raw)',
    default: 'full'
  })
  @IsOptional()
  @IsString()
  format?: 'full' | 'metadata' | 'minimal' | 'raw' = 'full';

  @ApiPropertyOptional({ 
    description: 'Metadata headers to include',
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  metadataHeaders?: string[];
}