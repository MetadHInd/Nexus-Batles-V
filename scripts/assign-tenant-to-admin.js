#!/usr/bin/env ts-node
"use strict";
/**
 * 🔧 Script para asignar tenant al usuario admin
 *
 * Uso: npx ts-node scripts/assign-tenant-to-admin.ts
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
function assignTenantToAdmin() {
    return __awaiter(this, void 0, void 0, function () {
        var admin, tenants, _i, tenants_1, tenant, existing, isDefault, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, 9, 11]);
                    console.log('🔍 Buscando usuario admin...');
                    return [4 /*yield*/, prisma.sysUser.findFirst({
                            where: { userEmail: 'admin@yoursaas.com' },
                        })];
                case 1:
                    admin = _a.sent();
                    if (!admin) {
                        console.error('❌ Usuario admin no encontrado');
                        return [2 /*return*/];
                    }
                    console.log("\u2705 Usuario admin encontrado (ID: ".concat(admin.idsysUser, ")\n"));
                    console.log('🏢 Obteniendo tenants disponibles...');
                    return [4 /*yield*/, prisma.tenants.findMany({
                            where: { is_active: true },
                        })];
                case 2:
                    tenants = _a.sent();
                    if (tenants.length === 0) {
                        console.error('❌ No hay tenants disponibles. Ejecuta create-initial-tenants.ts primero.');
                        return [2 /*return*/];
                    }
                    console.log("\uD83D\uDCCB Encontrados ".concat(tenants.length, " tenants:\n"));
                    _i = 0, tenants_1 = tenants;
                    _a.label = 3;
                case 3:
                    if (!(_i < tenants_1.length)) return [3 /*break*/, 7];
                    tenant = tenants_1[_i];
                    console.log("\uD83D\uDD27 Asignando tenant: ".concat(tenant.name, " (").concat(tenant.slug, ")..."));
                    return [4 /*yield*/, prisma.user_tenants.findUnique({
                            where: {
                                user_id_tenant_id: {
                                    user_id: admin.idsysUser,
                                    tenant_id: tenant.id,
                                },
                            },
                        })];
                case 4:
                    existing = _a.sent();
                    if (existing) {
                        console.log("   \u26A0\uFE0F  Ya asignado");
                        return [3 /*break*/, 6];
                    }
                    isDefault = tenants[0].id === tenant.id;
                    return [4 /*yield*/, prisma.user_tenants.create({
                            data: {
                                user_id: admin.idsysUser,
                                tenant_id: tenant.id,
                                is_default: isDefault,
                                role_in_tenant: 'admin',
                                is_active: true,
                            },
                        })];
                case 5:
                    _a.sent();
                    console.log("   \u2705 Asignado ".concat(isDefault ? '(DEFAULT)' : ''));
                    console.log("   \uD83D\uDD11 Tenant Sub: ".concat(tenant.tenant_sub));
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 3];
                case 7:
                    console.log('\n✅ Tenants asignados exitosamente al usuario admin!');
                    console.log('\n📝 Ahora puedes hacer login y seleccionar el tenant');
                    console.log('   Email: admin@yoursaas.com');
                    console.log('   Password: admin123');
                    return [3 /*break*/, 11];
                case 8:
                    error_1 = _a.sent();
                    console.error('❌ Error:', error_1);
                    throw error_1;
                case 9: return [4 /*yield*/, prisma.$disconnect()];
                case 10:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    });
}
assignTenantToAdmin();
