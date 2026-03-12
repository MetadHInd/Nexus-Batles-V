"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
// 🔧 FORCE LOAD SPECIFIC ENV FILE
dotenv.config({ path: '.env', override: true });
console.log('🔧 [ENV DEBUG] Forced loading .env file');
console.log('🔧 [ENV DEBUG] OPENAI_API_KEY from loaded env:', process.env.OPENAI_API_KEY ? "".concat(process.env.OPENAI_API_KEY.substring(0, 20), "...").concat(process.env.OPENAI_API_KEY.substring(process.env.OPENAI_API_KEY.length - 4)) : 'NOT_LOADED');
console.log('🔧 [ENV DEBUG] CLAUDE_API_KEY from loaded env:', process.env.CLAUDE_API_KEY ? "".concat(process.env.CLAUDE_API_KEY.substring(0, 20), "...").concat(process.env.CLAUDE_API_KEY.substring(process.env.CLAUDE_API_KEY.length - 4)) : 'NOT_LOADED');
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
var common_1 = require("@nestjs/common");
var core_1 = require("@nestjs/core");
var app_module_1 = require("./app.module");
var swagger_1 = require("@nestjs/swagger");
var global_exception_filter_1 = require("./shared/interceptors/global-exception.filter");
var answer_interceptor_1 = require("./shared/interceptors/answer.interceptor");
var response_time_middleware_1 = require("./shared/middleware/response-time.middleware");
var swagger_auth_middleware_1 = require("./shared/middleware/swagger-auth.middleware");
var cookieParser = require("cookie-parser");
var path_1 = require("path");
var express = require("express");
var prisma_service_1 = require("./shared/database/prisma.service");
var database_mixin_1 = require("./shared/core/services/service-cache/mixins/database/database.mixin");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function () {
        var app, prismaService, allowedOrigins, swaggerAuthMiddleware, config, document, filteredSchemas_1, schemas_1, tryPort, initialPort, finalPort, _a, _b, _c;
        var _this = this;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, core_1.NestFactory.create(app_module_1.AppModule)];
                case 1:
                    app = _e.sent();
                    prismaService = app.get(prisma_service_1.PrismaService);
                    database_mixin_1.Database.setGlobalInstance(prismaService);
                    console.log('🚀 [MAIN] Instancia global de Prisma establecida');
                    // Almacenar también en contexto global para acceso directo
                    global.nestApp = app;
                    // 🎯 CONFIGURACIÓN ESPECIAL PARA WEBHOOKS DE STRIPE
                    // Capturar raw body ANTES de que Express parsee el JSON
                    app.use('/api/payments/stripe/webhook', express.raw({ type: 'application/json' }));
                    // ⭐ NUEVO: Webhook de onboarding Connect
                    app.use('/api/payments/stripe/connect/webhook/onboarding', express.raw({ type: 'application/json' }));
                    allowedOrigins = [
                        'https://app.galatealabs.ai', // Production frontend
                        'https://sandbox.app.galatealabs.ai', // Sandbox frontend
                        'https://dev.app.galatealabs.ai', // Development frontend
                        'https://api.galatealabs.ai', // Production backend
                        'https://sandbox.api.galatealabs.ai', // Sandbox backend
                        'https://dev.api.galatealabs.ai', // Development backend
                        'http://localhost:3000', // Local development
                        'http://localhost:3001', // Local development alternate port
                        'http://localhost:4000',
                        'http://localhost:5174', // Vite default port
                        'http://localhost:5173', // Vite default port
                        "https://payments.galatealabs.ai",
                        "https://dev.payments.galatealabs.ai",
                        "https://sandbox.payments.galatealabs.ai",
                        "https://online.pincho.com",
                        "https://ordering.galatealabs.ai", // OrderingOnline production
                        "https://sandbox.ordering.galatealabs.ai", // OrderingOnline sandbox
                        "https://dev.ordering.galatealabs.ai", // OrderingOnline dev
                    ];
                    app.enableCors({
                        origin: function (origin, callback) {
                            // Allow requests with no origin (like mobile apps or Postman)
                            if (!origin)
                                return callback(null, true);
                            if (allowedOrigins.indexOf(origin) !== -1 ||
                                process.env.NODE_ENV === 'development') {
                                callback(null, true);
                            }
                            else {
                                callback(new Error('Not allowed by CORS'));
                            }
                        },
                        credentials: true,
                        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
                        allowedHeaders: [
                            'Content-Type',
                            'Authorization',
                            'X-Requested-With',
                            'app-version',
                            'restaurantsub',
                            'Accept',
                            'Origin',
                            'Cache-Control',
                            'X-CSRF-Token',
                            'guesttoken',
                        ],
                        exposedHeaders: ['Authorization'],
                    });
                    console.log("Loading api key ", process.env.OPENAI_API_KEY);
                    // Agregar cookie-parser middleware
                    app.use(cookieParser());
                    // Servir archivos estáticos desde public DESPUÉS de cookie-parser
                    app.use(express.static((0, path_1.join)(process.cwd(), 'public')));
                    swaggerAuthMiddleware = new swagger_auth_middleware_1.SwaggerAuthMiddleware();
                    // Aplicar middleware a todas las rutas de Swagger
                    app.use(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!req.path.startsWith('/api-docs')) return [3 /*break*/, 2];
                                    return [4 /*yield*/, swaggerAuthMiddleware.use(req, res, next)];
                                case 1: return [2 /*return*/, _a.sent()];
                                case 2:
                                    next();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    // Configuración de pipes globales
                    app.useGlobalPipes(new common_1.ValidationPipe({
                        whitelist: true,
                        transform: true,
                        forbidNonWhitelisted: true,
                        skipMissingProperties: false,
                        transformOptions: {
                            enableImplicitConversion: false,
                        },
                        exceptionFactory: function (validationErrors) {
                            if (validationErrors === void 0) { validationErrors = []; }
                            var formatted = validationErrors.map(function (e) { return ({
                                field: e.property,
                                errors: Object.values(e.constraints || {}),
                            }); });
                            var error = new Error('Validation failed');
                            error.isValidationError = true;
                            error.details = formatted;
                            return error;
                        },
                    }));
                    app.use(function (req, res, next) { return new response_time_middleware_1.ResponseTimeMiddleware().use(req, res, next); });
                    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
                    app.useGlobalInterceptors(new answer_interceptor_1.AnswerInterceptor());
                    config = new swagger_1.DocumentBuilder()
                        .setTitle('Backend API')
                        .setDescription("\n## \uD83D\uDE80 API de backend y Administrativa\n\n### \uD83D\uDCCB Documentaci\u00F3n Completa\nEsta API proporciona endpoints para:\n- \uD83D\uDD10 Autenticaci\u00F3n y autorizaci\u00F3n con JWT\n- \uD83D\uDC65 Gesti\u00F3n de usuarios y roles\n- \uD83D\uDCBE Control de cache en tiempo real\n- \uD83D\uDCCA Y mucho m\u00E1s...\n\n### \uD83D\uDD11 Autenticaci\u00F3n\nPara usar los endpoints protegidos:\n1. Usa `POST /api/sysUser/login` para obtener tu token JWT\n2. Haz clic en el bot\u00F3n **Authorize** \uD83D\uDD12 arriba\n3. Ingresa: `Bearer {tu-token}`\n4. \u00A1Listo! Ahora puedes usar todos los endpoints\n\n### \uD83C\uDF6A Cookies\nEl login tambi\u00E9n guarda el JWT en cookies httpOnly para mayor seguridad.\n    ")
                        .setVersion('1.0')
                        .addBearerAuth({
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                        description: 'Ingrese el JWT para autenticación (formato: Bearer {token})',
                        name: 'Authorization',
                    }, 'Authorization')
                        .addTag('00 - Auth', '🔐 Autenticación y autorización (Login, Register, Reset Password)')
                        .addTag('01 - Cache Management', '🎛️ Sistema de cache unificado (Tenant/Org/Team)')
                        .addTag('02 - Users Management', '👥 Gestión completa de usuarios (CRUD, roles, paginación)')
                        .addTag('05 - Email', '📧 Servicio de email con templates')
                        .build();
                    document = swagger_1.SwaggerModule.createDocument(app, config, {
                        operationIdFactory: function (controllerKey, methodKey) { return methodKey; },
                        ignoreGlobalPrefix: false,
                        deepScanRoutes: true,
                        extraModels: [], // No incluir modelos extra automáticamente
                    });
                    // Ocultar solo los schemas de Prisma, mantener los DTOs
                    if ((_d = document.components) === null || _d === void 0 ? void 0 : _d.schemas) {
                        filteredSchemas_1 = {};
                        schemas_1 = document.components.schemas;
                        // Mantener solo los schemas que NO son de Prisma
                        Object.keys(schemas_1).forEach(function (schemaName) {
                            // Filtrar schemas de Prisma (que típicamente tienen nombres como "User", "Order", etc. sin "Dto")
                            // y mantener los DTOs (que terminan en "Dto" o "Model")
                            if (schemaName.includes('Dto') ||
                                schemaName.includes('Model') ||
                                schemaName.includes('Response') ||
                                schemaName.includes('Request') ||
                                schemaName.includes('Type')) {
                                filteredSchemas_1[schemaName] = schemas_1[schemaName];
                            }
                        });
                        document.components.schemas = filteredSchemas_1;
                    }
                    swagger_1.SwaggerModule.setup('api-docs', app, document, {
                        customSiteTitle: 'Backend API - Documentación',
                        customfavIcon: '/logo.png',
                        customCss: "\n      .swagger-ui .info { margin: 20px 0; }\n      .swagger-ui .info .title { font-size: 36px; color: #333; }\n      .swagger-ui .info .description { font-size: 14px; line-height: 1.6; }\n      .swagger-ui .scheme-container { background: #fafafa; padding: 10px; border-radius: 4px; }\n      .custom-restaurant-topbar { margin-bottom: 0; }\n      .custom-cache-topbar { margin-bottom: 0; }\n      .swagger-ui .topbar { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }\n      .swagger-ui .topbar .download-url-wrapper { display: none; }\n      #restaurant-selector { font-family: inherit; }\n      #cache-control-button { font-family: inherit; }\n      .swagger-ui .auth-wrapper .authorize { border-color: #667eea; color: #667eea; }\n      .swagger-ui .auth-wrapper .authorize.locked { border-color: #764ba2; color: #764ba2; }\n      .swagger-ui .opblock.opblock-post { border-color: #49cc90; background: rgba(73, 204, 144, 0.1); }\n      .swagger-ui .opblock.opblock-get { border-color: #61affe; background: rgba(97, 175, 254, 0.1); }\n      .swagger-ui .opblock.opblock-put { border-color: #fca130; background: rgba(252, 161, 48, 0.1); }\n      .swagger-ui .opblock.opblock-delete { border-color: #f93e3e; background: rgba(249, 62, 62, 0.1); }\n    ",
                        customJs: [
                            '/swagger-tenant-addon.js',
                            '/swagger-cache-control.js'
                        ],
                        swaggerOptions: {
                            persistAuthorization: true,
                            displayRequestDuration: true,
                            filter: true,
                            showExtensions: true,
                            showCommonExtensions: true,
                            tagsSorter: 'alpha',
                            operationsSorter: 'method',
                            docExpansion: 'list',
                            defaultModelsExpandDepth: 1,
                            defaultModelExpandDepth: 3,
                            tryItOutEnabled: true,
                        },
                    });
                    tryPort = function (startPort_1) {
                        var args_1 = [];
                        for (var _i = 1; _i < arguments.length; _i++) {
                            args_1[_i - 1] = arguments[_i];
                        }
                        return __awaiter(_this, __spreadArray([startPort_1], args_1, true), void 0, function (startPort, maxAttempts) {
                            var i, port, error_1;
                            if (maxAttempts === void 0) { maxAttempts = 10; }
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        i = 0;
                                        _a.label = 1;
                                    case 1:
                                        if (!(i < maxAttempts)) return [3 /*break*/, 6];
                                        port = startPort + i;
                                        _a.label = 2;
                                    case 2:
                                        _a.trys.push([2, 4, , 5]);
                                        return [4 /*yield*/, app.listen(port)];
                                    case 3:
                                        _a.sent();
                                        console.log("\uD83C\uDF89 [SUCCESS] Aplicaci\u00F3n iniciada exitosamente en puerto: ".concat(port));
                                        return [2 /*return*/, port];
                                    case 4:
                                        error_1 = _a.sent();
                                        if (error_1.code === 'EADDRINUSE') {
                                            console.log("\u26A0\uFE0F [WARNING] Puerto ".concat(port, " ocupado, intentando puerto ").concat(port + 1, "..."));
                                            return [3 /*break*/, 5];
                                        }
                                        // Si el error no es por puerto ocupado, lanzar el error
                                        throw error_1;
                                    case 5:
                                        i++;
                                        return [3 /*break*/, 1];
                                    case 6: throw new Error("\u274C [ERROR] No se pudo iniciar la aplicaci\u00F3n. Todos los puertos desde ".concat(startPort, " hasta ").concat(startPort + maxAttempts - 1, " est\u00E1n ocupados."));
                                }
                            });
                        });
                    };
                    initialPort = parseInt(process.env.PORT || '3000', 10);
                    return [4 /*yield*/, tryPort(initialPort)];
                case 2:
                    finalPort = _e.sent();
                    // Registro en consola una vez que el servidor está corriendo
                    _b = (_a = console).log;
                    _c = "\uD83C\uDF10 [INFO] Application is running on: ".concat;
                    return [4 /*yield*/, app.getUrl()];
                case 3:
                    // Registro en consola una vez que el servidor está corriendo
                    _b.apply(_a, [_c.apply("\uD83C\uDF10 [INFO] Application is running on: ", [_e.sent()])]);
                    console.log("\uD83D\uDD17 [INFO] Swagger documentation available at: http://localhost:".concat(finalPort, "/api-docs"));
                    console.log('🎯 [DATABASE] Verificando estado de ServiceCache.Database...');
                    console.log('🎯 [DATABASE] Estado:', database_mixin_1.Database.getStatus());
                    console.log('✅ [COMPLETE] All initialization procedures completed.');
                    return [2 /*return*/];
            }
        });
    });
}
bootstrap();
