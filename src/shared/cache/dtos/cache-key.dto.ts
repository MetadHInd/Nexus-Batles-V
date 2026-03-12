import { IsString, IsOptional, IsBoolean, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CacheKeyDto {
  @ApiProperty({ 
    description: 'Clave de cache a buscar',
    example: 'user_id_1'
  })
  @IsString()
  key: string;
}

export class CachePatternDto {
  @ApiProperty({ 
    description: 'Patrón de búsqueda (soporta wildcards *)',
    example: 'user_*'
  })
  @IsString()
  pattern: string;
}

export class SetCacheDto {
  @ApiProperty({ 
    description: 'Clave del cache',
    example: 'test_key'
  })
  @IsString()
  key: string;

  @ApiProperty({ 
    description: 'Valor a guardar (será serializado a JSON)',
    example: { data: 'test value' }
  })
  value: any;

  @ApiPropertyOptional({ 
    description: 'Tiempo de expiración en segundos (opcional)',
    example: 3600
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  ttl?: number;
}

export class ClearCachePatternDto {
  @ApiPropertyOptional({ 
    description: 'Patrón específico a limpiar (opcional, si no se provee limpia todo)',
    example: 'users_*'
  })
  @IsOptional()
  @IsString()
  pattern?: string;

  @ApiPropertyOptional({ 
    description: 'Solo limpiar caches de paginación',
    default: false
  })
  @IsOptional()
  @IsBoolean()
  paginationOnly?: boolean;
}

export class CacheStatsDto {
  @ApiProperty({ description: 'Total de claves en cache' })
  totalKeys: number;

  @ApiProperty({ description: 'Uso de memoria estimado (bytes)' })
  memoryUsage: number;

  @ApiProperty({ description: 'Estado de conexión con Redis' })
  connected: boolean;

  @ApiProperty({ description: 'Información del servidor Redis' })
  serverInfo?: any;
}
