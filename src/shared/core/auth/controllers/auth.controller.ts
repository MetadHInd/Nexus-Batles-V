import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Headers,
  Param,
  Res,
  Sse,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiBody,
} from '@nestjs/swagger';
import { Observable, interval } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { RequestResetPasswordDto, ResetPasswordDto } from '../dtos/reset-password.dto';
import { ActivateAccountDto, ResendActivationDto } from '../dtos/activation.dto';
import { LoginResponseModel } from '../models/login-response.model';
import { InternalAuthService } from '../services/internal/auth.service';
import { ExternalAuthService } from '../services/external/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { TokenService } from '../services/shared/token.service';
import { RestaurantSelectionResponse, TokenWithRestaurants } from '../interfaces/restaurant-selection.interface';
import { IUserPublic } from '../interfaces/user.interface';
import { ErrorFactory } from 'src/shared/errors/error.factory';
import { ErrorCodesEnum } from 'src/shared/errors/error-codes.enum';
import { SSEConnectionManagerService } from '../../sse/services/sse-connection-manager.service';
import { UserPublicMapper } from '../mappers/user-public.mapper';
import { IUserWithRole } from '../interfaces/user.interface';


@ApiTags('00 - Auth')
@Controller('api/sysUser')
export class AuthController {
  constructor(
    private readonly internalAuth: InternalAuthService,
    private readonly externalAuth: ExternalAuthService,
    private readonly tokenService: TokenService,
    private readonly sseConnectionManager: SSEConnectionManagerService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @ApiResponse({ status: 400, description: 'Usuario ya existe o datos inválidos' })
  async register(@Body() dto: RegisterDto): Promise<any> {
    return this.internalAuth.register(dto);
  }

  @Post('activate')
  @ApiOperation({ summary: 'Activar cuenta con token de activación' })
  @ApiResponse({ status: 200, description: 'Cuenta activada exitosamente' })
  @ApiResponse({ status: 400, description: 'Token inválido o expirado' })
  async activateAccount(@Body() dto: ActivateAccountDto): Promise<any> {
    return this.internalAuth.activateAccount(dto);
  }

  @Post('resend-activation')
  @ApiOperation({ summary: 'Reenviar email de activación' })
  @ApiResponse({ status: 200, description: 'Email de activación enviado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async resendActivation(@Body() dto: ResendActivationDto): Promise<any> {
    return this.internalAuth.resendActivation(dto);
  }

  @Post('request-reset-password')
  @ApiOperation({ summary: 'Solicitar recuperación de contraseña' })
  @ApiResponse({ status: 200, description: 'Email de recuperación enviado si el usuario existe' })
  async requestResetPassword(@Body() dto: RequestResetPasswordDto): Promise<any> {
    return this.internalAuth.requestResetPassword(dto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Restablecer contraseña con token' })
  @ApiResponse({ status: 200, description: 'Contraseña restablecida exitosamente' })
  @ApiResponse({ status: 400, description: 'Token inválido o expirado' })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<any> {
    return this.internalAuth.resetPassword(dto);
  }

  @Get('user/:uuid')
  @ApiOperation({ 
    summary: 'Obtener usuario por UUID (clave pública)',
    description: 'Permite consultar información básica del usuario usando su UUID sin exponer el ID interno'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario encontrado',
    schema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', format: 'uuid' },
        userName: { type: 'string' },
        userLastName: { type: 'string' },
        userEmail: { type: 'string' },
        role: {
          type: 'object',
          properties: {
            idrole: { type: 'number' },
            description: { type: 'string' },
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
async getUserByUuid(@Param('uuid') uuid: string): Promise<IUserPublic> {
  const user = await this.internalAuth.getSysuserByUuid(uuid);

  if (!user) {
    ErrorFactory.throw({
      status: ErrorCodesEnum.NOT_FOUND,
      message: 'User not found',
    });
  }

  return UserPublicMapper.toPublic(user);
}

  @Post('login')
  @ApiOperation({ 
    summary: 'Login del sistema (modo interno o externo)',
    description: 'Retorna el token JWT y lo guarda en una cookie httpOnly'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login exitoso. Token guardado en cookie y retornado en el body'
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas o cuenta no activada' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseModel> {
    const result = process.env.AUTH_EXTERNAL === 'true'
      ? await this.externalAuth.login(dto)
      : await this.internalAuth.login(dto);

    // Guardar token en cookie httpOnly
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true, // No accesible desde JavaScript
      secure: isProduction, // Solo HTTPS en producción
      sameSite: 'lax' as const, // Protección CSRF
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
      path: '/',
    };

    response.cookie('auth_token', result.token, cookieOptions);
    response.cookie('jwt', result.token, cookieOptions); // Cookie alternativa

    return result;
  }

  @Post('login-swagger')
  @ApiOperation({ 
    summary: 'Login HTML para Swagger (retorna JSON)',
    description: 'Endpoint especial para login desde Swagger UI. Retorna token y lo guarda en cookies'
  })
  async loginSwagger(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseModel> {
    const result = process.env.AUTH_EXTERNAL === 'true'
      ? await this.externalAuth.login(dto)
      : await this.internalAuth.login(dto);

    // Guardar token en cookie httpOnly
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    };

    response.cookie('auth_token', result.token, cookieOptions);
    response.cookie('jwt', result.token, cookieOptions);

    return result;
  }

  @Get('debug-auth')
  @ApiOperation({ summary: 'Debug: Ver headers y cookies para autenticación' })
  async debugAuth(@Request() req): Promise<any> {
    console.log('\n🔍 [Debug] Headers:', req.headers);
    console.log('🔍 [Debug] Cookies:', req.cookies);

    return {
      headers: {
        authorization: req.headers.authorization || 'Not present',
        cookie: req.headers.cookie || 'Not present',
        userAgent: req.headers['user-agent'] || 'Not present',
      },
      cookies: req.cookies || 'No cookies found',
      cookieNames: req.cookies ? Object.keys(req.cookies) : [],
      timestamp: new Date().toISOString(),
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener perfil del usuario autenticado (requiere JWT)',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario autenticado',
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number' },
        username: { type: 'string' },
        email: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        role: {
          type: 'object',
          properties: {
            idrole: { type: 'number' },
            roleName: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token JWT inválido o faltante',
  })
  async getProfile(@Request() req): Promise<any> {
    return {
      message: 'JWT funcionando correctamente',
      user: req.user,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('test-login')
  @ApiOperation({ summary: 'Test login rápido para obtener token' })
  async testLogin(): Promise<any> {
    try {
      const loginDto = {
        email: 'manuel@galatealabs.ai',
        password: 'password123',
      };

      const result = await this.internalAuth.login(loginDto);

      return {
        message: 'Token generado exitosamente',
        token: result.token,
        howToUse: {
          step1: 'Copia el token de arriba',
          step2: 'Ve al endpoint /api/sysUser/test-jwt',
          step3: 'Haz clic en el botón "Authorize" (🔒) en la parte superior',
          step4: 'Pega: Bearer [token-copiado]',
          step5: 'Haz clic en "Authorize"',
          step6: 'Ahora ejecuta /api/sysUser/test-jwt',
        },
        swagger_access: {
          url: '/api-docs?token=' + result.token,
          instructions:
            'También puedes usar este enlace para acceder directamente a Swagger',
        },
      };
    } catch (error) {
      return {
        error: 'Error en login',
        details: error.message,
      };
    }
  }

  @Get('test-jwt')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Test endpoint para verificar que JWT funciona' })
  @ApiResponse({
    status: 200,
    description: 'JWT está funcionando correctamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token JWT inválido o faltante',
  })
  async testJwt(@Request() req): Promise<any> {
    return {
      message: '¡JWT está funcionando perfectamente!',
      authStrategy: 'jwt',
      user: req.user,
      serverTime: new Date().toISOString(),
    };
  }

  @Get('restaurants')
  @ApiOperation({ 
    summary: 'Obtener restaurantes disponibles del token JWT',
    description: 'Decodifica el token JWT y extrae los restaurantes disponibles para el usuario'
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token JWT',
    required: true,
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @ApiResponse({
    status: 200,
    description: 'Restaurantes obtenidos exitosamente',
    schema: {
      type: 'object',
      properties: {
        hasMultipleRestaurants: { type: 'boolean' },
        restaurants: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              uuid: { type: 'string' },
              name: { type: 'string' },
              address: { type: 'string' },
              database_connection: { type: 'string' },
              role_in_restaurant: { type: 'string' },
              is_owner: { type: 'boolean' },
              can_create_users: { type: 'boolean' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o no contiene información de restaurantes',
  })
  async getRestaurants(@Headers() headers: any): Promise<RestaurantSelectionResponse> {
    try {
      const authHeader = headers['authorization'];
      
      console.log('🔍 [getRestaurants] Auth header:', authHeader ? 'Present' : 'Missing');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Token not found');
      }

      const token = authHeader.replace('Bearer ', '');
      const decoded = await this.tokenService.validateToken(token) as TokenWithRestaurants;

      console.log('🔓 [getRestaurants] Token decoded:', !!decoded);
      console.log('🏪 [getRestaurants] Restaurants in token:', decoded.restaurants?.length || 0);

      if (!decoded.restaurants || !Array.isArray(decoded.restaurants)) {
        console.log('❌ [getRestaurants] No restaurants array found in token');
        throw new Error('No restaurants found in token');
      }

      const response = {
        hasMultipleRestaurants: decoded.restaurants.length > 1,
        restaurants: decoded.restaurants,
      };

      console.log('✅ [getRestaurants] Returning response:', response);
      return response;
    } catch (error) {
      console.error('❌ [getRestaurants] Error:', error.message);
      throw new Error('Invalid token or no restaurants available');
    }
  }

  @Post('select-restaurant')
  @ApiOperation({
    summary: 'Seleccionar un restaurante específico',
    description: 'Permite seleccionar un restaurante del token JWT decodificado'
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token JWT',
    required: true,
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @ApiBody({
    description: 'UUID del restaurante a seleccionar',
    schema: {
      type: 'object',
      properties: {
        restaurantUuid: {
          type: 'string',
          example: 'eb33e941-85c7-4fe8-8096-c4be1d97acdc',
          description: 'UUID del restaurante seleccionado'
        }
      },
      required: ['restaurantUuid']
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Restaurante seleccionado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        selectedRestaurant: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            uuid: { type: 'string' },
            name: { type: 'string' },
            address: { type: 'string' },
            database_connection: { type: 'string' },
            role_in_restaurant: { type: 'string' },
            is_owner: { type: 'boolean' },
            can_create_users: { type: 'boolean' },
          },
        },
        instructions: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            headerName: { type: 'string' },
            headerValue: { type: 'string' }
          }
        }
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Restaurante no encontrado o UUID inválido',
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido',
  })
  async selectRestaurant(
    @Headers() headers: any,
    @Body() body: { restaurantUuid: string }
  ): Promise<any> {
    try {
      const authHeader = headers['authorization'];
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Token not found');
      }

      const token = authHeader.replace('Bearer ', '');
      const decoded = await this.tokenService.validateToken(token) as TokenWithRestaurants;

      if (!decoded.restaurants || !Array.isArray(decoded.restaurants)) {
        throw new Error('No restaurants found in token');
      }

      const selectedRestaurant = decoded.restaurants.find(
        restaurant => restaurant.uuid === body.restaurantUuid
      );

      if (!selectedRestaurant) {
        throw new Error('Restaurant not found');
      }

      // Store the selection in session storage (this will be handled by frontend)
      return {
        success: true,
        selectedRestaurant,
        instructions: {
          message: 'Para usar este restaurante en todas las peticiones, agrega el header "restaurantSub" con el UUID del restaurante',
          headerName: 'restaurantSub',
          headerValue: selectedRestaurant.uuid
        }
      };
    } catch (error) {
      throw new Error('Invalid token or restaurant not available');
    }
  }

  @Get('my-tenants')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener tenants disponibles para el usuario actual' })
  @ApiResponse({ status: 200, description: 'Lista de tenants' })
  async getMyTenants(@Request() req): Promise<any> {
    const userId = req.user.id;

    const userTenants = await this.internalAuth['prisma'].user_tenants.findMany({
      where: {
        user_id: userId,
        is_active: true,
      },
      include: {
        tenants: {
          select: {
            tenant_sub: true,
            slug: true,
            name: true,
            is_active: true,
          },
        },
      },
      orderBy: {
        is_default: 'desc',
      },
    });

    const tenants = userTenants
      .filter(ut => ut.tenants.is_active)
      .map(ut => ({
        tenant_sub: ut.tenants.tenant_sub,
        slug: ut.tenants.slug,
        name: ut.tenants.name,
        is_default: ut.is_default,
      }));

    return { tenants };
  }

  @Post('switch-tenant')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar tenant activo del usuario' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        tenant_sub: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Tenant cambiado exitosamente' })
  @ApiResponse({ status: 404, description: 'Tenant no encontrado o no asignado al usuario' })
  async switchTenant(@Request() req, @Body() body: { tenant_sub: string }): Promise<any> {
    const userId = req.user.id;

    // Verificar que el usuario tiene acceso a este tenant
    const userTenant = await this.internalAuth['prisma'].user_tenants.findFirst({
      where: {
        user_id: userId,
        tenants: {
          tenant_sub: body.tenant_sub,
          is_active: true,
        },
        is_active: true,
      },
      include: {
        tenants: {
          select: {
            tenant_sub: true,
            slug: true,
            name: true,
          },
        },
      },
    });

    if (!userTenant) {
      ErrorFactory.throw({
        status: ErrorCodesEnum.NOT_FOUND,
        message: 'Tenant not found or not assigned to user',
      });
    }

    return {
      success: true,
      tenant: {
        tenant_sub: userTenant.tenants.tenant_sub,
        slug: userTenant.tenants.slug,
        name: userTenant.tenants.name,
      },
      instructions: {
        message: 'Para usar este tenant en todas las peticiones, agrega el header "x-tenant-sub" con el UUID del tenant',
        headerName: 'x-tenant-sub',
        headerValue: userTenant.tenants.tenant_sub,
      },
    };
  }
}

