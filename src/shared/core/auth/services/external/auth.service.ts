import { Injectable } from '@nestjs/common';
import { HttpClientBase } from 'src/shared/core/http/http-client.base';
import { LoginDto } from '../../dtos/login.dto';
import { LoginResponseModel } from '../../models/login-response.model';

@Injectable()
export class ExternalAuthService extends HttpClientBase {
  constructor() {
    super(`${process.env.AUTH_URL}/SysUser`);
  }

  async login(dto: LoginDto): Promise<LoginResponseModel> {
    // Obtener UUID del .env
    const authUuid = process.env.AUTH_UUID_ORIGIN;

    // Preparar headers personalizados
    const customHeaders = {
      'x-auth-uuid': authUuid || 'default-uuid',
    };

    return await this.post<LoginResponseModel>('/login', dto, customHeaders);
  }
}
