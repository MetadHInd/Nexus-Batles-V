import { HttpClientBase } from 'src/shared/core/http/http-client.base';
import { LoginDto } from '../../dtos/login.dto';
import { LoginResponseModel } from '../../models/login-response.model';
export declare class ExternalAuthService extends HttpClientBase {
    constructor();
    login(dto: LoginDto): Promise<LoginResponseModel>;
}
