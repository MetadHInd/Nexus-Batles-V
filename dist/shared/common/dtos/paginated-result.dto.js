"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimplePaginatedDto = exports.PaginatedResultDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class PaginatedResultDto {
    data;
    pagination;
}
exports.PaginatedResultDto = PaginatedResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array de datos de la página actual',
        isArray: true,
    }),
    __metadata("design:type", Array)
], PaginatedResultDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
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
    }),
    __metadata("design:type", Object)
], PaginatedResultDto.prototype, "pagination", void 0);
class SimplePaginatedDto {
    data;
    pagination;
}
exports.SimplePaginatedDto = SimplePaginatedDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array de datos de la página actual',
        isArray: true,
    }),
    __metadata("design:type", Array)
], SimplePaginatedDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
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
    }),
    __metadata("design:type", Object)
], SimplePaginatedDto.prototype, "pagination", void 0);
//# sourceMappingURL=paginated-result.dto.js.map