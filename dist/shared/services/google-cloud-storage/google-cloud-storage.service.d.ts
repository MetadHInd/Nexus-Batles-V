export declare class GoogleCloudStorageService {
    private readonly logger;
    private storage;
    private bucketName;
    constructor();
    uploadPdf(fileBuffer: Buffer, fileName: string, metadata?: Record<string, string>): Promise<string>;
    uploadPdfPublic(fileBuffer: Buffer, fileName: string, metadata?: Record<string, string>): Promise<string>;
    deletePdf(filePath: string): Promise<void>;
    fileExists(filePath: string): Promise<boolean>;
    getSignedUrl(filePath: string, expirationDays?: number): Promise<string>;
}
