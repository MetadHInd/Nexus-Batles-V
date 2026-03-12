import { UserAuth } from 'src/shared/core/auth/interfaces/shared/user-auth.interface';
import { JwtSecretProvider } from '../services/shared/jwt-secret.provider';
import { IJWTUserResponse } from '../interfaces/user.interface';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly jwtSecretProvider;
    constructor(jwtSecretProvider: JwtSecretProvider);
    validate(payload: UserAuth): Promise<IJWTUserResponse>;
    private getAuthorizationRoleName;
}
export {};
