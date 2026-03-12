import { ConfigConstants } from 'src/shared/constants/config.constants.enum';
export declare class TokenService {
    validateToken(token: string): Promise<any>;
    generateToken(payload: string | object | Buffer, expiresIn?: ConfigConstants): string;
    generateUUID(amount?: number, isHexa?: boolean): string;
}
