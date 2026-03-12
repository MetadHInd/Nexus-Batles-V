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
import { RoleService } from '../services/role.service';
import { CreateRoleDto, UpdateRoleDto, RolePaginationDto } from '../dtos/role.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RoleModel } from '../models/role.model';
import { JwtAuthGuard } from 'src/shared/core/auth/guards/jwt-auth.guard';

@ApiTags('23 - Roles')
@Controller('api/roles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({
    status: 201,
    description: 'Role created successfully',
    type: RoleModel,
  })
  @ApiResponse({
    status: 409,
    description: 'A role with that description already exists or you do not have sufficient hierarchy',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async create(@Body() createDto: CreateRoleDto): Promise<RoleModel> {
    return this.roleService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: 200,
    description: 'List of all roles',
    type: [RoleModel],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async findAll(): Promise<RoleModel[]> {
    return this.roleService.findAll();
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get paginated roles' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of roles',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async findAllPaginated(@Query() paginationDto: RolePaginationDto) {
    return this.roleService.findAllPaginated(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiParam({
    name: 'id',
    description: 'Role ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Role found',
    type: RoleModel,
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<RoleModel> {
    return this.roleService.findOne(id);
  }

  @Get('description/:description')
  @ApiOperation({ summary: 'Get a role by description' })
  @ApiParam({
    name: 'description',
    description: 'Role description',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Role found',
    type: RoleModel,
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async findByDescription(@Param('description') description: string): Promise<RoleModel | null> {
    return this.roleService.findByDescription(description);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a role' })
  @ApiParam({
    name: 'id',
    description: 'Role ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully',
    type: RoleModel,
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  @ApiResponse({
    status: 409,
    description: 'A role with that description already exists',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'You do not have sufficient hierarchy to update this role',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateRoleDto,
  ): Promise<RoleModel> {
    return this.roleService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a role' })
  @ApiParam({
    name: 'id',
    description: 'Role ID',
    type: Number,
  })
  @ApiResponse({
    status: 204,
    description: 'Role deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Cannot delete role because it has associated agent versions or permissions',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'You do not have sufficient hierarchy to delete this role',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.roleService.remove(id);
  }
}
