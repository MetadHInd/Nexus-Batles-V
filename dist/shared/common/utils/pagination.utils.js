"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationUtils = void 0;
class PaginationUtils {
    static createPaginationMeta(params, totalItems) {
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
    static createPaginatedResponse(data, params, totalItems) {
        const pagination = this.createPaginationMeta(params, totalItems);
        return {
            data,
            pagination,
        };
    }
    static generateCacheKey(baseKey, params, additionalParams) {
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
    static createOrderBy(params) {
        return {
            [params.sortBy]: params.sortOrder,
        };
    }
    static validateParams(params) {
        if (params.page < 1) {
            throw new Error('Page must be greater than 0');
        }
        if (params.limit < 1 || params.limit > 100) {
            throw new Error('Limit must be between 1 and 100');
        }
    }
}
exports.PaginationUtils = PaginationUtils;
//# sourceMappingURL=pagination.utils.js.map