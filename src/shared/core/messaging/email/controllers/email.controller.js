"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailController = void 0;
// src/shared/core/messaging/email/controllers/email.controller.ts
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var role_guard_1 = require("../../../../../../../../../../src/shared/core/auth/guards/role.guard");
var email_dtos_1 = require("../dtos/email-dtos");
var EmailController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('05 - Email'), (0, common_1.Controller)('api/messaging/email'), (0, common_1.UseGuards)(role_guard_1.RoleGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _send_decorators;
    var _sendBulk_decorators;
    var _sendTemplate_decorators;
    var EmailController = _classThis = /** @class */ (function () {
        function EmailController_1(emailService, templateService) {
            this.emailService = (__runInitializers(this, _instanceExtraInitializers), emailService);
            this.templateService = templateService;
        }
        EmailController_1.prototype.send = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var message;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            message = dto;
                            return [4 /*yield*/, this.emailService.send(message)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        EmailController_1.prototype.sendBulk = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var results, _i, _a, message, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            results = [];
                            _i = 0, _a = dto.messages;
                            _d.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            message = _a[_i];
                            _c = (_b = results).push;
                            return [4 /*yield*/, this.emailService.send(message)];
                        case 2:
                            _c.apply(_b, [_d.sent()]);
                            _d.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, results];
                    }
                });
            });
        };
        EmailController_1.prototype.sendTemplate = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var html, message;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.templateService.render(dto.templateName, dto.templateData)];
                        case 1:
                            html = _a.sent();
                            message = {
                                to: dto.to,
                                subject: dto.subject,
                                html: html,
                                attachments: dto.attachments,
                            };
                            return [4 /*yield*/, this.emailService.send(message)];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        return EmailController_1;
    }());
    __setFunctionName(_classThis, "EmailController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _send_decorators = [(0, common_1.Post)('send'), (0, swagger_1.ApiOperation)({ summary: 'Enviar un email' }), (0, swagger_1.ApiBody)({ type: email_dtos_1.SendEmailDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Email enviado correctamente' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Parámetros inválidos' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' })];
        _sendBulk_decorators = [(0, common_1.Post)('send-bulk'), (0, swagger_1.ApiOperation)({ summary: 'Enviar múltiples emails' }), (0, swagger_1.ApiBody)({ type: email_dtos_1.SendBulkEmailDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Emails enviados correctamente' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Parámetros inválidos' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' })];
        _sendTemplate_decorators = [(0, common_1.Post)('send-template'), (0, swagger_1.ApiOperation)({ summary: 'Enviar un email usando una plantilla' }), (0, swagger_1.ApiBody)({ type: email_dtos_1.SendTemplateEmailDto }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Email con plantilla enviado correctamente',
            }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Parámetros inválidos' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' })];
        __esDecorate(_classThis, null, _send_decorators, { kind: "method", name: "send", static: false, private: false, access: { has: function (obj) { return "send" in obj; }, get: function (obj) { return obj.send; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _sendBulk_decorators, { kind: "method", name: "sendBulk", static: false, private: false, access: { has: function (obj) { return "sendBulk" in obj; }, get: function (obj) { return obj.sendBulk; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _sendTemplate_decorators, { kind: "method", name: "sendTemplate", static: false, private: false, access: { has: function (obj) { return "sendTemplate" in obj; }, get: function (obj) { return obj.sendTemplate; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EmailController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EmailController = _classThis;
}();
exports.EmailController = EmailController;
