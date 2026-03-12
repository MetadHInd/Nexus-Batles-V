import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ActivateAccountDto {
  @ApiProperty({ example: 'abc123token', description: 'Token de activación' })
  @IsString()
  token: string;
}

export class ResendActivationDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'Email del usuario' })
  @IsEmail()
  userEmail: string;
}
