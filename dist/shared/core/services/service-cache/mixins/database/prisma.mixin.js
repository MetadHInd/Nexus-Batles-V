"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
exports.WithPrisma = WithPrisma;
const prisma_service_1 = require("../../../../../database/prisma.service");
Object.defineProperty(exports, "PrismaService", { enumerable: true, get: function () { return prisma_service_1.PrismaService; } });
function WithPrisma(Base) {
    return class extends Base {
        _prismaService = new prisma_service_1.PrismaService();
        get Prisma() {
            return this._prismaService;
        }
    };
}
//# sourceMappingURL=prisma.mixin.js.map