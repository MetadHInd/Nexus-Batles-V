import * as dotenv from 'dotenv';

// 🔧 FORCE LOAD SPECIFIC ENV FILE
dotenv.config({ path: '.env', override: true });
console.log('🔧 [ENV DEBUG] Forced loading .env file');
console.log('🔧 [ENV DEBUG] OPENAI_API_KEY from loaded env:', process.env.OPENAI_API_KEY ? `${process.env.OPENAI_API_KEY.substring(0, 20)}...${process.env.OPENAI_API_KEY.substring(process.env.OPENAI_API_KEY.length - 4)}` : 'NOT_LOADED');
console.log('🔧 [ENV DEBUG] CLAUDE_API_KEY from loaded env:', process.env.CLAUDE_API_KEY ? `${process.env.CLAUDE_API_KEY.substring(0, 20)}...${process.env.CLAUDE_API_KEY.substring(process.env.CLAUDE_API_KEY.length - 4)}` : 'NOT_LOADED');
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './shared/interceptors/global-exception.filter';
import { AnswerInterceptor } from './shared/interceptors/answer.interceptor';
import { ResponseTimeMiddleware } from './shared/middleware/response-time.middleware';
import { SwaggerAuthMiddleware } from './shared/middleware/swagger-auth.middleware';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import * as express from 'express';
import { PrismaService } from './shared/database/prisma.service';
import { Database } from './shared/core/services/service-cache/mixins/database/database.mixin';

