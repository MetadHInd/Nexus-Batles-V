"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireBranchManager = exports.RequireBranchAccess = exports.BRANCH_ACCESS_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.BRANCH_ACCESS_KEY = 'branchAccess';
const RequireBranchAccess = (config = {}) => (0, common_1.SetMetadata)(exports.BRANCH_ACCESS_KEY, config);
exports.RequireBranchAccess = RequireBranchAccess;
const RequireBranchManager = (paramName) => (0, exports.RequireBranchAccess)({ requireManager: true, paramName });
exports.RequireBranchManager = RequireBranchManager;
//# sourceMappingURL=branch-access.decorator.js.map