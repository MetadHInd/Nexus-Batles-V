import { Response } from 'express';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { RequestResetPasswordDto, ResetPasswordDto } from '../dtos/reset-password.dto';
import { ActivateAccountDto, ResendActivationDto } from '../dtos/activation.dto';
import { LoginResponseModel } from '../models/login-response.model';
import { InternalAuthService } from '../services/internal/auth.service';
import { ExternalAuthService } from '../services/external/auth.service';
import { TokenService } from '../services/shared/token.service';
import { RestaurantSelectionResponse } from '../interfaces/restaurant-selection.interface';
import { IUserPublic } from '../interfaces/user.interface';
import { SSEConnectionManagerService } from '../../sse/services/sse-connection-manager.service';
export declare class AuthController {
    private readonly internalAuth;
    private readonly externalAuth;
    private readonly tokenService;
    private readonly sseConnectionManager;
    constructor(internalAuth: InternalAuthService, externalAuth: ExternalAuthService, tokenService: TokenService, sseConnectionManager: SSEConnectionManagerService);
    register(dto: RegisterDto): Promise<any>;
    activateAccount(dto: ActivateAccountDto): Promise<any>;
    resendActivation(dto: ResendActivationDto): Promise<any>;
    requestResetPassword(dto: RequestResetPasswordDto): Promise<any>;
    resetPassword(dto: ResetPasswordDto): Promise<any>;
    getUserByUuid(uuid: string): Promise<IUserPublic>;
    login(dto: LoginDto, response: Response): Promise<LoginResponseModel>;
    loginSwagger(dto: LoginDto, response: Response): Promise<LoginResponseModel>;
    debugAuth(req: any): Promise<any>;
    getProfile(req: any): Promise<any>;
    testLogin(): Promise<any>;
    testJwt(req: any): Promise<any>;
    getRestaurants(headers: any): Promise<RestaurantSelectionResponse>;
    selectRestaurant(headers: any, body: {
        restaurantUuid: string;
    }): Promise<any>;
    getMyTenants(req: any): Promise<any>;
    switchTenant(req: any, body: {
        tenant_sub: string;
    }): Promise<any>;
}
