import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('20 - System')
@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      database: {
        connected: !!process.env.DATABASE_URL,
        dev_connected: !!process.env.DATABASE_URL_DEV,
      },
      services: {
        auth: !!process.env.AUTH_URL,
        smtp: !!process.env.SMTP_HOST,
        gemini: !!process.env.GEMINI_API_KEY,
        openai: !!process.env.OPENAI_API_KEY,
        stripe: !!process.env.STRIPE_SECRET_KEY,
      },
    };
  }

  @Get('ready')
  getReadiness() {
    // Check if all critical services are available
    const criticalServices = ['DATABASE_URL', 'JWT_SECRET', 'AUTH_URL'];

    const missingServices = criticalServices.filter(
      (service) => !process.env[service],
    );

    if (missingServices.length > 0) {
      return {
        status: 'NOT_READY',
        missing_services: missingServices,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      status: 'READY',
      timestamp: new Date().toISOString(),
      services_loaded: criticalServices.length,
    };
  }

  @Get('live')
  getLiveness() {
    return {
      status: 'ALIVE',
      timestamp: new Date().toISOString(),
      pid: process.pid,
      memory: process.memoryUsage(),
    };
  }
}
