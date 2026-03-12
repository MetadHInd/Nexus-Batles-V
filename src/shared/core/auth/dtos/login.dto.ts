// src/modules/auth/dtos/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ default: 'test@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ default: 'password123' })
  @IsString()
  password: string;
}
