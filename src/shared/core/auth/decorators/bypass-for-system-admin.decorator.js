"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BypassForSystemAdmin = exports.BYPASS_FOR_SYSTEM_ADMIN_KEY = void 0;
var common_1 = require("@nestjs/common");
exports.BYPASS_FOR_SYSTEM_ADMIN_KEY = 'bypassForSystemAdmin';
var BypassForSystemAdmin = function () {
    return (0, common_1.SetMetadata)(exports.BYPASS_FOR_SYSTEM_ADMIN_KEY, true);
};
exports.BypassForSystemAdmin = BypassForSystemAdmin;
