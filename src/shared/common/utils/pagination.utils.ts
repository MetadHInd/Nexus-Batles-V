import { PaginationMeta, PaginatedResponse, PaginationParams } from '../dtos/pagination.dto';

export class PaginationUtils {
  /**
   * Crea los metadatos de paginación
   */
  static createPaginationMeta(
    params: PaginationParams,
    totalItems: number,
  ): PaginationMeta {
    const maxPage = Math.ceil(totalItems / params.limit);
    const hasNextPage = params.page < maxPage;
    const hasPreviousPage = params.page > 1;
    const nextPage = hasNextPage ? params.page + 1 : null;

    return {
      currentPage: params.page,
      nextPage,
      maxPage,
      totalItems,
      itemsPerPage: params.limit,
      hasNextPage,
      hasPreviousPage,
    };
  }

  /**
   * Crea la respuesta paginada completa
   */
  static createPaginatedResponse<T>(
    data: T[],
    params: PaginationParams,
    totalItems: number,
  ): PaginatedResponse<T> {
    const pagination = this.createPaginationMeta(params, totalItems);

    return {
      data,
      pagination,
    };
  }

  /**
   * Genera la clave de cache para paginación
   */
  static generateCacheKey(
    baseKey: string,
    params: PaginationParams,
    additionalParams?: Record<string, any>,
  ): string {
    const cacheParams = {
      page: params.page,
      limit: params.limit,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      ...additionalParams,
    };

    const paramsString = Object.entries(cacheParams)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}:${value}`)
      .join('_');

    return `${baseKey}_paginated_${paramsString}`;
  }

  /**
   * Crea el objeto orderBy para Prisma
   */
  static createOrderBy(params: PaginationParams): Record<string, 'asc' | 'desc'> {
    return {
      [params.sortBy]: params.sortOrder,
    };
  }

  /**
   * Valida los parámetros de paginación
   */
  static validateParams(params: PaginationParams): void {
    if (params.page < 1) {
      throw new Error('Page must be greater than 0');
    }
    if (params.limit < 1 || params.limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }
  }
}
