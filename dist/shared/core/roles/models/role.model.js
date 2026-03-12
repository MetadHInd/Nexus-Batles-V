"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleModel = void 0;
class RoleModel {
    idrole;
    description;
    constructor(data) {
        Object.assign(this, data);
    }
    static fromEntity(entity) {
        return new RoleModel({
            idrole: entity.idrole,
            description: entity.description,
        });
    }
    toEntity() {
        return {
            idrole: this.idrole,
            description: this.description,
        };
    }
}
exports.RoleModel = RoleModel;
//# sourceMappingURL=role.model.js.map