async function bootstrap() {
    
  const app = await NestFactory.create(AppModule);

  // 🔥 CRÍTICO: Establecer instancia global de Prisma para ServiceCache
  const prismaService = app.get(PrismaService);
  Database.setGlobalInstance(prismaService);
  console.log('🚀 [MAIN] Instancia global de Prisma establecida');
  
  // Almacenar también en contexto global para acceso directo
  (global as any).nestApp = app;

  // 🎯 CONFIGURACIÓN ESPECIAL PARA WEBHOOKS DE STRIPE
  // Capturar raw body ANTES de que Express parsee el JSON
  app.use(
    '/api/payments/stripe/webhook',
    express.raw({ type: 'application/json' }),
  );
  
  // ⭐ NUEVO: Webhook de onboarding Connect
  app.use(
    '/api/payments/stripe/connect/webhook/onboarding',
    express.raw({ type: 'application/json' }),
  );

  // Configuración de CORS según el entorno
  const allowedOrigins = [
    'https://app.galatealabs.ai',           // Production frontend
    'https://sandbox.app.galatealabs.ai',   // Sandbox frontend
    'https://dev.app.galatealabs.ai',       // Development frontend
    'https://api.galatealabs.ai',           // Production backend
    'https://sandbox.api.galatealabs.ai',   // Sandbox backend
    'https://dev.api.galatealabs.ai',       // Development backend
    'http://localhost:3000',           // Local development
    'http://localhost:3001',           // Local development alternate port
    'http://localhost:4000',
    'http://localhost:5174',           // Vite default port
    'http://localhost:5173',           // Vite default port
    "https://payments.galatealabs.ai",
    "https://dev.payments.galatealabs.ai",
    "https://sandbox.payments.galatealabs.ai",
    "https://online.pincho.com",
    "https://ordering.galatealabs.ai",         // OrderingOnline production
    "https://sandbox.ordering.galatealabs.ai", // OrderingOnline sandbox
    "https://dev.ordering.galatealabs.ai",     // OrderingOnline dev
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        process.env.NODE_ENV === 'development'
      ) {
        callback(null, true);
      } else {
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
console.log("Loading api key ",process.env.OPENAI_API_KEY);
  // Agregar cookie-parser middleware
  app.use(cookieParser());

  // Servir archivos estáticos desde public DESPUÉS de cookie-parser
  app.use(express.static(join(process.cwd(), 'public')));

  // Middleware de protección para Swagger antes de configurar Swagger
  const swaggerAuthMiddleware = new SwaggerAuthMiddleware();

  // Aplicar middleware a todas las rutas de Swagger
  app.use(async (req, res, next) => {
    if (req.path.startsWith('/api-docs')) {
      return await swaggerAuthMiddleware.use(req, res, next);
    }
    next();
  });

  // Configuración de pipes globales
  app.useGlobalPipes(
    new ValidationPipe({
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
        (error as any).isValidationError = true;
        (error as any).details = formatted;
        return error;
      },
    }),
  );

  app.use((req, res, next) => new ResponseTimeMiddleware().use(req, res, next));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new AnswerInterceptor());

  const config = new DocumentBuilder()
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
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingrese el JWT para autenticación (formato: Bearer {token})',
        name: 'Authorization',
      },
      'Authorization',
    )
    .addTag('00 - Auth', '🔐 Autenticación y autorización (Login, Register, Reset Password)')
    .addTag('01 - Cache Management', '🎛️ Sistema de cache unificado (Tenant/Org/Team)')
    .addTag('02 - Users Management', '👥 Gestión completa de usuarios (CRUD, roles, paginación)')
    .addTag('05 - Email', '📧 Servicio de email con templates')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    ignoreGlobalPrefix: false,
    deepScanRoutes: true,
    extraModels: [], // No incluir modelos extra automáticamente
  });

  // Ocultar solo los schemas de Prisma, mantener los DTOs
  if (document.components?.schemas) {
    const filteredSchemas: Record<string, any> = {};
    const schemas = document.components.schemas;

    // Mantener solo los schemas que NO son de Prisma
    Object.keys(schemas).forEach((schemaName) => {
      // Filtrar schemas de Prisma (que típicamente tienen nombres como "User", "Order", etc. sin "Dto")
      // y mantener los DTOs (que terminan en "Dto" o "Model")
      if (
        schemaName.includes('Dto') ||
        schemaName.includes('Model') ||
        schemaName.includes('Response') ||
        schemaName.includes('Request') ||
        schemaName.includes('Type')
      ) {
        filteredSchemas[schemaName] = schemas[schemaName];
      }
    });

    document.components.schemas = filteredSchemas;
  }

  SwaggerModule.setup('api-docs', app, document, {
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

  // 🚀 FUNCIÓN PARA INTENTAR MÚLTIPLES PUERTOS
  const tryPort = async (startPort: number, maxAttempts: number = 10): Promise<number> => {
    for (let i = 0; i < maxAttempts; i++) {
      const port = startPort + i;
      try {
        await app.listen(port);
        console.log(`🎉 [SUCCESS] Aplicación iniciada exitosamente en puerto: ${port}`);
        return port;
      } catch (error: any) {
        if (error.code === 'EADDRINUSE') {
          console.log(`⚠️ [WARNING] Puerto ${port} ocupado, intentando puerto ${port + 1}...`);
          continue;
        }
        // Si el error no es por puerto ocupado, lanzar el error
        throw error;
      }
    }
    throw new Error(`❌ [ERROR] No se pudo iniciar la aplicación. Todos los puertos desde ${startPort} hasta ${startPort + maxAttempts - 1} están ocupados.`);
  };

  // Intentar iniciar en el puerto especificado o 3000 por defecto
  const initialPort = parseInt(process.env.PORT || '3000', 10);
  const finalPort = await tryPort(initialPort);
  
  // Registro en consola una vez que el servidor está corriendo
  console.log(`🌐 [INFO] Application is running on: ${await app.getUrl()}`);
  console.log(`🔗 [INFO] Swagger documentation available at: http://localhost:${finalPort}/api-docs`);
  console.log('🎯 [DATABASE] Verificando estado de ServiceCache.Database...');
  console.log('🎯 [DATABASE] Estado:', Database.getStatus());
  console.log('✅ [COMPLETE] All initialization procedures completed.');
}
bootstrap();

