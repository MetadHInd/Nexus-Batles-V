import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ModuleService } from '../services/module.service';
import { CreateModuleDto, UpdateModuleDto, BulkDeleteModuleDto } from '../dtos/module.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ModuleModel } from '../models/module.model';
import { JwtAuthGuard } from 'src/shared/core/auth/guards/jwt-auth.guard';

@ApiTags('24 - Modules')
@Controller('api/modules')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo módulo' })
  @ApiResponse({
    status: 201,
    description: 'Módulo creado exitosamente',
    type: ModuleModel,
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un módulo con ese nombre',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
  })
  async create(@Body() createDto: CreateModuleDto): Promise<ModuleModel> {
    return this.moduleService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los módulos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos los módulos',
    type: [ModuleModel],
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
  })
  async findAll(): Promise<ModuleModel[]> {
    return this.moduleService.findAll();
  }

  @Get('uuid/:uuid')
  @ApiOperation({ summary: 'Obtener un módulo por UUID' })
  @ApiParam({
    name: 'uuid',
    description: 'UUID del módulo',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Módulo encontrado',
    type: ModuleModel,
  })
  @ApiResponse({
    status: 404,
    description: 'Módulo no encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
  })
  async findByUuid(@Param('uuid') uuid: string): Promise<ModuleModel> {
    return this.moduleService.findByUuid(uuid);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un módulo por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del módulo',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Módulo encontrado',
    type: ModuleModel,
  })
  @ApiResponse({
    status: 404,
    description: 'Módulo no encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ModuleModel> {
    return this.moduleService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un módulo' })
  @ApiParam({
    name: 'id',
    description: 'ID del módulo',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Módulo actualizado exitosamente',
    type: ModuleModel,
  })
  @ApiResponse({
    status: 404,
    description: 'Módulo no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un módulo con ese nombre',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateModuleDto,
  ): Promise<ModuleModel> {
    return this.moduleService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un módulo' })
  @ApiParam({
    name: 'id',
    description: 'ID del módulo',
    type: Number,
  })
  @ApiResponse({
    status: 204,
    description: 'Módulo eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Módulo no encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
  })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.moduleService.delete(id);
  }

  @Post('bulk-delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar múltiples módulos' })
  @ApiResponse({
    status: 200,
    description: 'Módulos eliminados exitosamente',
    schema: {
      type: 'object',
      properties: {
        deleted: { type: 'number', example: 3 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
  })
  async bulkDelete(@Body() bulkDeleteDto: BulkDeleteModuleDto) {
    return this.moduleService.bulkDelete(bulkDeleteDto);
  }
}
