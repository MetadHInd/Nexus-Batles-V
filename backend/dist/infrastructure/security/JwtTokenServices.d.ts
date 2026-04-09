import { ITokenService } from '../../application/usecases/auth/RegisterUser';
export declare class JwtTokenService implements ITokenService {
    generate(payload: any): string;
    generateRefreshToken(payload: any): string;
    verify(token: string): any;
    verifyRefreshToken(token: string): any;
}
//# sourceMappingURL=JwtTokenServices.d.ts.map