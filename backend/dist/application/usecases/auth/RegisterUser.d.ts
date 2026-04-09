import { IUserRepository } from '../../../domain/repositories/IUserRepository';
export interface IPasswordHasher {
    hash(password: string): Promise<string>;
    compare(password: string, hash: string): Promise<boolean>;
}
export interface ITokenService {
    generate(payload: any): string;
    generateRefreshToken(payload: any): string;
    verify(token: string): any;
}
export interface IEmailService {
    sendConfirmation(email: string): Promise<void>;
}
interface RegisterUserDTO {
    nombres: string;
    apellidos: string;
    email: string;
    password: string;
    apodo: string;
    avatar?: string;
}
export declare class RegisterUser {
    private readonly userRepository;
    private readonly passwordHasher;
    private readonly tokenService;
    private readonly emailService;
    constructor(userRepository: IUserRepository, passwordHasher: IPasswordHasher, tokenService: ITokenService, emailService: IEmailService);
    execute(data: RegisterUserDTO): Promise<{
        user: any;
        token: string;
    }>;
    private validateApodo;
}
export {};
//# sourceMappingURL=RegisterUser.d.ts.map