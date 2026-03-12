import { OnModuleInit } from '@nestjs/common';
import { SignatureService } from './signature.service';
import { JwtSecretProvider } from './jwt-secret.provider';
interface AuthSignData {
    originName: string;
    signSecret: string;
    checkSumSecret?: string;
    expiresAt?: string;
}
export declare class ChecksumService implements OnModuleInit {
    private readonly signatureService;
    private readonly jwtSecretProvider;
    private readonly logger;
    private authData;
    private maxRetries;
    constructor(signatureService: SignatureService, jwtSecretProvider: JwtSecretProvider);
    onModuleInit(): Promise<void>;
    private initializeAuthData;
    getCheckSumSecret(): string | null;
    getSignSecret(): string | null;
    getOriginName(): string | null;
    getExpiresAt(): Date | null;
    isExpiringSoon(thresholdMinutes?: number): boolean;
    refreshAuthData(): Promise<void>;
    getAllAuthData(): AuthSignData | null;
}
export {};
