import { IsOptional, IsString, IsEmail, IsNumber, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Nombre del usuario' })
  @IsOptional()
  @IsString()
  userName?: string;

  @ApiPropertyOptional({ description: 'Apellido del usuario' })
  @IsOptional()
  @IsString()
  userLastName?: string;

  @ApiPropertyOptional({ description: 'Email del usuario' })
  @IsOptional()
  @IsEmail()
  userEmail?: string;

  @ApiPropertyOptional({ description: 'Teléfono del usuario' })
  @IsOptional()
  @IsString()
  userPhone?: string;

  @ApiPropertyOptional({ description: 'ID del rol' })
  @IsOptional()
  @IsNumber()
  role_idrole?: number;

  @ApiPropertyOptional({ description: 'Estado activo' })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class ChangePasswordDto {
  @ApiPropertyOptional({ description: 'Contraseña actual' })
  @IsString()
  currentPassword: string;

  @ApiPropertyOptional({ description: 'Nueva contraseña' })
  @IsString()
  newPassword: string;
}
