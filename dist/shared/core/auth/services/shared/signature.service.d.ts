import { HttpClientBase } from 'src/shared/core/http/http-client.base';
interface AuthSignResponse {
    originName: string;
    signSecret: string;
    checkSumSecret?: string;
    expiresAt?: string;
}
export declare class SignatureService extends HttpClientBase {
    private readonly logger;
    constructor();
    getAuthorizedSign(token: string, uuid: string): Promise<{
        success: boolean;
        payload: AuthSignResponse;
        message: string;
    }>;
}
export {};
