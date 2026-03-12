import { PlayerRole } from '../../domain/entities/Player';
export interface JwtPayload {
    sub: string;
    role: PlayerRole;
    jti: string;
}
export declare function signAccessToken(payload: Omit<JwtPayload, 'jti'>): string;
export declare function signRefreshToken(userId: string): string;
export declare function verifyAccessToken(token: string): JwtPayload;
export declare function verifyRefreshToken(token: string): {
    sub: string;
    jti: string;
};
