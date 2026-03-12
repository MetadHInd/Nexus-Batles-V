// gmail-attachment-params.dto.ts
import { IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GmailAttachmentParamsDto {
  @ApiPropertyOptional({ description: 'Message ID' })
  @IsString()
  messageId: string;

  @ApiPropertyOptional({ description: 'Attachment ID' })
  @IsString()
  attachmentId: string;
}