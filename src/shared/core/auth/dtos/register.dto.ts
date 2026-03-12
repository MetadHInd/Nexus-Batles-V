import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsNumber } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'Email del usuario' })
  @IsEmail()
  userEmail: string;

  @ApiProperty({ example: 'password123', description: 'Contraseña (mínimo 6 caracteres)' })
  @IsString()
  @MinLength(6)
  userPassword: string;

  @ApiProperty({ example: 'John', description: 'Nombre del usuario', required: false })
  @IsString()
  @IsOptional()
  userName?: string;

  @ApiProperty({ example: 'Doe', description: 'Apellido del usuario', required: false })
  @IsString()
  @IsOptional()
  userLastName?: string;

  @ApiProperty({ example: '+1234567890', description: 'Teléfono del usuario', required: false })
  @IsString()
  @IsOptional()
  userPhone?: string;

  @ApiProperty({ example: 2, description: 'ID del rol (por defecto: User)', required: false })
  @IsNumber()
  @IsOptional()
  role_idrole?: number;
}
