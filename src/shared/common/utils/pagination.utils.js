"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationUtils = void 0;
var PaginationUtils = /** @class */ (function () {
    function PaginationUtils() {
    }
    /**
     * Crea los metadatos de paginación
     */
    PaginationUtils.createPaginationMeta = function (params, totalItems) {
        var maxPage = Math.ceil(totalItems / params.limit);
        var hasNextPage = params.page < maxPage;
        var hasPreviousPage = params.page > 1;
        var nextPage = hasNextPage ? params.page + 1 : null;
        return {
            currentPage: params.page,
            nextPage: nextPage,
            maxPage: maxPage,
            totalItems: totalItems,
            itemsPerPage: params.limit,
            hasNextPage: hasNextPage,
            hasPreviousPage: hasPreviousPage,
        };
    };
    /**
     * Crea la respuesta paginada completa
     */
    PaginationUtils.createPaginatedResponse = function (data, params, totalItems) {
        var pagination = this.createPaginationMeta(params, totalItems);
        return {
            data: data,
            pagination: pagination,
        };
    };
    /**
     * Genera la clave de cache para paginación
     */
    PaginationUtils.generateCacheKey = function (baseKey, params, additionalParams) {
        var cacheParams = __assign({ page: params.page, limit: params.limit, sortBy: params.sortBy, sortOrder: params.sortOrder }, additionalParams);
        var paramsString = Object.entries(cacheParams)
            .sort(function (_a, _b) {
            var a = _a[0];
            var b = _b[0];
            return a.localeCompare(b);
        })
            .map(function (_a) {
            var key = _a[0], value = _a[1];
            return "".concat(key, ":").concat(value);
        })
            .join('_');
        return "".concat(baseKey, "_paginated_").concat(paramsString);
    };
    /**
     * Crea el objeto orderBy para Prisma
     */
    PaginationUtils.createOrderBy = function (params) {
        var _a;
        return _a = {},
            _a[params.sortBy] = params.sortOrder,
            _a;
    };
    /**
     * Valida los parámetros de paginación
     */
    PaginationUtils.validateParams = function (params) {
        if (params.page < 1) {
            throw new Error('Page must be greater than 0');
        }
        if (params.limit < 1 || params.limit > 100) {
            throw new Error('Limit must be between 1 and 100');
        }
    };
    return PaginationUtils;
}());
exports.PaginationUtils = PaginationUtils;
