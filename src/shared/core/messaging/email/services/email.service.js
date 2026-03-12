"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.EmailService = void 0;
// src/shared/core/messaging/email/services/email.service.ts
var common_1 = require("@nestjs/common");
var nodemailer = require("nodemailer");
var circuit_breaker_handler_1 = require("../../../../utils/circuit-breaker.handler");
var EmailService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var EmailService = _classThis = /** @class */ (function () {
        function EmailService_1(templateService) {
            this.templateService = templateService;
            this.logger = new common_1.Logger(EmailService.name);
            this.circuitBreaker = new circuit_breaker_handler_1.CircuitBreakerHandler();
        }
        EmailService_1.prototype.send = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                var smtp, transporter, mailOptions, info, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            smtp = {
                                host: process.env.SMTP_HOST,
                                port: Number(process.env.SMTP_PORT),
                                secure: process.env.SMTP_SECURE === 'true',
                                user: process.env.SMTP_USER,
                                pass: process.env.SMTP_PASS,
                                service: process.env.SMTP_SERVICE,
                            };
                            this.logger.debug("Sending email to ".concat(Array.isArray(email.to) ? email.to.join(', ') : email.to));
                            transporter = nodemailer.createTransport({
                                service: smtp.service,
                                host: smtp.host,
                                port: smtp.port,
                                secure: smtp.secure,
                                auth: {
                                    user: smtp.user,
                                    pass: smtp.pass,
                                },
                                tls: {
                                    rejectUnauthorized: false,
                                },
                            });
                            mailOptions = {
                                from: email.from || "\"GALATEA Notifications\" <".concat(smtp.user, ">"),
                                to: email.to,
                                subject: email.subject,
                                text: email.text || '',
                                html: email.html,
                                attachments: email.attachments || [],
                            };
                            return [4 /*yield*/, transporter.sendMail(mailOptions)];
                        case 1:
                            info = _a.sent();
                            this.logger.debug("Email sent successfully: ".concat(info.messageId));
                            return [2 /*return*/, {
                                    success: true,
                                    error: null,
                                    info: info,
                                }];
                        case 2:
                            error_1 = _a.sent();
                            this.logger.error("Email error: ".concat(error_1 instanceof Error ? error_1.message : String(error_1)));
                            return [2 /*return*/, {
                                    success: false,
                                    error: error_1 instanceof Error
                                        ? error_1.message
                                        : typeof error_1 === 'string'
                                            ? error_1
                                            : 'Unknown error',
                                    info: null,
                                }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        EmailService_1.prototype.sendBulk = function (config, emails) {
            return __awaiter(this, void 0, void 0, function () {
                var results, _i, emails_1, email, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            results = [];
                            _i = 0, emails_1 = emails;
                            _c.label = 1;
                        case 1:
                            if (!(_i < emails_1.length)) return [3 /*break*/, 4];
                            email = emails_1[_i];
                            _b = (_a = results).push;
                            return [4 /*yield*/, this.send(email)];
                        case 2:
                            _b.apply(_a, [_c.sent()]);
                            _c.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, results];
                    }
                });
            });
        };
        /**
         * Envía un email usando una plantilla HTML
         * @param templateName Nombre de la plantilla (sin extensión .html)
         * @param data Datos para reemplazar en la plantilla
         * @param to Destinatarios del email (string o array de strings)
         * @param subject Asunto del email
         * @param from Email del remitente (opcional)
         * @returns Resultado del envío
         */
        EmailService_1.prototype.sendWithTemplate = function (templateName, data, to, subject, from) {
            return __awaiter(this, void 0, void 0, function () {
                var html, message, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            this.logger.debug("Sending email with template: ".concat(templateName));
                            return [4 /*yield*/, this.generateTemplate(templateName, data)];
                        case 1:
                            html = _a.sent();
                            message = {
                                to: to,
                                subject: subject,
                                html: html,
                                from: from,
                            };
                            return [4 /*yield*/, this.send(message)];
                        case 2: 
                        // Enviar el email
                        return [2 /*return*/, _a.sent()];
                        case 3:
                            error_2 = _a.sent();
                            this.logger.error("Error sending email with template '".concat(templateName, "': ").concat(error_2.message), error_2.stack);
                            return [2 /*return*/, {
                                    success: false,
                                    error: error_2.message || 'Unknown error sending email with template',
                                    info: null,
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Genera HTML desde una plantilla
         * @param templateName Nombre de la plantilla (sin extensión .html)
         * @param data Datos para reemplazar en la plantilla
         * @returns HTML generado
         */
        EmailService_1.prototype.generateTemplate = function (templateName, data) {
            return __awaiter(this, void 0, void 0, function () {
                var error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            this.logger.debug("Generating template: ".concat(templateName));
                            return [4 /*yield*/, this.templateService.render(templateName, data)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            error_3 = _a.sent();
                            this.logger.error("Error generating template '".concat(templateName, "': ").concat(error_3.message), error_3.stack);
                            throw error_3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return EmailService_1;
    }());
    __setFunctionName(_classThis, "EmailService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EmailService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EmailService = _classThis;
}();
exports.EmailService = EmailService;
