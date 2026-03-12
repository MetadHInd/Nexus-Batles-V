export declare class GcpConfigService {
    private readonly logger;
    private client;
    private projectId;
    private secretsCache;
    constructor();
    loadAllSecrets(): Promise<void>;
    private getSecret;
    getSecretFromCache(secretName: string): string | undefined;
    refreshSecret(secretName: string): Promise<void>;
}
