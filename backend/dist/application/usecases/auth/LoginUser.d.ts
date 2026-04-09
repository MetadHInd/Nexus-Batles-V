import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IPasswordHasher } from './RegisterUser';
import { ITokenService } from './RegisterUser';
interface LoginDTO {
    email: string;
    password: string;
}
export declare class LoginUser {
    private readonly userRepository;
    private readonly passwordHasher;
    private readonly tokenService;
    constructor(userRepository: IUserRepository, passwordHasher: IPasswordHasher, tokenService: ITokenService);
    execute(data: LoginDTO, ip: string, userAgent: string): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
}
export {};
//# sourceMappingURL=LoginUser.d.ts.map