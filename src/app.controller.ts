import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@Controller()
@ApiTags('System')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRoot(@Res() res: Response): void {
    const filePath = join(process.cwd(), 'public', 'login.html');
    console.log('🔍 Looking for file at:', filePath);
    console.log('🔍 File exists:', existsSync(filePath));
    console.log('🔍 Current working directory:', process.cwd());
    
    if (existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ 
        error: 'login.html not found',
        cwd: process.cwd(),
        expectedPath: filePath 
      });
    }
  }

  @Get('login.html')
  getLogin(@Res() res: Response): void {
    // Servir login.html también en /login.html
    const filePath = join(process.cwd(), 'public', 'login.html');
    if (existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ 
        error: 'login.html not found',
        cwd: process.cwd(),
        expectedPath: filePath 
      });
    }
  }

  @Get('health')
  @ApiOperation({
    summary: 'Health Check',
    description: 'Check if the application is running correctly',
  })
  @ApiResponse({
    status: 200,
    description: 'Application is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2023-12-01T10:00:00.000Z' },
        uptime: { type: 'number', example: 123.456 },
      },
    },
  })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}