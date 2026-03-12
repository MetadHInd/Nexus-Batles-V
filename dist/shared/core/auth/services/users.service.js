"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const base_paginated_service_1 = require("../../../common/services/base-paginated.service");
const redis_cache_service_1 = require("../../../cache/redis-cache.service");
const service_cache_1 = require("../../services/service-cache/service-cache");
const error_factory_1 = require("../../../errors/error.factory");
const error_codes_enum_1 = require("../../../errors/error-codes.enum");
let UsersService = class UsersService extends base_paginated_service_1.BasePaginatedService {
    constructor(cache) {
        super(cache);
    }
    async listUsers(dto) {
        const filters = {};
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
        if (dto.search) {
            filters.OR = [
                { userEmail: { contains: dto.search, mode: 'insensitive' } },
                { userName: { contains: dto.search, mode: 'insensitive' } },
                { userLastName: { contains: dto.search, mode: 'insensitive' } },
            ];
        }
        return this.executePaginatedQuery('users_list', dto, async (params) => {
            const [data, total] = await Promise.all([
                service_cache_1.ServiceCache.Database.Prisma.sysUser.findMany({
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
                service_cache_1.ServiceCache.Database.Prisma.sysUser.count({ where: filters }),
            ]);
            return { data: data.map((user) => this.mapUserRole(user)), total };
        }, true, { filters });
    }
    async getUserByUuid(uuid) {
        const cacheKey = `user_uuid_${uuid}`;
        return this.tryCacheOrExecute('user_by_uuid', { key: cacheKey }, true, async () => {
            const user = await service_cache_1.ServiceCache.Database.Prisma.sysUser.findFirst({
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
                error_factory_1.ErrorFactory.throw({
                    status: error_codes_enum_1.ErrorCodesEnum.NOT_FOUND,
                    message: 'User not found',
                });
            }
            return this.mapUserRole(user);
        });
    }
    async getUserById(id) {
        const cacheKey = `user_id_${id}`;
        return this.tryCacheOrExecute('user_by_id', { key: cacheKey }, true, async () => {
            const user = await service_cache_1.ServiceCache.Database.Prisma.sysUser.findUnique({
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
                error_factory_1.ErrorFactory.throw({
                    status: error_codes_enum_1.ErrorCodesEnum.NOT_FOUND,
                    message: 'User not found',
                });
            }
            return this.mapUserRole(user);
        });
    }
    async updateUser(id, dto) {
        await this.getUserById(id);
        if (dto.userEmail) {
            const existingUser = await service_cache_1.ServiceCache.Database.Prisma.sysUser.findFirst({
                where: {
                    userEmail: dto.userEmail,
                    idsysUser: { not: id },
                },
            });
            if (existingUser) {
                error_factory_1.ErrorFactory.throw({
                    status: error_codes_enum_1.ErrorCodesEnum.BAD_REQUEST,
                    message: 'Email already in use by another user',
                });
            }
        }
        const { role_idrole, ...rest } = dto;
        const updatedUser = await service_cache_1.ServiceCache.Database.Prisma.sysUser.update({
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
        await this.invalidateUserCaches(id, updatedUser.uuid);
        return this.mapUserRole(updatedUser);
    }
    async deleteUser(id) {
        const user = await this.getUserById(id);
        await service_cache_1.ServiceCache.Database.Prisma.sysUser.update({
            where: { idsysUser: id },
            data: { is_active: false },
        });
        await this.invalidateUserCaches(id, user.uuid);
        return { message: 'User deactivated successfully' };
    }
    async changePassword(id, dto) {
        const user = await service_cache_1.ServiceCache.Database.Prisma.sysUser.findUnique({
            where: { idsysUser: id },
        });
        if (!user) {
            error_factory_1.ErrorFactory.throw({
                status: error_codes_enum_1.ErrorCodesEnum.NOT_FOUND,
                message: 'User not found',
            });
        }
        const isValidPassword = await service_cache_1.ServiceCache.Authorization.PasswordService.validatePassword(dto.currentPassword, user.userPassword || '');
        if (!isValidPassword) {
            error_factory_1.ErrorFactory.throw({
                status: error_codes_enum_1.ErrorCodesEnum.UNAUTHORIZED,
                message: 'Current password is incorrect',
            });
        }
        const hashedPassword = await service_cache_1.ServiceCache.Authorization.PasswordService.hashPassword(dto.newPassword);
        await service_cache_1.ServiceCache.Database.Prisma.sysUser.update({
            where: { idsysUser: id },
            data: { userPassword: hashedPassword },
        });
        return { message: 'Password changed successfully' };
    }
    async invalidateUserCaches(userId, uuid) {
        const tasks = [
            this.cache.delete(`user_id_${userId}`),
            this.invalidatePaginationCaches('users_list'),
        ];
        if (uuid) {
            tasks.push(this.cache.delete(`user_uuid_${uuid}`));
        }
        await Promise.all(tasks);
    }
    mapUserRole(user) {
        if (!user) {
            return user;
        }
        const { role_sysUser_roleTorole, ...rest } = user;
        return {
            ...rest,
            role: role_sysUser_roleTorole ?? null,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_cache_service_1.RedisCacheService])
], UsersService);
//# sourceMappingURL=users.service.js.map