import { LoginDto } from '../../dtos/login.dto';
import { RegisterDto } from '../../dtos/register.dto';
import { RequestResetPasswordDto, ResetPasswordDto } from '../../dtos/reset-password.dto';
import { ActivateAccountDto, ResendActivationDto } from '../../dtos/activation.dto';
import { LoginResponseModel } from '../../models/login-response.model';
import { IUser, IUserWithRole } from '../../interfaces/user.interface';
export declare class InternalAuthService {
    getSysuserByEmail(email: string): Promise<IUser | null>;
    getSysuserByUuid(uuid: string): Promise<IUserWithRole | null>;
    login(dto: LoginDto): Promise<LoginResponseModel>;
    register(dto: RegisterDto): Promise<{
        message: string;
        userId: number;
        activationUrl?: string;
        activationToken?: string;
    }>;
    activateAccount(dto: ActivateAccountDto): Promise<{
        message: string;
    }>;
    resendActivation(dto: ResendActivationDto): Promise<{
        message: string;
    }>;
    requestResetPassword(dto: RequestResetPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
