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
exports.ActionModel = void 0;
const swagger_1 = require("@nestjs/swagger");
class ActionModel {
    id;
    description;
    slug;
    constructor(id, description, slug) {
        this.id = id;
        this.description = description;
        this.slug = slug;
    }
    cacheKey() {
        return `action_${this.id}`;
    }
    cacheTTL() {
        return 3600;
    }
    static fromDatabase(data) {
        return new ActionModel(data.id, data.description, data.slug);
    }
    static fromJSON(json) {
        return new ActionModel(json.id, json.description, json.slug);
    }
    toJSON() {
        return {
            id: this.id,
            description: this.description,
            slug: this.slug,
        };
    }
}
exports.ActionModel = ActionModel;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'ID único de la acción',
    }),
    __metadata("design:type", Number)
], ActionModel.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Permite crear nuevos registros',
        description: 'Descripción de la acción',
        required: false,
    }),
    __metadata("design:type", Object)
], ActionModel.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'create',
        description: 'Slug único de la acción',
        required: false,
    }),
    __metadata("design:type", Object)
], ActionModel.prototype, "slug", void 0);
//# sourceMappingURL=action.model.js.map