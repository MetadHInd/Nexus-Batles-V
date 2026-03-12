// gmail-automation.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpException,
  Logger
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { GmailAutomationService, EmailProcessorConfig, EmailFilter, EmailAction } from './gmail-automation.service';

// DTOs para la API
export class RegisterUserDto {
  userId: string;
  accessToken: string;
  refreshToken: string;
  filters?: EmailFilter[];
  actions?: EmailAction[];
}

export class UpdateConfigDto {
  filters?: EmailFilter[];
  actions?: EmailAction[];
}

export class CreateFilterDto {
  name: string;
  query: string;
  enabled: boolean = true;
}

export class CreateActionDto {
  name: string;
  type: 'webhook' | 'function' | 'database' | 'notification' | 'mark_read';
  config: any;
  enabled: boolean = true;
}

@ApiTags('15 - Gmail Automation')
@Controller('gmail/automation')
export class GmailAutomationController {
  private readonly logger = new Logger(GmailAutomationController.name);

  constructor(private readonly automationService: GmailAutomationService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar usuario para monitoreo automático de correos' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  async registerUser(@Body() registerDto: RegisterUserDto): Promise<{ success: boolean; message: string }> {
    try {
      await this.automationService.registerUser({
        userId: registerDto.userId,
        accessToken: registerDto.accessToken,
        refreshToken: registerDto.refreshToken,
        filters: registerDto.filters || [],
        actions: registerDto.actions || []
      });

      return {
        success: true,
        message: `Usuario ${registerDto.userId} registrado para monitoreo automático`
      };
    } catch (error) {
      this.logger.error(`Error registrando usuario ${registerDto.userId}:`, error);
      throw new HttpException(
        error.message || 'Error registrando usuario',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Delete('users/:userId')
  @ApiOperation({ summary: 'Desregistrar usuario del monitoreo automático' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario desregistrado exitosamente' })
  async unregisterUser(@Param('userId') userId: string): Promise<{ success: boolean; message: string }> {
    try {
      await this.automationService.unregisterUser(userId);
      return {
        success: true,
        message: `Usuario ${userId} desregistrado del monitoreo`
      };
    } catch (error) {
      this.logger.error(`Error desregistrando usuario ${userId}:`, error);
      throw new HttpException(
        error.message || 'Error desregistrando usuario',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('users/:userId/test')
  @ApiOperation({ summary: 'Probar configuración de usuario procesando correos manualmente' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Prueba ejecutada exitosamente' })
  async testUserConfig(@Param('userId') userId: string): Promise<{ success: boolean; message: string; results?: any }> {
    try {
      // Esto forzará el procesamiento inmediato para el usuario
      await this.automationService.processUserEmailsManually(userId);
      
      return {
        success: true,
        message: `Configuración probada para usuario ${userId}`,
        results: {
          message: 'Procesamiento manual completado. Revisa los logs para ver los resultados.'
        }
      };
    } catch (error) {
      this.logger.error(`Error probando configuración para usuario ${userId}:`, error);
      throw new HttpException(
        error.message || 'Error probando configuración',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('force-check')
  @ApiOperation({ summary: 'Forzar verificación manual de todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Verificación forzada exitosamente' })
  async forceCheck(): Promise<{ success: boolean; message: string }> {
    try {
      await this.automationService.forceCheck();
      return {
        success: true,
        message: 'Verificación manual ejecutada para todos los usuarios activos'
      };
    } catch (error) {
      this.logger.error('Error en verificación forzada:', error);
      throw new HttpException(
        error.message || 'Error en verificación forzada',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get('status')
  @ApiOperation({ summary: 'Obtener estado del servicio de automatización' })
  @ApiResponse({ status: 200, description: 'Estado del servicio obtenido exitosamente' })
  async getServiceStatus(): Promise<any> {
    return {
      status: 'active',
      message: 'Servicio de automatización Gmail activo',
      lastCheck: new Date(),
      intervalMs: 30000,
      info: 'El servicio verifica correos nuevos cada 30 segundos automáticamente'
    };
  }

  @Post('examples/setup-simple-logging')
  @ApiOperation({ summary: 'Configurar automatización simple que solo registra correos nuevos' })
  @ApiResponse({ status: 201, description: 'Automatización simple configurada' })
  async setupSimpleLogging(@Body() body: { userId: string; accessToken: string; refreshToken: string }): Promise<any> {
    try {
      const simpleConfig: EmailProcessorConfig = {
        userId: body.userId,
        accessToken: body.accessToken,
        refreshToken: body.refreshToken,
        // Sin filtros específicos - procesará todos los correos nuevos
        filters: [],
        // Sin acciones específicas - usará la acción por defecto (logging)
        actions: []
      };

      await this.automationService.registerUser(simpleConfig);

      return {
        success: true,
        message: 'Automatización simple configurada. Todos los correos nuevos se registrarán en los logs.',
        config: simpleConfig
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error configurando automatización simple',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('examples/setup-support-automation')
  @ApiOperation({ summary: 'Configurar automatización de ejemplo para correos de soporte' })
  @ApiResponse({ status: 201, description: 'Automatización de soporte configurada' })
  async setupSupportAutomation(@Body() body: { userId: string; accessToken: string; refreshToken: string }): Promise<any> {
    try {
      const supportConfig: EmailProcessorConfig = {
        userId: body.userId,
        accessToken: body.accessToken,
        refreshToken: body.refreshToken,
        filters: [
          {
            name: 'Correos de soporte',
            query: 'to:support@galatealabs.ai OR subject:(help OR support OR problema OR issue)',
            enabled: true
          }
        ],
        actions: [
          {
            name: 'Crear ticket de soporte',
            type: 'function',
            config: { functionName: 'processSupport' },
            enabled: true
          },
          {
            name: 'Notificar equipo',
            type: 'notification',
            config: { type: 'slack', channel: '#support' },
            enabled: true
          }
        ]
      };

      await this.automationService.registerUser(supportConfig);

      return {
        success: true,
        message: 'Automatización de soporte configurada exitosamente',
        config: supportConfig
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error configurando automatización de soporte',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
