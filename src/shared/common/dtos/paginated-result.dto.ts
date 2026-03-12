import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponse, PaginationMeta } from './pagination.dto';

/**
 * 📊 DTO GENÉRICO PARA RESPUESTAS PAGINADAS
 * 
 * Usa la misma estructura que PaginatedResponse pero con decoradores de Swagger
 */
export class PaginatedResultDto<T> implements PaginatedResponse<T> {
  @ApiProperty({
    description: 'Array de datos de la página actual',
    isArray: true,
  })
  data: T[];

  @ApiProperty({
    description: 'Metadatos de paginación',
    type: 'object',
    properties: {
      currentPage: { type: 'number', example: 1 },
      nextPage: { type: 'number', example: 2, nullable: true },
      maxPage: { type: 'number', example: 10 },
      totalItems: { type: 'number', example: 100 },
      itemsPerPage: { type: 'number', example: 10 },
      hasNextPage: { type: 'boolean', example: true },
      hasPreviousPage: { type: 'boolean', example: false },
    },
  })
  pagination: PaginationMeta;
}

/**
 * 📄 METADATOS DE PAGINACIÓN COMPLETOS
 * Información detallada sobre el estado de la paginación
 */
export interface SimplePaginationMeta {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  nextPage: number | null;
  previousPage: number | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * 📋 DTO PARA RESPUESTAS PAGINADAS
 * Estructura completa de paginación con navegación
 */
export class SimplePaginatedDto<T> {
  @ApiProperty({
    description: 'Array de datos de la página actual',
    isArray: true,
  })
  data: T[];

  @ApiProperty({
    description: 'Metadatos de paginación completos',
    type: 'object',
    properties: {
      currentPage: { type: 'number', example: 2, description: 'Página actual' },
      itemsPerPage: { type: 'number', example: 10, description: 'Items por página' },
      totalItems: { type: 'number', example: 100, description: 'Total de registros' },
      totalPages: { type: 'number', example: 10, description: 'Total de páginas (maxPage)' },
      nextPage: { type: 'number', example: 3, nullable: true, description: 'Número de página siguiente (null si es la última)' },
      previousPage: { type: 'number', example: 1, nullable: true, description: 'Número de página anterior (null si es la primera)' },
      hasNextPage: { type: 'boolean', example: true, description: 'Indica si hay página siguiente' },
      hasPreviousPage: { type: 'boolean', example: true, description: 'Indica si hay página anterior' },
    },
  })
  pagination: SimplePaginationMeta;
}
