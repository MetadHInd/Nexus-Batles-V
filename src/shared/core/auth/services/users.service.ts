import { Injectable } from '@nestjs/common';
import { BasePaginatedService } from 'src/shared/common/services/base-paginated.service';
import { RedisCacheService } from 'src/shared/cache/redis-cache.service';
import { ServiceCache } from 'src/shared/core/services/service-cache/service-cache';
import { ListUsersDto } from '../dtos/list-users.dto';
import { UpdateUserDto, ChangePasswordDto } from '../dtos/update-user.dto';
import { PaginatedResponse } from 'src/shared/common/dtos/pagination.dto';
import { ErrorFactory } from 'src/shared/errors/error.factory';
import { ErrorCodesEnum } from 'src/shared/errors/error-codes.enum';
import { IUser } from '../interfaces/user.interface';

@Injectable()
export class UsersService extends BasePaginatedService {
  constructor(cache: RedisCacheService) {
    super(cache);
  }

  /**
   * Listar usuarios con paginación y filtros
   */
  async listUsers(dto: ListUsersDto): Promise<PaginatedResponse<any>> {
    const filters: any = {};

    // Aplicar filtros
    if (dto.userEmail) {
      filters.userEmail = { contains: dto.userEmail, mode: 'insensitive' };
    }
    if (dto.userName) {
      filters.userName = { contains: dto.userName, mode: 'insensitive' };
    }
    if (dto.role_idrole !== undefined) {
      filters.role = dto.role_idrole;
    }
    if (dto.is_active !== undefined) {
      filters.is_active = dto.is_active;
    }

    // Búsqueda general
    if (dto.search) {
      filters.OR = [
        { userEmail: { contains: dto.search, mode: 'insensitive' } },
        { userName: { contains: dto.search, mode: 'insensitive' } },
        { userLastName: { contains: dto.search, mode: 'insensitive' } },
      ];
    }

    return this.executePaginatedQuery(
      'users_list',
      dto,
      async (params) => {
        const [data, total] = await Promise.all([
          ServiceCache.Database.Prisma.sysUser.findMany({
            where: filters,
            skip: params.skip,
            take: params.limit,
            orderBy: { [params.sortBy]: params.sortOrder },
            select: {
              idsysUser: true,
              uuid: true,
              userEmail: true,
              userName: true,
              userLastName: true,
              userPhone: true,
              is_active: true,
              created_at: true,
              role_sysUser_roleTorole: {
                select: {
                  idrole: true,
                  description: true,
                },
              },
            },
          }),
          ServiceCache.Database.Prisma.sysUser.count({ where: filters }),
        ]);

        return { data: data.map((user) => this.mapUserRole(user)), total };
      },
      true,
      { filters },
    );
  }

  /**
   * Obtener usuario por UUID
   */
  async getUserByUuid(uuid: string): Promise<any> {
    const cacheKey = `user_uuid_${uuid}`;
    
    return this.tryCacheOrExecute(
      'user_by_uuid',
      { key: cacheKey },
      true,
      async () => {
        const user = await ServiceCache.Database.Prisma.sysUser.findFirst({
          where: { uuid },
          select: {
            idsysUser: true,
            uuid: true,
            userEmail: true,
            userName: true,
            userLastName: true,
            userPhone: true,
            is_active: true,
            created_at: true,
            role_sysUser_roleTorole: {
              select: {
                idrole: true,
                description: true,
              },
            },
          },
        });

        if (!user) {
          ErrorFactory.throw({
            status: ErrorCodesEnum.NOT_FOUND,
            message: 'User not found',
          });
        }

        return this.mapUserRole(user);
      },
    );
  }

  /**
   * Obtener usuario por ID
   */
  async getUserById(id: number): Promise<any> {
    const cacheKey = `user_id_${id}`;
    
    return this.tryCacheOrExecute(
      'user_by_id',
      { key: cacheKey },
      true,
      async () => {
        const user = await ServiceCache.Database.Prisma.sysUser.findUnique({
          where: { idsysUser: id },
          select: {
            idsysUser: true,
            uuid: true,
            userEmail: true,
            userName: true,
            userLastName: true,
            userPhone: true,
            is_active: true,
            created_at: true,
            role_sysUser_roleTorole: {
              select: {
                idrole: true,
                description: true,
              },
            },
          },
        });

        if (!user) {
          ErrorFactory.throw({
            status: ErrorCodesEnum.NOT_FOUND,
            message: 'User not found',
          });
        }

        return this.mapUserRole(user);
      },
    );
  }

