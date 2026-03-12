"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config({ path: '.env', override: true });
console.log('🔧 [ENV DEBUG] Forced loading .env file');
console.log('🔧 [ENV DEBUG] OPENAI_API_KEY from loaded env:', process.env.OPENAI_API_KEY ? `${process.env.OPENAI_API_KEY.substring(0, 20)}...${process.env.OPENAI_API_KEY.substring(process.env.OPENAI_API_KEY.length - 4)}` : 'NOT_LOADED');
console.log('🔧 [ENV DEBUG] CLAUDE_API_KEY from loaded env:', process.env.CLAUDE_API_KEY ? `${process.env.CLAUDE_API_KEY.substring(0, 20)}...${process.env.CLAUDE_API_KEY.substring(process.env.CLAUDE_API_KEY.length - 4)}` : 'NOT_LOADED');
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const global_exception_filter_1 = require("./shared/interceptors/global-exception.filter");
const answer_interceptor_1 = require("./shared/interceptors/answer.interceptor");
const response_time_middleware_1 = require("./shared/middleware/response-time.middleware");
const swagger_auth_middleware_1 = require("./shared/middleware/swagger-auth.middleware");
const cookieParser = require("cookie-parser");
const path_1 = require("path");
const express = require("express");
const prisma_service_1 = require("./shared/database/prisma.service");
const database_mixin_1 = require("./shared/core/services/service-cache/mixins/database/database.mixin");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const prismaService = app.get(prisma_service_1.PrismaService);
    database_mixin_1.Database.setGlobalInstance(prismaService);
    console.log('🚀 [MAIN] Instancia global de Prisma establecida');
    global.nestApp = app;
    app.use('/api/payments/stripe/webhook', express.raw({ type: 'application/json' }));
    app.use('/api/payments/stripe/connect/webhook/onboarding', express.raw({ type: 'application/json' }));
    const allowedOrigins = [
        'https://app.galatealabs.ai',
        'https://sandbox.app.galatealabs.ai',
        'https://dev.app.galatealabs.ai',
        'https://api.galatealabs.ai',
        'https://sandbox.api.galatealabs.ai',
        'https://dev.api.galatealabs.ai',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:4000',
        'http://localhost:5174',
        'http://localhost:5173',
        "https://payments.galatealabs.ai",
        "https://dev.payments.galatealabs.ai",
        "https://sandbox.payments.galatealabs.ai",
        "https://online.pincho.com",
        "https://ordering.galatealabs.ai",
        "https://sandbox.ordering.galatealabs.ai",
        "https://dev.ordering.galatealabs.ai",
    ];
    app.enableCors({
        origin: (origin, callback) => {
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
    app.use(cookieParser());
    app.use(express.static((0, path_1.join)(process.cwd(), 'public')));
    const swaggerAuthMiddleware = new swagger_auth_middleware_1.SwaggerAuthMiddleware();
    app.use(async (req, res, next) => {
        if (req.path.startsWith('/api-docs')) {
            return await swaggerAuthMiddleware.use(req, res, next);
        }
        next();
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        skipMissingProperties: false,
        transformOptions: {
            enableImplicitConversion: false,
        },
        exceptionFactory: (validationErrors = []) => {
            const formatted = validationErrors.map((e) => ({
                field: e.property,
                errors: Object.values(e.constraints || {}),
            }));
            const error = new Error('Validation failed');
            error.isValidationError = true;
            error.details = formatted;
            return error;
        },
    }));
    app.use((req, res, next) => new response_time_middleware_1.ResponseTimeMiddleware().use(req, res, next));
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    app.useGlobalInterceptors(new answer_interceptor_1.AnswerInterceptor());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Backend API')
        .setDescription(`
## 🚀 API de backend y Administrativa

### 📋 Documentación Completa
Esta API proporciona endpoints para:
- 🔐 Autenticación y autorización con JWT
- 👥 Gestión de usuarios y roles
- 💾 Control de cache en tiempo real
- 📊 Y mucho más...

### 🔑 Autenticación
Para usar los endpoints protegidos:
1. Usa \`POST /api/sysUser/login\` para obtener tu token JWT
2. Haz clic en el botón **Authorize** 🔒 arriba
3. Ingresa: \`Bearer {tu-token}\`
4. ¡Listo! Ahora puedes usar todos los endpoints

### 🍪 Cookies
El login también guarda el JWT en cookies httpOnly para mayor seguridad.
    `)
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
    const document = swagger_1.SwaggerModule.createDocument(app, config, {
        operationIdFactory: (controllerKey, methodKey) => methodKey,
        ignoreGlobalPrefix: false,
        deepScanRoutes: true,
        extraModels: [],
    });
    if (document.components?.schemas) {
        const filteredSchemas = {};
        const schemas = document.components.schemas;
        Object.keys(schemas).forEach((schemaName) => {
            if (schemaName.includes('Dto') ||
                schemaName.includes('Model') ||
                schemaName.includes('Response') ||
                schemaName.includes('Request') ||
                schemaName.includes('Type')) {
                filteredSchemas[schemaName] = schemas[schemaName];
            }
        });
        document.components.schemas = filteredSchemas;
    }
    swagger_1.SwaggerModule.setup('api-docs', app, document, {
        customSiteTitle: 'Backend API - Documentación',
        customfavIcon: '/logo.png',
        customCss: `
      .swagger-ui .info { margin: 20px 0; }
      .swagger-ui .info .title { font-size: 36px; color: #333; }
      .swagger-ui .info .description { font-size: 14px; line-height: 1.6; }
      .swagger-ui .scheme-container { background: #fafafa; padding: 10px; border-radius: 4px; }
      .custom-restaurant-topbar { margin-bottom: 0; }
      .custom-cache-topbar { margin-bottom: 0; }
      .swagger-ui .topbar { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
      .swagger-ui .topbar .download-url-wrapper { display: none; }
      #restaurant-selector { font-family: inherit; }
      #cache-control-button { font-family: inherit; }
      .swagger-ui .auth-wrapper .authorize { border-color: #667eea; color: #667eea; }
      .swagger-ui .auth-wrapper .authorize.locked { border-color: #764ba2; color: #764ba2; }
      .swagger-ui .opblock.opblock-post { border-color: #49cc90; background: rgba(73, 204, 144, 0.1); }
      .swagger-ui .opblock.opblock-get { border-color: #61affe; background: rgba(97, 175, 254, 0.1); }
      .swagger-ui .opblock.opblock-put { border-color: #fca130; background: rgba(252, 161, 48, 0.1); }
      .swagger-ui .opblock.opblock-delete { border-color: #f93e3e; background: rgba(249, 62, 62, 0.1); }
    `,
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
    const tryPort = async (startPort, maxAttempts = 10) => {
        for (let i = 0; i < maxAttempts; i++) {
            const port = startPort + i;
            try {
                await app.listen(port);
                console.log(`🎉 [SUCCESS] Aplicación iniciada exitosamente en puerto: ${port}`);
                return port;
            }
            catch (error) {
                if (error.code === 'EADDRINUSE') {
                    console.log(`⚠️ [WARNING] Puerto ${port} ocupado, intentando puerto ${port + 1}...`);
                    continue;
                }
                throw error;
            }
        }
        throw new Error(`❌ [ERROR] No se pudo iniciar la aplicación. Todos los puertos desde ${startPort} hasta ${startPort + maxAttempts - 1} están ocupados.`);
    };
    const initialPort = parseInt(process.env.PORT || '3000', 10);
    const finalPort = await tryPort(initialPort);
    console.log(`🌐 [INFO] Application is running on: ${await app.getUrl()}`);
    console.log(`🔗 [INFO] Swagger documentation available at: http://localhost:${finalPort}/api-docs`);
    console.log('🎯 [DATABASE] Verificando estado de ServiceCache.Database...');
    console.log('🎯 [DATABASE] Estado:', database_mixin_1.Database.getStatus());
    console.log('✅ [COMPLETE] All initialization procedures completed.');
}
bootstrap();
//# sourceMappingURL=main.js.map