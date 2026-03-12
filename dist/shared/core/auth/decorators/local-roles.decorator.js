"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalRoles = void 0;
const common_1 = require("@nestjs/common");
const LocalRoles = (...roles) => (0, common_1.SetMetadata)('localRoles', roles);
exports.LocalRoles = LocalRoles;
//# sourceMappingURL=local-roles.decorator.js.map