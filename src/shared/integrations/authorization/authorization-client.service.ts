import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosInstance, AxiosError } from 'axios';

/**
 * DTO para crear usuario en Authorization desde Core
 */
export interface CreateUserInAuthorizationDto {
  uuid: string;
  email: string;
  name: string;
  lastname: string;
  phone?: string | null;
  country_name?: string | null;
  tenantId: string;
  role_in_tenant?: string | null;
}

/**
 * Respuesta de verificación de existencia
 */
export interface ExistsResponse {
  exists: boolean;
  email?: string;
  uuid?: string;
}

/**
 * Respuesta del usuario creado
 */
export interface AuthorizationUserResponse {
  idsysuser: number;
  uuid: string;
  email: string;
  name: string;
  lastname: string;
  phone?: string;
  country_name?: string;
  role: number;
  createat: Date;
}

/**
 * Cliente HTTP para comunicarse con el servicio de Authorization
 * Se usa para crear usuarios y verificar existencia
 */
@Injectable()
export class AuthorizationClientService {
  private readonly logger = new Logger(AuthorizationClientService.name);
  private readonly client: AxiosInstance;
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.AUTH_URL || 'http://localhost:5000';
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.logger.log(`Authorization Client initialized with URL: ${this.baseUrl}`);
  }

  /**
   * Crear usuario en Authorization desde Core
   * @param data Datos del usuario
   * @param authToken Token JWT del usuario que está creando
   * @returns Usuario creado
   */
  async createUser(
    data: CreateUserInAuthorizationDto,
    authToken: string,
  ): Promise<AuthorizationUserResponse> {
    try {
      this.logger.log(`Creating user in Authorization: ${data.email}`);

      const response = await this.client.post<AuthorizationUserResponse>(
        '/users/create-from-core',
        data,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      this.logger.log(`User created in Authorization: ${response.data.uuid}`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'createUser');
    }
  }

  /**
   * Verificar si un email existe en Authorization
   * @param email Email a verificar
   * @param authToken Token JWT
   * @returns true si existe, false si no
   */
  async existsByEmail(email: string, authToken: string): Promise<boolean> {
    try {
      this.logger.log(`Checking if email exists in Authorization: ${email}`);
      const response = await this.client.get<ExistsResponse>(
        `/users/exists/email/${encodeURIComponent(email)}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      this.logger.log(`existsByEmail response: ${JSON.stringify(response.data)}`);
      return response.data?.exists === true;
    } catch (error) {
      // Si es 404, el endpoint no existe o el usuario no existe
      if (error.response?.status === 404) {
        this.logger.log(`existsByEmail: 404 response, returning false`);
        return false;
      }
      this.logger.error(`existsByEmail error: ${error.message}`);
      // En caso de error, asumimos que no existe para permitir la creación
      return false;
    }
  }

  /**
   * Verificar si un UUID existe en Authorization
   * @param uuid UUID a verificar
   * @param authToken Token JWT
   * @returns true si existe, false si no
   */
  async existsByUuid(uuid: string, authToken: string): Promise<boolean> {
    try {
      const response = await this.client.get<ExistsResponse>(
        `/users/exists/uuid/${uuid}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      return response.data.exists;
    } catch (error) {
      // Si es 404, el endpoint no existe, asumimos que no existe el usuario
      if (error.response?.status === 404) {
        return false;
      }
      this.handleError(error, 'existsByUuid');
    }
  }

  /**
   * Asignar un tenant a un usuario existente en Authorization
   * @param email Email del usuario
   * @param tenantId UUID del tenant
   * @param roleInTenant Rol en el tenant (opcional, default: employee)
   * @param authToken Token JWT
   * @returns true si se asignó correctamente
   */
  async assignTenant(
    email: string,
    tenantId: string,
    roleInTenant: string = 'employee',
    authToken: string,
  ): Promise<boolean> {
    try {
      this.logger.log(`Assigning tenant ${tenantId} to user ${email}`);

      await this.client.post(
        '/users/assign-tenant',
        {
          email,
          tenantId,
          role_in_tenant: roleInTenant,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      this.logger.log(`Tenant ${tenantId} assigned to user ${email}`);
      return true;
    } catch (error) {
      // Si es 409, ya está asignado - no es error
      if (error.response?.status === HttpStatus.CONFLICT) {
        this.logger.log(`User ${email} already has tenant ${tenantId} assigned`);
        return true;
      }
      this.handleError(error, 'assignTenant');
    }
  }

  /**
   * Manejo centralizado de errores
   */
  private handleError(error: any, method: string): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;
      const status = axiosError.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = axiosError.response?.data?.message || axiosError.message;

      this.logger.error(
        `Authorization Client Error [${method}]: ${status} - ${message}`,
        axiosError.stack,
      );

      // Propagar errores específicos
      if (status === HttpStatus.CONFLICT) {
        throw new HttpException(
          `El usuario ya existe en Authorization: ${message}`,
          HttpStatus.CONFLICT,
        );
      }

      if (status === HttpStatus.FORBIDDEN) {
        throw new HttpException(
          `No tienes permiso para crear usuarios: ${message}`,
          HttpStatus.FORBIDDEN,
        );
      }

      if (status === HttpStatus.UNAUTHORIZED) {
        throw new HttpException(
          `Token inválido o expirado: ${message}`,
          HttpStatus.UNAUTHORIZED,
        );
      }

      throw new HttpException(
        `Error comunicándose con Authorization: ${message}`,
        status,
      );
    }

    this.logger.error(`Unexpected error in ${method}:`, error);
    throw new HttpException(
      'Error interno al comunicarse con Authorization',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
