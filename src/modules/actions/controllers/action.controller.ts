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
import { ActionService } from '../services/action.service';
import { CreateActionDto, UpdateActionDto, BulkDeleteActionDto } from '../dtos/action.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ActionModel } from '../models/action.model';
import { JwtAuthGuard } from '../../../shared/core/auth/guards/jwt-auth.guard';

@ApiTags('23 - Actions')
@Controller('api/actions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva acción' })
  @ApiResponse({
    status: 201,
    description: 'Acción creada exitosamente',
    type: ActionModel,
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una acción con ese nombre',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
  })
  async create(@Body() createDto: CreateActionDto): Promise<ActionModel> {
    return this.actionService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las acciones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todas las acciones',
    type: [ActionModel],
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
  })
  async findAll(): Promise<ActionModel[]> {
    return this.actionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una acción por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la acción',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Acción encontrada',
    type: ActionModel,
  })
  @ApiResponse({
    status: 404,
    description: 'Acción no encontrada',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ActionModel> {
    return this.actionService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una acción' })
  @ApiParam({
    name: 'id',
    description: 'ID de la acción',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Acción actualizada exitosamente',
    type: ActionModel,
  })
  @ApiResponse({
    status: 404,
    description: 'Acción no encontrada',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una acción con ese nombre',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateActionDto,
  ): Promise<ActionModel> {
    return this.actionService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una acción' })
  @ApiParam({
    name: 'id',
    description: 'ID de la acción',
    type: Number,
  })
  @ApiResponse({
    status: 204,
    description: 'Acción eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Acción no encontrada',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
  })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.actionService.delete(id);
  }

  @Post('bulk-delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar múltiples acciones' })
  @ApiResponse({
    status: 200,
    description: 'Acciones eliminadas exitosamente',
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
  async bulkDelete(@Body() bulkDeleteDto: BulkDeleteActionDto) {
    return this.actionService.bulkDelete(bulkDeleteDto);
  }
}
