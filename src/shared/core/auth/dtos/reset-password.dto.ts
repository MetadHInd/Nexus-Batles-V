import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RequestResetPasswordDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'Email del usuario' })
  @IsEmail()
  userEmail: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'abc123token', description: 'Token de recuperación' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'newPassword123', description: 'Nueva contraseña (mínimo 6 caracteres)' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
