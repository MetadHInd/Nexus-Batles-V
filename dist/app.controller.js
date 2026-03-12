"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
const fs_1 = require("fs");
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    getRoot(res) {
        const filePath = (0, path_1.join)(process.cwd(), 'public', 'login.html');
        console.log('🔍 Looking for file at:', filePath);
        console.log('🔍 File exists:', (0, fs_1.existsSync)(filePath));
        console.log('🔍 Current working directory:', process.cwd());
        if ((0, fs_1.existsSync)(filePath)) {
            res.sendFile(filePath);
        }
        else {
            res.status(404).json({
                error: 'login.html not found',
                cwd: process.cwd(),
                expectedPath: filePath
            });
        }
    }
    getLogin(res) {
        const filePath = (0, path_1.join)(process.cwd(), 'public', 'login.html');
        if ((0, fs_1.existsSync)(filePath)) {
            res.sendFile(filePath);
        }
        else {
            res.status(404).json({
                error: 'login.html not found',
                cwd: process.cwd(),
                expectedPath: filePath
            });
        }
    }
    getHealth() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getRoot", null);
__decorate([
    (0, common_1.Get)('login.html'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getLogin", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({
        summary: 'Health Check',
        description: 'Check if the application is running correctly',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Application is healthy',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'ok' },
                timestamp: { type: 'string', example: '2023-12-01T10:00:00.000Z' },
                uptime: { type: 'number', example: 123.456 },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHealth", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    (0, swagger_1.ApiTags)('System'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map