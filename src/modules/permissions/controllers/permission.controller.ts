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
import { PermissionService } from '../services/permission.service';
import { CreatePermissionDto, UpdatePermissionDto, PermissionPaginationDto } from '../dtos/permission.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PermissionModel } from '../models/permission.model';
import { JwtAuthGuard } from 'src/shared/core/auth/guards/jwt-auth.guard';

@ApiTags('22 - Permissions')
@Controller('api/permissions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo permiso' })
  @ApiResponse({
    status: 201,
    description: 'Permiso creado exitosamente',
    type: PermissionModel,
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un permiso con ese código',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
  })
  async create(@Body() createDto: CreatePermissionDto): Promise<PermissionModel> {
    return this.permissionService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los permisos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos los permisos',
    type: [PermissionModel],
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
  })
  async findAll(): Promise<PermissionModel[]> {
    return this.permissionService.findAll();
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Obtener permisos paginados' })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de permisos',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
  })
  async findAllPaginated(@Query() paginationDto: PermissionPaginationDto) {
    return this.permissionService.findAllPaginated(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un permiso por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del permiso',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Permiso encontrado',
    type: PermissionModel,
  })
  @ApiResponse({
    status: 404,
    description: 'Permiso no encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PermissionModel> {
    return this.permissionService.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Obtener un permiso por código' })
  @ApiParam({
    name: 'code',
    description: 'Código del permiso',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Permiso encontrado',
    type: PermissionModel,
  })
  @ApiResponse({
    status: 404,
    description: 'Permiso no encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
  })
  async findByCode(@Param('code') code: string): Promise<PermissionModel | null> {
    return this.permissionService.findByCode(code);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un permiso' })
  @ApiParam({
    name: 'id',
    description: 'ID del permiso',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Permiso actualizado exitosamente',
    type: PermissionModel,
  })
  @ApiResponse({
    status: 404,
    description: 'Permiso no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un permiso con ese código',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePermissionDto,
  ): Promise<PermissionModel> {
    return this.permissionService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un permiso' })
  @ApiParam({
    name: 'id',
    description: 'ID del permiso',
    type: Number,
  })
  @ApiResponse({
    status: 204,
    description: 'Permiso eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Permiso no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'No se puede eliminar el permiso porque tiene roles asociados',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.permissionService.remove(id);
  }
}
