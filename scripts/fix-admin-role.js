#!/usr/bin/env ts-node
"use strict";
/**
 * 🔧 Script para asignar rol ADMIN (id=2) al usuario admin
 *
 * Uso: npx ts-node scripts/fix-admin-role.ts
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
function fixAdminRole() {
    return __awaiter(this, void 0, void 0, function () {
        var admin, adminRole, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 9, 10, 12]);
                    console.log('🔍 Buscando usuario admin...');
                    return [4 /*yield*/, prisma.sysUser.findFirst({
                            where: { userEmail: 'admin@yoursaas.com' },
                            include: { role: true },
                        })];
                case 1:
                    admin = _b.sent();
                    if (!admin) {
                        console.log('❌ Usuario admin no encontrado');
                        return [2 /*return*/];
                    }
                    console.log("\uD83D\uDCE7 Admin encontrado: ".concat(admin.userEmail));
                    console.log("\uD83C\uDFAD Rol actual: ".concat(((_a = admin.role) === null || _a === void 0 ? void 0 : _a.rolename) || 'N/A', " (ID: ").concat(admin.role_idrole, ")"));
                    return [4 /*yield*/, prisma.role.findUnique({
                            where: { idrole: 2 },
                        })];
                case 2:
                    adminRole = _b.sent();
                    if (!!adminRole) return [3 /*break*/, 4];
                    console.log('🎭 Creando rol Admin con ID 2...');
                    return [4 /*yield*/, prisma.role.create({
                            data: {
                                idrole: 2,
                                rolename: 'Admin',
                                description: 'Administrator role with full system access',
                                priority: 100,
                                tenant_ids: ['development', 'production', 'demo'],
                            },
                        })];
                case 3:
                    adminRole = _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    console.log("\u2705 Rol Admin (ID: 2) ya existe: ".concat(adminRole.rolename));
                    _b.label = 5;
                case 5:
                    if (!(admin.role_idrole !== 2)) return [3 /*break*/, 7];
                    console.log('🔄 Actualizando rol del admin a ADMIN (ID: 2)...');
                    return [4 /*yield*/, prisma.sysUser.update({
                            where: { idsysUser: admin.idsysUser },
                            data: {
                                role_idrole: 2,
                            },
                        })];
                case 6:
                    _b.sent();
                    console.log('✅ Rol actualizado correctamente');
                    return [3 /*break*/, 8];
                case 7:
                    console.log('✅ Admin ya tiene el rol correcto');
                    _b.label = 8;
                case 8:
                    console.log('');
                    console.log('🎉 Configuración completada:');
                    console.log('📧 Email: admin@yoursaas.com');
                    console.log('🔑 Password: admin123');
                    console.log('🎭 Rol: ADMIN (ID: 2)');
                    return [3 /*break*/, 12];
                case 9:
                    error_1 = _b.sent();
                    console.error('❌ Error al actualizar rol:', error_1);
                    throw error_1;
                case 10: return [4 /*yield*/, prisma.$disconnect()];
                case 11:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    });
}
fixAdminRole();
