import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { MessagingStrategyManager } from '../messaging-strategy-manager.service';
import { SmsMessage } from '../../../core/messaging/sms/interfaces/sms-message.interface';
import { WhatsAppMessage } from '../../../core/messaging/whatsapp/interfaces/whatsapp-message.interface';

@ApiTags('04 - Messaging Strategy')
@Controller('messaging-strategy')
@ApiBearerAuth()
export class MessagingStrategyController {
  constructor(
    private readonly strategyManager: MessagingStrategyManager,
  ) {}

  @Get('strategies')
  @ApiOperation({ 
    summary: 'Listar estrategias disponibles',
    description: 'Retorna todas las estrategias de mensajería configuradas'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de estrategias obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        strategies: {
          type: 'array',
          items: { type: 'string' },
          example: ['twilio', 'aws-sns', 'custom']
        }
      }
    }
  })
  listStrategies() {
    return {
      strategies: this.strategyManager.listStrategies(),
    };
  }

  @Get('service/:serviceId/config')
  @ApiOperation({ 
    summary: 'Obtener configuración de servicio',
    description: 'Retorna la configuración del servicio de mensajería especificado'
  })
  @ApiParam({ name: 'serviceId', description: 'ID del servicio', example: 'default' })
  @ApiResponse({ status: 200, description: 'Configuración obtenida exitosamente' })
  @ApiResponse({ status: 404, description: 'Servicio no encontrado' })
  async getServiceConfig(@Param('serviceId') serviceId: string) {
    const config = await this.strategyManager.getServiceConfig(serviceId);
    
    return {
      success: !!config,
      config,
    };
  }

  @Get('service/:serviceId/phone')
  @ApiOperation({ 
    summary: 'Obtener número de teléfono de servicio',
    description: 'Retorna el número de teléfono asociado al servicio'
  })
  @ApiParam({ name: 'serviceId', description: 'ID del servicio', example: 'default' })
  @ApiResponse({ status: 200, description: 'Número de teléfono obtenido exitosamente' })
  async getPhoneNumber(@Param('serviceId') serviceId: string) {
    const phoneNumber = await this.strategyManager.getPhoneNumber(serviceId);
    
    return {
      success: !!phoneNumber,
      phoneNumber,
    };
  }

  @Post('sms/send')
  @ApiOperation({ 
    summary: 'Enviar SMS usando estrategia',
    description: 'Envía un mensaje SMS utilizando la estrategia configurada'
  })
  @ApiResponse({ status: 200, description: 'SMS enviado exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al enviar SMS' })
  async sendSms(
    @Body() body: { message: SmsMessage; serviceId?: string },
  ) {
    const result = await this.strategyManager.sendSms(
      body.message,
      body.serviceId || 'default',
    );
    
    return result;
  }

  @Post('whatsapp/send')
  @ApiOperation({ 
    summary: 'Enviar WhatsApp usando estrategia',
    description: 'Envía un mensaje de WhatsApp utilizando la estrategia configurada'
  })
  @ApiResponse({ status: 200, description: 'WhatsApp enviado exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al enviar WhatsApp' })
  async sendWhatsApp(
    @Body() body: { message: WhatsAppMessage; serviceId?: string },
  ) {
    const result = await this.strategyManager.sendWhatsApp(
      body.message,
      body.serviceId || 'default',
    );
    
    return result;
  }

  @Get('health')
  @ApiOperation({ 
    summary: 'Health check del sistema de estrategias',
    description: 'Verifica el estado del sistema de estrategias de mensajería'
  })
  @ApiResponse({ status: 200, description: 'Sistema operativo' })
  health() {
    return {
      status: 'ok',
      strategies: this.strategyManager.listStrategies(),
      timestamp: new Date().toISOString(),
    };
  }
}
