import { Injectable, Logger } from '@nestjs/common';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RoleModel } from '../models/role.model';
import { ServiceCache } from '../../services/service-cache/service-cache';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  /**
   * Crea un nuevo rol
   * @param createRoleDto Datos del rol a crear
   * @returns Rol creado
   */
  async create(createRoleDto: CreateRoleDto): Promise<RoleModel> {
    try {
      const role = await ServiceCache.Database.Prisma.role.create({
        data: createRoleDto,
      });

      return RoleModel.fromEntity(role);
    } catch (error) {
      this.logger.error(`Error al crear rol: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Obtiene todos los roles
   * @returns Lista de roles
   */
  async findAll(): Promise<RoleModel[]> {
    try {
      const roles = await ServiceCache.Database.Prisma.role.findMany({
        orderBy: { idrole: 'asc' },
      });

      return roles.map((role) => RoleModel.fromEntity(role));
    } catch (error) {
      this.logger.error(`Error al buscar roles: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Encuentra un rol por ID
   * @param id ID del rol
   * @returns Rol encontrado
   */
  async findOne(id: number): Promise<RoleModel> {
    try {
      const role = await ServiceCache.Database.Prisma.role.findUnique({
        where: { idrole: id },
      });

      if (!role) {
        throw new NotFoundException('Rol no encontrado');
      }

      return RoleModel.fromEntity(role);
    } catch (error) {
      this.logger.error(`Error al buscar rol: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Actualiza un rol
   * @param id ID del rol
   * @param updateRoleDto Datos a actualizar
   * @returns Rol actualizado
   */
  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<RoleModel> {
    try {
      // Verificar si el rol existe
      await this.findOne(id);

      // Actualizar rol
      const updatedRole = await ServiceCache.Database.Prisma.role.update({
        where: { idrole: id },
        data: updateRoleDto,
      });

      return RoleModel.fromEntity(updatedRole);
    } catch (error) {
      this.logger.error(
        `Error al actualizar rol: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Elimina un rol
   * @param id ID del rol
   */
  async remove(id: number): Promise<void> {
    try {
      // Verificar si el rol existe
      await this.findOne(id);

      // Eliminar rol
      await ServiceCache.Database.Prisma.role.delete({
        where: { idrole: id },
      });
    } catch (error) {
      this.logger.error(`Error al eliminar rol: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Encuentra un rol por descripción
   * @param description Descripción del rol
   * @returns Rol encontrado
   */
  async findByDescription(description: string): Promise<RoleModel> {
    try {
      const role = await ServiceCache.Database.Prisma.role.findFirst({
        where: { description },
      });

      if (!role) {
        throw new NotFoundException('Rol no encontrado');
      }

      return RoleModel.fromEntity(role);
    } catch (error) {
      this.logger.error(
        `Error al buscar rol por descripción: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
