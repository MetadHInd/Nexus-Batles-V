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
exports.ModuleModel = void 0;
const swagger_1 = require("@nestjs/swagger");
class ModuleModel {
    id;
    name;
    module;
    description;
    uuid;
    slug;
    constructor(id, name, module, description, uuid, slug) {
        this.id = id;
        this.name = name;
        this.module = module;
        this.description = description;
        this.uuid = uuid;
        this.slug = slug;
    }
    cacheKey() {
        return `module_${this.id}`;
    }
    cacheTTL() {
        return 3600;
    }
    static fromDatabase(data) {
        return new ModuleModel(data.id, data.name, data.module, data.description, data.uuid, data.slug);
    }
    static fromJSON(json) {
        return new ModuleModel(json.id, json.name, json.module, json.description, json.uuid, json.slug);
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            module: this.module,
            description: this.description,
            uuid: this.uuid,
            slug: this.slug,
        };
    }
}
exports.ModuleModel = ModuleModel;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'ID único del módulo',
    }),
    __metadata("design:type", Number)
], ModuleModel.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Orders Management',
        description: 'Nombre del módulo',
    }),
    __metadata("design:type", String)
], ModuleModel.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'orders',
        description: 'Identificador del módulo',
    }),
    __metadata("design:type", String)
], ModuleModel.prototype, "module", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Módulo para gestión completa de órdenes',
        description: 'Descripción detallada del módulo',
        required: false,
    }),
    __metadata("design:type", Object)
], ModuleModel.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'UUID único del módulo',
    }),
    __metadata("design:type", String)
], ModuleModel.prototype, "uuid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'orders-management',
        description: 'Slug único del módulo',
        required: false,
    }),
    __metadata("design:type", Object)
], ModuleModel.prototype, "slug", void 0);
//# sourceMappingURL=module.model.js.map