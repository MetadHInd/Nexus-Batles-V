import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('11 - System - Test')
@Controller('api/test')
export class TestController {
  @Get()
  getTest() {
    return { message: 'GET test works' };
  }

  @Put(':id')
  putTest(@Param('id') id: string, @Body() body: any) {
    return {
      message: 'PUT test works',
      id,
      body,
    };
  }
}
