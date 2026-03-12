import { PaginationMeta, PaginatedResponse, PaginationParams } from '../dtos/pagination.dto';
export declare class PaginationUtils {
    static createPaginationMeta(params: PaginationParams, totalItems: number): PaginationMeta;
    static createPaginatedResponse<T>(data: T[], params: PaginationParams, totalItems: number): PaginatedResponse<T>;
    static generateCacheKey(baseKey: string, params: PaginationParams, additionalParams?: Record<string, any>): string;
    static createOrderBy(params: PaginationParams): Record<string, 'asc' | 'desc'>;
    static validateParams(params: PaginationParams): void;
}
