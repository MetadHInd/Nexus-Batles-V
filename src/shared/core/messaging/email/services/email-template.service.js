"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.EmailTemplateService = void 0;
// src/shared/core/messaging/email/services/email-template.service.ts
var common_1 = require("@nestjs/common");
var fs = require("fs");
var path = require("path");
/**
 * Servicio para manejo de plantillas de correo electrónico
 */
var EmailTemplateService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var EmailTemplateService = _classThis = /** @class */ (function () {
        function EmailTemplateService_1() {
            this.logger = new common_1.Logger(EmailTemplateService.name);
            this.templateCache = new Map();
            // Determinar la ruta de las plantillas
            this.templateDir =
                process.env.EMAIL_TEMPLATES_DIR || path.resolve('templates/email');
            // Asegurar que el directorio existe
            try {
                if (!fs.existsSync(this.templateDir)) {
                    fs.mkdirSync(this.templateDir, { recursive: true });
                    this.logger.log("Created email templates directory: ".concat(this.templateDir));
                }
            }
            catch (error) {
                this.logger.error("Could not create email templates directory: ".concat(error.message));
            }
        }
        /**
         * Obtiene una plantilla HTML y reemplaza las variables con los datos proporcionados
         * @param templateName Nombre de la plantilla (sin extensión)
         * @param data Datos para reemplazar variables en la plantilla
         * @returns HTML de la plantilla con las variables reemplazadas
         */
        EmailTemplateService_1.prototype.render = function (templateName_1) {
            return __awaiter(this, arguments, void 0, function (templateName, data) {
                var template, result, error_1;
                if (data === void 0) { data = {}; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            // Log para depuración
                            this.logger.debug("Rendering template: ".concat(templateName, " with data: ").concat(JSON.stringify(data)));
                            template = this.templateCache.get(templateName);
                            if (!!template) return [3 /*break*/, 2];
                            this.logger.debug("Template not in cache, loading from file");
                            return [4 /*yield*/, this.loadTemplate(templateName)];
                        case 1:
                            template = _a.sent();
                            this.templateCache.set(templateName, template);
                            _a.label = 2;
                        case 2:
                            result = this.replaceVariables(template, data);
                            this.logger.debug("Template rendered successfully");
                            return [2 /*return*/, result];
                        case 3:
                            error_1 = _a.sent();
                            this.logger.error("Error rendering template '".concat(templateName, "': ").concat(error_1.message), error_1.stack);
                            // En vez de fallar, retornar una plantilla genérica de error
                            return [2 /*return*/, "\n        <html>\n          <body>\n            <h1>Error al cargar la plantilla</h1>\n            <p>No se pudo cargar la plantilla: ".concat(templateName, "</p>\n            <p>Error: ").concat(error_1.message, "</p>\n            <hr>\n            <p>Los datos proporcionados fueron:</p>\n            <pre>").concat(JSON.stringify(data, null, 2), "</pre>\n          </body>\n        </html>\n      ")];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Carga una plantilla HTML desde el sistema de archivos
         * @param templateName Nombre de la plantilla (sin extensión)
         * @returns Contenido de la plantilla
         */
        EmailTemplateService_1.prototype.loadTemplate = function (templateName) {
            return __awaiter(this, void 0, void 0, function () {
                var templatePath, template, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            templatePath = path.join(this.templateDir, "".concat(templateName, ".html"));
                            this.logger.debug("Loading template from ".concat(templatePath));
                            return [4 /*yield*/, fs.promises.readFile(templatePath, 'utf8')];
                        case 1:
                            template = _a.sent();
                            this.logger.debug("Loaded template '".concat(templateName, "' successfully"));
                            return [2 /*return*/, template];
                        case 2:
                            error_2 = _a.sent();
                            // Si no encuentra la plantilla, intentar usar una plantilla por defecto
                            if (error_2.code === 'ENOENT') {
                                this.logger.warn("Template '".concat(templateName, "' not found, using default template"));
                                return [2 /*return*/, this.getDefaultTemplate()];
                            }
                            this.logger.error("Error loading template '".concat(templateName, "': ").concat(error_2.message));
                            throw error_2;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Reemplaza las variables en la plantilla con los datos proporcionados
         * @param template Plantilla HTML con variables en formato {{variable}}
         * @param data Datos para reemplazar las variables
         * @returns Plantilla con las variables reemplazadas
         */
        EmailTemplateService_1.prototype.replaceVariables = function (template, data) {
            // Agregar algunas variables estándar si no existen
            var enhancedData = __assign({ currentYear: new Date().getFullYear(), appName: process.env.EMAIL_APP_NAME || 'Texel Sync', company: process.env.EMAIL_DEFAULT_COMPANY || 'Texel Bit SAS', supportEmail: process.env.EMAIL_SUPPORT_EMAIL || 'support@texelbit.com', companyAddress: process.env.EMAIL_COMPANY_ADDRESS || 'Texel Bit SAS, Colombia' }, data);
            // Reemplazar las variables en formato {{variable}}
            return template.replace(/{{(\w+)}}/g, function (match, key) {
                return enhancedData[key] !== undefined
                    ? String(enhancedData[key])
                    : match;
            });
        };
        /**
         * Retorna una plantilla HTML por defecto
         * @returns Plantilla HTML básica
         */
        EmailTemplateService_1.prototype.getDefaultTemplate = function () {
            return "<!DOCTYPE html>\n<html>\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>{{title}}</title>\n    <style>\n        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }\n        .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; }\n        .header { text-align: center; padding: 10px; background: linear-gradient(90deg, #6125a7 0%, #000000 100%); color: white; }\n        .content { padding: 20px 0; }\n        .footer { text-align: center; font-size: 12px; color: #777; margin-top: 20px; padding: 10px; background: #f5f5f5; }\n    </style>\n</head>\n<body>\n    <div class=\"container\">\n        <div class=\"header\">\n            <h1>{{title}}</h1>\n        </div>\n        <div class=\"content\">\n            {{content}}\n        </div>\n        <div class=\"footer\">\n            <p>\u00A9 {{currentYear}} {{company}}. Todos los derechos reservados.</p>\n            <p>{{companyAddress}}<br>\n            <a href=\"mailto:{{supportEmail}}\">{{supportEmail}}</a></p>\n        </div>\n    </div>\n</body>\n</html>";
        };
        /**
         * Limpia el caché de plantillas
         */
        EmailTemplateService_1.prototype.clearCache = function () {
            this.templateCache.clear();
            this.logger.debug('Template cache cleared');
        };
        /**
         * Guarda una plantilla en el sistema de archivos
         * @param templateName Nombre de la plantilla (sin extensión)
         * @param content Contenido HTML de la plantilla
         */
        EmailTemplateService_1.prototype.saveTemplate = function (templateName, content) {
            return __awaiter(this, void 0, void 0, function () {
                var templatePath, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            templatePath = path.join(this.templateDir, "".concat(templateName, ".html"));
                            return [4 /*yield*/, fs.promises.writeFile(templatePath, content, 'utf8')];
                        case 1:
                            _a.sent();
                            // Actualizar el caché
                            this.templateCache.set(templateName, content);
                            this.logger.log("Template '".concat(templateName, "' saved successfully to ").concat(templatePath));
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            this.logger.error("Error saving template '".concat(templateName, "': ").concat(error_3.message));
                            throw new Error("Failed to save email template: ".concat(error_3.message));
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Lista todas las plantillas disponibles
         * @returns Lista de nombres de plantillas (sin extensión)
         */
        EmailTemplateService_1.prototype.listTemplates = function () {
            return __awaiter(this, void 0, void 0, function () {
                var files, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, fs.promises.readdir(this.templateDir)];
                        case 1:
                            files = _a.sent();
                            // Filtrar solo archivos HTML y quitar la extensión
                            return [2 /*return*/, files
                                    .filter(function (file) { return file.endsWith('.html'); })
                                    .map(function (file) { return file.replace('.html', ''); })];
                        case 2:
                            error_4 = _a.sent();
                            this.logger.error("Error listing templates: ".concat(error_4.message));
                            return [2 /*return*/, []];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return EmailTemplateService_1;
    }());
    __setFunctionName(_classThis, "EmailTemplateService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EmailTemplateService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EmailTemplateService = _classThis;
}();
exports.EmailTemplateService = EmailTemplateService;
