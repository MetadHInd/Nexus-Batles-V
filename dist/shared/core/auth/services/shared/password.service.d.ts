export declare class PasswordService {
    hashPassword(password: string): Promise<string>;
    validatePassword(plain: string, hashed: string): Promise<boolean>;
}
