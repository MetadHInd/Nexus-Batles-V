import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsBoolean } from 'class-validator';

export class ClearModuleCacheDto {
  @ApiPropertyOptional({
    description: 'Lista de módulos para limpiar su caché',
    example: ['order', 'customer', 'menu'],
    isArray: true,
    type: String,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  modules?: string[];

  @ApiPropertyOptional({
    description: 'Tenant ID específico para limpiar caché (si no se proporciona, limpia del tenant actual)',
    example: 'aiabase',
  })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiPropertyOptional({
    description: 'Limpiar todo el caché (ignora módulos específicos)',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  clearAll?: boolean;

  @ApiPropertyOptional({
    description: 'Pattern personalizado para limpiar (formato: tenant:namespace:pattern)',
    example: '*:order:*',
  })
  @IsOptional()
  @IsString()
  customPattern?: string;
}

export class ClearCacheResponseDto {
  @ApiProperty({
    description: 'Indica si la operación fue exitosa',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Mensaje descriptivo del resultado',
    example: 'Caché limpiado exitosamente para 3 módulos',
  })
  message: string;

  @ApiProperty({
    description: 'Número de claves eliminadas',
    example: 45,
  })
  keysDeleted: number;

  @ApiPropertyOptional({
    description: 'Detalles de los módulos limpiados',
    example: {
      order: 15,
      customer: 20,
      menu: 10,
    },
  })
  details?: Record<string, number>;

  @ApiPropertyOptional({
    description: 'Tenant ID usado para la operación',
    example: 'aiabase',
  })
  tenantId?: string;
}

export class GetCacheKeysDto {
  @ApiPropertyOptional({
    description: 'Pattern para buscar claves (formato Redis)',
    example: '*:order:*',
    default: '*',
  })
  @IsOptional()
  @IsString()
  pattern?: string;

  @ApiPropertyOptional({
    description: 'Tenant ID específico (si no se proporciona, usa el tenant actual)',
    example: 'aiabase',
  })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiPropertyOptional({
    description: 'Módulo específico para filtrar',
    example: 'order',
  })
  @IsOptional()
  @IsString()
  module?: string;
}

export class CacheKeysResponseDto {
  @ApiProperty({
    description: 'Indica si la operación fue exitosa',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Total de claves encontradas',
    example: 125,
  })
  totalKeys: number;

  @ApiProperty({
    description: 'Lista de claves encontradas',
    example: ['galatea:order:findAll', 'galatea:customer:findById:id=123'],
    isArray: true,
  })
  keys: string[];

  @ApiPropertyOptional({
    description: 'Claves agrupadas por módulo',
    example: {
      order: 45,
      customer: 50,
      menu: 30,
    },
  })
  groupedByModule?: Record<string, number>;
}