  /**
   * Actualizar usuario
   */
  async updateUser(id: number, dto: UpdateUserDto): Promise<any> {
    // Verificar que el usuario existe
    await this.getUserById(id);

    // Si se está cambiando el email, verificar que no exista otro usuario con ese email
    if (dto.userEmail) {
      const existingUser = await ServiceCache.Database.Prisma.sysUser.findFirst({
        where: {
          userEmail: dto.userEmail,
          idsysUser: { not: id },
        },
      });

      if (existingUser) {
        ErrorFactory.throw({
          status: ErrorCodesEnum.BAD_REQUEST,
          message: 'Email already in use by another user',
        });
      }
    }

    // Actualizar usuario
    const { role_idrole, ...rest } = dto;
    const updatedUser = await ServiceCache.Database.Prisma.sysUser.update({
      where: { idsysUser: id },
      data: {
        ...rest,
        ...(role_idrole !== undefined ? { role: role_idrole } : {}),
      },
      select: {
        idsysUser: true,
        uuid: true,
        userEmail: true,
        userName: true,
        userLastName: true,
        userPhone: true,
        is_active: true,
        role_sysUser_roleTorole: {
          select: {
            idrole: true,
            description: true,
          },
        },
      },
    });

    // Invalidar caches
    await this.invalidateUserCaches(id, updatedUser.uuid);

    return this.mapUserRole(updatedUser);
  }

  /**
   * Eliminar usuario (soft delete)
   */
  async deleteUser(id: number): Promise<{ message: string }> {
    // Verificar que el usuario existe
    const user = await this.getUserById(id);

    // Desactivar usuario en lugar de eliminarlo
    await ServiceCache.Database.Prisma.sysUser.update({
      where: { idsysUser: id },
      data: { is_active: false },
    });

    // Invalidar caches
    await this.invalidateUserCaches(id, user.uuid);

    return { message: 'User deactivated successfully' };
  }

  /**
   * Cambiar contraseña de usuario
   */
  async changePassword(id: number, dto: ChangePasswordDto): Promise<{ message: string }> {
    // Obtener usuario con contraseña
    const user = await ServiceCache.Database.Prisma.sysUser.findUnique({
      where: { idsysUser: id },
    }) as IUser;

    if (!user) {
      ErrorFactory.throw({
        status: ErrorCodesEnum.NOT_FOUND,
        message: 'User not found',
      });
    }

    // Verificar contraseña actual
    const isValidPassword = await ServiceCache.Authorization.PasswordService.validatePassword(
      dto.currentPassword,
      user.userPassword || '',
    );

    if (!isValidPassword) {
      ErrorFactory.throw({
        status: ErrorCodesEnum.UNAUTHORIZED,
        message: 'Current password is incorrect',
      });
    }

    // Hash de la nueva contraseña
    const hashedPassword = await ServiceCache.Authorization.PasswordService.hashPassword(
      dto.newPassword,
    );

    // Actualizar contraseña
    await ServiceCache.Database.Prisma.sysUser.update({
      where: { idsysUser: id },
      data: { userPassword: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  /**
   * Invalidar todas las caches relacionadas con un usuario
   */
  private async invalidateUserCaches(userId: number, uuid: string | null): Promise<void> {
    const tasks = [
      this.cache.delete(`user_id_${userId}`),
      this.invalidatePaginationCaches('users_list'),
    ];

    if (uuid) {
      tasks.push(this.cache.delete(`user_uuid_${uuid}`));
    }

    await Promise.all(tasks);
  }

  private mapUserRole<T extends { role_sysUser_roleTorole?: unknown }>(user: T): T & { role: unknown } {
    if (!user) {
      return user as T & { role: unknown };
    }

    const { role_sysUser_roleTorole, ...rest } = user as T & {
      role_sysUser_roleTorole?: unknown;
    };

    return {
      ...rest,
      role: role_sysUser_roleTorole ?? null,
    } as T & { role: unknown };
  }
}
