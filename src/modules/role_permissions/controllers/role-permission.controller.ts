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
import { RolePermissionService } from '../services/role-permission.service';
import {
  CreateRolePermissionDto,
  UpdateRolePermissionDto,
  RolePermissionPaginationDto,
  AssignPermissionsToRoleDto,
} from '../dtos/role-permission.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RolePermissionModel, RolePermissionDetailModel } from '../models/role-permission.model';
import { JwtAuthGuard } from 'src/shared/core/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/shared/core/auth/decorators/current-user.decorator';

@ApiTags('22 - Role Permissions')
@Controller('api/role-permissions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Post()
  @ApiOperation({ summary: 'Assign a permission to a role' })
  @ApiResponse({
    status: 201,
    description: 'Permission assigned successfully',
    type: RolePermissionModel,
  })
  @ApiResponse({
    status: 404,
    description: 'Role or permission not found',
  })
  @ApiResponse({
    status: 409,
    description: 'The role already has that permission assigned',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'You do not have sufficient hierarchy to modify this role',
  })
  async create(@Body() createDto: CreateRolePermissionDto): Promise<RolePermissionModel> {
    return this.rolePermissionService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all permission assignments to roles' })
  @ApiResponse({
    status: 200,
    description: 'List of all assignments',
    type: [RolePermissionDetailModel],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async findAll(): Promise<any[]> {
    return this.rolePermissionService.findAll();
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get paginated assignments' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of assignments',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async findAllPaginated(@Query() paginationDto: RolePermissionPaginationDto) {
    return this.rolePermissionService.findAllPaginated(paginationDto);
  }

  @Get('my-permissions')
  @ApiOperation({ 
    summary: 'Get authenticated user permissions',
    description: 'Returns all permissions assigned to the logged-in user\'s role'
  })
  @ApiResponse({
    status: 200,
    description: 'List of authenticated user permissions',
    type: [RolePermissionDetailModel],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async getMyPermissions(
    @CurrentUser() user: any,
  ): Promise<string[]> {
    // Extraer el ID del rol correctamente
    const roleId = user.role?.id || user.role?.idrole || user.idrole || user.role;
    return this.rolePermissionService.findByRoleId(roleId);
  }

  @Get('role/:roleId')
  @ApiOperation({ summary: 'Get all permissions for a role' })
  @ApiParam({
    name: 'roleId',
    description: 'Role ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'List of role permissions',
    type: [RolePermissionDetailModel],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async findByRoleId(
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Promise<string[]> {
    return this.rolePermissionService.findByRoleId(roleId);
  }

  @Get('permission/code/:code')
  @ApiOperation({ summary: 'Get all roles that have a permission' })
  @ApiParam({
    name: 'code',
    description: 'Permission code',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'List of roles with that permission',
    type: [RolePermissionDetailModel],
  })
  @ApiResponse({
    status: 404,
    description: 'Permission not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async findByPermissionCode(
    @Param('code') code: string,
  ): Promise<any[]> {
    return this.rolePermissionService.findByPermissionCode(code);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an assignment by ID' })
  @ApiParam({
    name: 'id',
    description: 'Assignment ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Assignment found',
    type: RolePermissionDetailModel,
  })
  @ApiResponse({
    status: 404,
    description: 'Assignment not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.rolePermissionService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an assignment' })
  @ApiParam({
    name: 'id',
    description: 'Assignment ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Assignment updated successfully',
    type: RolePermissionModel,
  })
  @ApiResponse({
    status: 404,
    description: 'Assignment, role, or permission not found',
  })
  @ApiResponse({
    status: 409,
    description: 'The role already has that permission assigned',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateRolePermissionDto,
  ): Promise<RolePermissionModel> {
    return this.rolePermissionService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an assignment' })
  @ApiParam({
    name: 'id',
    description: 'Assignment ID',
    type: Number,
  })
  @ApiResponse({
    status: 204,
    description: 'Assignment deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Assignment not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.rolePermissionService.remove(id);
  }

  @Post('role/:roleId/assign-permissions')
  @ApiOperation({
    summary: 'Assign multiple permissions to a role',
    description:
      'Removes all existing assignments for the role and creates new ones with the provided permissions',
  })
  @ApiParam({
    name: 'roleId',
    description: 'Role ID',
    type: Number,
  })
  @ApiResponse({
    status: 201,
    description: 'Permissions assigned successfully',
    type: [RolePermissionModel],
  })
  @ApiResponse({
    status: 404,
    description: 'Role or some permission not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'You do not have sufficient hierarchy to modify this role',
  })
  async assignPermissionsToRole(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Body() dto: AssignPermissionsToRoleDto,
  ): Promise<RolePermissionModel[]> {
    return this.rolePermissionService.assignPermissionsToRole(roleId, dto);
  }

  @Delete('role/:roleId/remove-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove all permissions from a role',
  })
  @ApiParam({
    name: 'roleId',
    description: 'Role ID',
    type: Number,
  })
  @ApiResponse({
    status: 204,
    description: 'All permissions removed successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'You do not have sufficient hierarchy to modify this role',
  })
  async removeAllPermissionsFromRole(
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Promise<void> {
    return this.rolePermissionService.removeAllPermissionsFromRole(roleId);
  }
}
