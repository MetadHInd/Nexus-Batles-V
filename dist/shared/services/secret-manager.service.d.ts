export declare class SecretManagerService {
    private readonly logger;
    private client;
    private projectId;
    constructor();
    getSecret(secretName: string): Promise<string>;
    createSecret(secretName: string, secretValue: string): Promise<void>;
    updateSecret(secretName: string, secretValue: string): Promise<void>;
    listSecrets(): Promise<string[]>;
    deleteSecret(secretName: string): Promise<void>;
}
