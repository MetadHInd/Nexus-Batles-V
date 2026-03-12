"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BypassForSystemAdmin = exports.BYPASS_FOR_SYSTEM_ADMIN_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.BYPASS_FOR_SYSTEM_ADMIN_KEY = 'bypassForSystemAdmin';
const BypassForSystemAdmin = () => (0, common_1.SetMetadata)(exports.BYPASS_FOR_SYSTEM_ADMIN_KEY, true);
exports.BypassForSystemAdmin = BypassForSystemAdmin;
//# sourceMappingURL=bypass-for-system-admin.decorator.js.map