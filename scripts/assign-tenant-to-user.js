"use strict";
/**
 * Script para asignar un tenant a un usuario
 *
 * Uso:
 * npx ts-node scripts/assign-tenant-to-user.ts
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function assignTenantToUser() {
    return __awaiter(this, void 0, void 0, function () {
        var userEmail, user, tenant, existingRelation, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, 8, 10]);
                    userEmail = 'test@ejemplo.com';
                    console.log("\uD83D\uDD0D Buscando usuario: ".concat(userEmail));
                    return [4 /*yield*/, prisma.sysUser.findUnique({
                            where: { userEmail: userEmail },
                        })];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        console.error("\u274C Usuario no encontrado: ".concat(userEmail));
                        return [2 /*return*/];
                    }
                    console.log("\u2705 Usuario encontrado: ID ".concat(user.idsysUser));
                    return [4 /*yield*/, prisma.tenants.findFirst({
                            where: { slug: 'development' },
                        })];
                case 2:
                    tenant = _a.sent();
                    if (!!tenant) return [3 /*break*/, 4];
                    console.log('📝 Creando tenant "development"...');
                    return [4 /*yield*/, prisma.tenants.create({
                            data: {
                                slug: 'development',
                                name: 'Development',
                                is_active: true,
                            },
                        })];
                case 3:
                    tenant = _a.sent();
                    _a.label = 4;
                case 4:
                    console.log("\u2705 Tenant encontrado/creado: ".concat(tenant.slug, " (ID: ").concat(tenant.tenant_sub, ")"));
                    return [4 /*yield*/, prisma.user_tenants.findFirst({
                            where: {
                                user_id: user.idsysUser,
                                tenant_id: tenant.tenant_sub,
                            },
                        })];
                case 5:
                    existingRelation = _a.sent();
                    if (existingRelation) {
                        console.log('✅ El usuario ya tiene este tenant asignado');
                        return [2 /*return*/];
                    }
                    // Asignar tenant al usuario
                    return [4 /*yield*/, prisma.user_tenants.create({
                            data: {
                                user_id: user.idsysUser,
                                tenant_id: tenant.tenant_sub,
                                is_default: true,
                                is_active: true,
                            },
                        })];
                case 6:
                    // Asignar tenant al usuario
                    _a.sent();
                    console.log('🎉 ¡Tenant asignado exitosamente!');
                    console.log("   Usuario: ".concat(userEmail));
                    console.log("   Tenant: ".concat(tenant.name, " (").concat(tenant.slug, ")"));
                    return [3 /*break*/, 10];
                case 7:
                    error_1 = _a.sent();
                    console.error('❌ Error:', error_1);
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, prisma.$disconnect()];
                case 9:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    });
}
assignTenantToUser();
