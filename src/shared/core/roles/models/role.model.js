"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleModel = void 0;
var RoleModel = /** @class */ (function () {
    function RoleModel(data) {
        Object.assign(this, data);
    }
    RoleModel.fromEntity = function (entity) {
        return new RoleModel({
            idrole: entity.idrole,
            description: entity.description,
        });
    };
    RoleModel.prototype.toEntity = function () {
        return {
            idrole: this.idrole,
            description: this.description,
        };
    };
    return RoleModel;
}());
exports.RoleModel = RoleModel;
