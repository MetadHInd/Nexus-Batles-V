import { PaginatedResponse, PaginationMeta } from './pagination.dto';
export declare class PaginatedResultDto<T> implements PaginatedResponse<T> {
    data: T[];
    pagination: PaginationMeta;
}
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
export declare class SimplePaginatedDto<T> {
    data: T[];
    pagination: SimplePaginationMeta;
}
