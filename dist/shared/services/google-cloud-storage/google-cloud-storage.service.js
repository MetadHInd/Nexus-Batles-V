"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GoogleCloudStorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleCloudStorageService = void 0;
const common_1 = require("@nestjs/common");
const storage_1 = require("@google-cloud/storage");
let GoogleCloudStorageService = GoogleCloudStorageService_1 = class GoogleCloudStorageService {
    logger = new common_1.Logger(GoogleCloudStorageService_1.name);
    storage;
    bucketName;
    constructor() {
        this.bucketName = process.env.GCS_BUCKET_NAME || 'app-uploads';
        try {
            this.storage = new storage_1.Storage({
                projectId: process.env.GCP_PROJECT_ID,
                keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
            });
            this.logger.log(`✅ Google Cloud Storage initialized`);
            this.logger.log(`📦 Bucket: ${this.bucketName}`);
        }
        catch (error) {
            this.logger.error('❌ Failed to initialize Google Cloud Storage:', error);
            throw error;
        }
    }
    async uploadPdf(fileBuffer, fileName, metadata) {
        try {
            this.logger.log(`📤 Uploading PDF: ${fileName}`);
            this.logger.log(`📦 File size: ${fileBuffer.length} bytes`);
            const bucket = this.storage.bucket(this.bucketName);
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const uploadPath = process.env.GCS_UPLOAD_PATH || 'uploads';
            const filePath = `${uploadPath}/${year}/${month}/${day}/${fileName}`;
            const file = bucket.file(filePath);
            await file.save(fileBuffer, {
                metadata: {
                    contentType: 'application/pdf',
                    metadata: {
                        uploadedAt: new Date().toISOString(),
                        source: process.env.APP_NAME || 'app-service',
                        ...metadata,
                    },
                },
                resumable: false,
            });
            this.logger.log(`✅ PDF uploaded successfully: ${filePath}`);
            const [signedUrl] = await file.getSignedUrl({
                action: 'read',
                expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
            });
            this.logger.log(`🔗 Signed URL generated (expires in 7 days)`);
            return signedUrl;
        }
        catch (error) {
            this.logger.error('❌ Error uploading PDF to GCS:', error);
            throw new Error(`Failed to upload PDF: ${error.message}`);
        }
    }
    async uploadPdfPublic(fileBuffer, fileName, metadata) {
        try {
            this.logger.log(`📤 Uploading PDF (public): ${fileName}`);
            this.logger.log(`📦 File size: ${fileBuffer.length} bytes`);
            const bucket = this.storage.bucket(this.bucketName);
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const uploadPath = process.env.GCS_UPLOAD_PATH || 'uploads';
            const filePath = `${uploadPath}/${year}/${month}/${day}/${fileName}`;
            const file = bucket.file(filePath);
            await file.save(fileBuffer, {
                metadata: {
                    contentType: 'application/pdf',
                    metadata: {
                        uploadedAt: new Date().toISOString(),
                        source: process.env.APP_NAME || 'app-service',
                        ...metadata,
                    },
                },
                resumable: false,
            });
            await file.makePublic();
            this.logger.log(`✅ PDF uploaded and made public: ${filePath}`);
            const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${filePath}`;
            this.logger.log(`🔗 Public URL: ${publicUrl}`);
            return publicUrl;
        }
        catch (error) {
            this.logger.error('❌ Error uploading PDF to GCS:', error);
            throw new Error(`Failed to upload PDF: ${error.message}`);
        }
    }
    async deletePdf(filePath) {
        try {
            this.logger.log(`🗑️ Deleting PDF: ${filePath}`);
            const bucket = this.storage.bucket(this.bucketName);
            const file = bucket.file(filePath);
            await file.delete();
            this.logger.log(`✅ PDF deleted successfully: ${filePath}`);
        }
        catch (error) {
            this.logger.error('❌ Error deleting PDF from GCS:', error);
            throw new Error(`Failed to delete PDF: ${error.message}`);
        }
    }
    async fileExists(filePath) {
        try {
            const bucket = this.storage.bucket(this.bucketName);
            const file = bucket.file(filePath);
            const [exists] = await file.exists();
            return exists;
        }
        catch (error) {
            this.logger.error('❌ Error checking file existence:', error);
            return false;
        }
    }
    async getSignedUrl(filePath, expirationDays = 7) {
        try {
            const bucket = this.storage.bucket(this.bucketName);
            const file = bucket.file(filePath);
            const [signedUrl] = await file.getSignedUrl({
                action: 'read',
                expires: Date.now() + expirationDays * 24 * 60 * 60 * 1000,
            });
            return signedUrl;
        }
        catch (error) {
            this.logger.error('❌ Error generating signed URL:', error);
            throw new Error(`Failed to generate signed URL: ${error.message}`);
        }
    }
};
exports.GoogleCloudStorageService = GoogleCloudStorageService;
exports.GoogleCloudStorageService = GoogleCloudStorageService = GoogleCloudStorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GoogleCloudStorageService);
//# sourceMappingURL=google-cloud-storage.service.js.map