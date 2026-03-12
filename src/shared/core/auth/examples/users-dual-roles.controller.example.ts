import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { DualRoleGuard } from '../guards/dual-role.guard';
import {
  RequireDualRoles,
  RequireAuthorizationRole,
  RequireLocalRole,
  SuperAdminOnly,
  GlobalAdminOnly,
  ManagersOnly,
  AIAProtected,
  RequireDualRolesAndProtectAIA,
} from '../decorators/dual-roles.decorator';
import {
  CurrentUser,
  CurrentUserId,
} from '../decorators/current-user.decorator';
import { AuthorizationRole, LocalRole } from '../constants/roles.enum';

@ApiTags('Users Management')
@ApiBearerAuth('Authorization')
@Controller('api/users')
@UseGuards(JwtAuthGuard, DualRoleGuard)
export class UsersExampleController {
  @Get()
  @ApiOperation({ summary: 'Listar usuarios - Solo administradores globales' })
  @GlobalAdminOnly()
  async getUsers(@CurrentUser() user: any) {
    return {
      message: 'Usuarios obtenidos exitosamente',
      data: {
        requiredRole: 'SUPER_ADMIN o ADMIN_AUTHORIZED_ORIGIN',
        currentUser: {
          id: user.userId,
          authRole: user.authorizationRoleName,
          localRole: user.localRoleName,
          isSuperAdmin: user.isSuperAdmin,
        },
      },
    };
  }

  @Get('profile')
  @ApiOperation({ summary: 'Ver mi perfil - Cualquier usuario autenticado' })
  async getMyProfile(@CurrentUser() user: any) {
    return {
      message: 'Perfil obtenido exitosamente',
      data: {
        user: {
          id: user.userId,
          name: user.fullName,
          email: user.email,
          authorizationRole: user.authorizationRoleName,
          localRole: user.localRoleName,
          isAIA: user.isAIAUser,
          branches: user.branches.length,
        },
      },
    };
  }

  @Post()
  @ApiOperation({ summary: 'Crear usuario - Solo SUPER_ADMIN' })
  @SuperAdminOnly()
  async createUser(@Body() userData: any, @CurrentUser() user: any) {
    return {
      message: 'Usuario creado exitosamente',
      data: {
        note: 'Solo SUPER_ADMIN puede crear usuarios',
        createdBy: {
          id: user.userId,
          role: user.authorizationRoleName,
        },
        userData,
      },
    };
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar usuario - Protege usuarios AIA',
    description:
      'Los usuarios AIA solo pueden ser modificados por SUPER_ADMIN o ADMIN_AUTHORIZED_ORIGIN',
  })
  @AIAProtected()
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: any,
    @CurrentUser() user: any,
  ) {
    return {
      message: 'Usuario actualizado exitosamente',
      data: {
        targetUserId: id,
        note: 'Si el usuario objetivo es AIA, solo SUPER_ADMIN puede modificarlo',
        updatedBy: {
          id: user.userId,
          authRole: user.authorizationRoleName,
          canModifyAIA: user.isSuperAdmin || user.isGlobalAdmin,
        },
        updateData,
      },
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary:
      'Eliminar usuario - Requiere ADMIN de authorization Y Owner/Regional Manager local + Protege AIA',
  })
  @RequireDualRolesAndProtectAIA({
    authorizationRoles: [
      AuthorizationRole.ADMIN,
      AuthorizationRole.SUPER_ADMIN,
    ],
    localRoles: [LocalRole.OWNER, LocalRole.REGIONAL_MANAGER],
  })
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return {
      message: 'Usuario eliminado exitosamente',
      data: {
        targetUserId: id,
        note: 'Requiere ser ADMIN+ de authorization Y Owner/Regional Manager local. AIA protegido.',
        deletedBy: {
          id: user.userId,
          authRole: user.authorizationRoleName,
          localRole: user.localRoleName,
        },
      },
    };
  }

  @Put(':id/role')
  @ApiOperation({
    summary:
      'Cambiar rol de usuario - Solo administradores locales Owner/Regional Manager',
  })
  @RequireLocalRole(LocalRole.OWNER, LocalRole.REGIONAL_MANAGER)
  @AIAProtected()
  async changeUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() roleData: { newRoleId: number },
    @CurrentUser() user: any,
  ) {
    return {
      message: 'Rol de usuario actualizado exitosamente',
      data: {
        targetUserId: id,
        newRoleId: roleData.newRoleId,
        note: 'Solo Owner/Regional Manager pueden cambiar roles. AIA protegido.',
        changedBy: {
          id: user.userId,
          localRole: user.localRoleName,
        },
      },
    };
  }

  @Get('managers-only')
  @ApiOperation({ summary: 'Endpoint solo para managers locales' })
  @ManagersOnly()
  async getManagerData(@CurrentUser() user: any) {
    return {
      message: 'Datos de manager obtenidos',
      data: {
        note: 'Solo Owner y Regional Manager locales pueden acceder',
        manager: {
          id: user.userId,
          localRole: user.localRoleName,
          authRole: user.authorizationRoleName,
        },
      },
    };
  }

  @Get('supervisors-and-above')
  @ApiOperation({ summary: 'Solo roles de authorization SUPERVISOR+' })
  @RequireAuthorizationRole(
    AuthorizationRole.SUPERVISOR,
    AuthorizationRole.ADMIN,
    AuthorizationRole.ADMIN_AUTHORIZED_ORIGIN,
    AuthorizationRole.SUPER_ADMIN,
  )
  async getSupervisorData(@CurrentUser() user: any) {
    return {
      message: 'Datos de supervisor obtenidos',
      data: {
        note: 'Solo SUPERVISOR, ADMIN, ADMIN_AUTHORIZED_ORIGIN o SUPER_ADMIN',
        supervisor: {
          id: user.userId,
          authRole: user.authorizationRoleName,
          hasGlobalAccess: user.isGlobalAdmin,
        },
      },
    };
  }

  @Put(':id/sensitive-data')
  @ApiOperation({
    summary:
      'Modificar datos sensibles - Requiere ADMIN de authorization Y Manager local mínimo',
  })
  @RequireDualRoles({
    authorizationRoles: [
      AuthorizationRole.ADMIN,
      AuthorizationRole.ADMIN_AUTHORIZED_ORIGIN,
      AuthorizationRole.SUPER_ADMIN,
    ],
    localRoles: [
      LocalRole.MANAGER,
      LocalRole.REGIONAL_MANAGER,
      LocalRole.OWNER,
    ],
  })
  @AIAProtected()
  async updateSensitiveData(
    @Param('id', ParseIntPipe) id: number,
    @Body() sensitiveData: any,
    @CurrentUser() user: any,
  ) {
    return {
      message: 'Datos sensibles actualizados',
      data: {
        targetUserId: id,
        note: 'Requiere ADMIN+ de authorization Y Manager+ local. AIA protegido.',
        updatedBy: {
          id: user.userId,
          authRole: user.authorizationRoleName,
          localRole: user.localRoleName,
          meets: {
            authRequirement: [
              'ADMIN',
              'ADMIN_AUTHORIZED_ORIGIN',
              'SUPER_ADMIN',
            ].includes(user.authorizationRoleName),
            localRequirement: ['MANAGER', 'REGIONAL_MANAGER', 'OWNER'].includes(
              user.localRoleName,
            ),
          },
        },
      },
    };
  }
}
