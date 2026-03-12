import { IsString, IsOptional, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  rolename: string;

  @IsString()
  @IsOptional()
  description?: string;
}
