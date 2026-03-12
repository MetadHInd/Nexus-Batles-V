"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePaginatedService = void 0;
const base_cache_service_1 = require("../../cache/base-cache.service");
const pagination_dto_1 = require("../dtos/pagination.dto");
const pagination_utils_1 = require("../utils/pagination.utils");
class BasePaginatedService extends base_cache_service_1.BaseCacheService {
    constructor(cache) {
        super(cache);
    }
    async executePaginatedQuery(cacheKey, paginationDto, queryFn, useCache = true, additionalCacheParams) {
        const params = new pagination_dto_1.PaginationParams(paginationDto);
        pagination_utils_1.PaginationUtils.validateParams(params);
        const fullCacheKey = pagination_utils_1.PaginationUtils.generateCacheKey(cacheKey, params, additionalCacheParams);
        return this.tryCacheOrExecute(cacheKey, { key: fullCacheKey }, useCache, async () => {
            const { data, total } = await queryFn(params);
            return pagination_utils_1.PaginationUtils.createPaginatedResponse(data, params, total);
        });
    }
    async invalidatePaginationCaches(cacheKey) {
        const pattern = `${cacheKey}_paginated_*`;
        await this.cache.deletePattern(pattern);
    }
}
exports.BasePaginatedService = BasePaginatedService;
//# sourceMappingURL=base-paginated.service.js.map