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
exports.MessagingController = void 0;
// src/shared/core/messaging/controllers/messaging.controller.ts
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var role_guard_1 = require("../../../../../../../../../src/shared/core/auth/guards/role.guard");
var roles_enum_1 = require("../../../../../../../../../src/shared/core/auth/constants/roles.enum");
var roles_decorator_1 = require("../../../../../../../../../src/shared/core/auth/decorators/roles.decorator");
var messaging_provider_factory_1 = require("../utils/messaging-provider.factory");
var messaging_dtos_1 = require("../dtos/messaging-dtos");
var MessagingController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('08 - Messaging - General'), (0, common_1.Controller)('api/messaging'), (0, common_1.UseGuards)(role_guard_1.RoleGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _send_decorators;
    var MessagingController = _classThis = /** @class */ (function () {
        function MessagingController_1(messagingFactory) {
            this.messagingFactory = (__runInitializers(this, _instanceExtraInitializers), messagingFactory);
        }
        MessagingController_1.prototype.send = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var providerType, service, message;
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                return __generator(this, function (_l) {
                    switch (_l.label) {
                        case 0:
                            switch (dto.channel) {
                                case 'email':
                                    providerType = messaging_provider_factory_1.MessagingProvider.EMAIL;
                                    break;
                                case 'push':
                                    providerType = messaging_provider_factory_1.MessagingProvider.PUSH;
                                    break;
                                case 'sms':
                                    providerType = messaging_provider_factory_1.MessagingProvider.SMS;
                                    break;
                                default:
                                    throw new Error("Canal no soportado: ".concat(dto.channel));
                            }
                            service = this.messagingFactory.getProvider(providerType);
                            switch (providerType) {
                                case messaging_provider_factory_1.MessagingProvider.EMAIL:
                                    message = {
                                        to: dto.recipient,
                                        subject: dto.content.subject,
                                        html: dto.content.html,
                                        text: dto.content.text,
                                        attachments: dto.content.attachments,
                                    };
                                    break;
                                case messaging_provider_factory_1.MessagingProvider.PUSH:
                                    message = {
                                        recipient: {
                                            type: dto.recipient.type || 'player_id',
                                            value: dto.recipient.value,
                                        },
                                        content: {
                                            title: dto.content.title,
                                            body: dto.content.body,
                                            imageUrl: dto.content.imageUrl,
                                            url: dto.content.url,
                                            data: dto.content.data,
                                            buttons: dto.content.buttons,
                                        },
                                        scheduleFor: ((_a = dto.options) === null || _a === void 0 ? void 0 : _a.scheduleFor)
                                            ? new Date(dto.options.scheduleFor)
                                            : undefined,
                                        ttl: (_b = dto.options) === null || _b === void 0 ? void 0 : _b.ttl,
                                        priority: (_c = dto.options) === null || _c === void 0 ? void 0 : _c.priority,
                                        silent: (_d = dto.options) === null || _d === void 0 ? void 0 : _d.silent,
                                        collapseId: (_e = dto.options) === null || _e === void 0 ? void 0 : _e.collapseId,
                                        channelId: (_f = dto.options) === null || _f === void 0 ? void 0 : _f.channelId,
                                    };
                                    break;
                                case messaging_provider_factory_1.MessagingProvider.SMS:
                                    message = {
                                        to: dto.recipient,
                                        text: dto.content.text,
                                        from: (_g = dto.options) === null || _g === void 0 ? void 0 : _g.from,
                                        name: dto.content.name,
                                        mediaUrls: dto.content.mediaUrls,
                                        includedSegments: dto.content.includedSegments,
                                        scheduleFor: ((_h = dto.options) === null || _h === void 0 ? void 0 : _h.scheduleFor)
                                            ? new Date(dto.options.scheduleFor)
                                            : undefined,
                                        validityPeriod: (_j = dto.options) === null || _j === void 0 ? void 0 : _j.validityPeriod,
                                        reference: (_k = dto.options) === null || _k === void 0 ? void 0 : _k.reference,
                                    };
                                    break;
                            }
                            return [4 /*yield*/, service.send(message)];
                        case 1: 
                        // Enviar el mensaje
                        return [2 /*return*/, _l.sent()];
                    }
                });
            });
        };
        return MessagingController_1;
    }());
    __setFunctionName(_classThis, "MessagingController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _send_decorators = [(0, common_1.Post)('send'), (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.SUPERVISOR), (0, swagger_1.ApiOperation)({ summary: 'Enviar un mensaje por cualquier canal' }), (0, swagger_1.ApiBody)({ type: messaging_dtos_1.SendMessageDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Mensaje enviado correctamente' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Parámetros inválidos' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' })];
        __esDecorate(_classThis, null, _send_decorators, { kind: "method", name: "send", static: false, private: false, access: { has: function (obj) { return "send" in obj; }, get: function (obj) { return obj.send; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MessagingController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MessagingController = _classThis;
}();
exports.MessagingController = MessagingController;
