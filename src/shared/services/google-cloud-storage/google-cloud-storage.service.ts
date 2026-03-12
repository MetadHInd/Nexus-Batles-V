import { Injectable, Logger } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class GoogleCloudStorageService {
  private readonly logger = new Logger(GoogleCloudStorageService.name);
  private storage: Storage;
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.GCS_BUCKET_NAME || 'app-uploads';
    
    // Initialize Google Cloud Storage
    try {
      // If running on GCP, credentials are automatic
      // Otherwise, use GOOGLE_APPLICATION_CREDENTIALS env variable
      this.storage = new Storage({
        projectId: process.env.GCP_PROJECT_ID,
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      });
      
      this.logger.log(`✅ Google Cloud Storage initialized`);
      this.logger.log(`📦 Bucket: ${this.bucketName}`);
    } catch (error) {
      this.logger.error('❌ Failed to initialize Google Cloud Storage:', error);
      throw error;
    }
  }

  /**
   * Upload a PDF file to Google Cloud Storage
   * @param fileBuffer - The PDF file as a Buffer
   * @param fileName - The name for the file (without path)
   * @param metadata - Optional metadata to attach to the file
   * @returns The public URL of the uploaded file
   */
  async uploadPdf(
    fileBuffer: Buffer,
    fileName: string,
    metadata?: Record<string, string>,
  ): Promise<string> {
    try {
      this.logger.log(`📤 Uploading PDF: ${fileName}`);
      this.logger.log(`📦 File size: ${fileBuffer.length} bytes`);

      const bucket = this.storage.bucket(this.bucketName);
      
      // Create a unique path for the file: uploads/YYYY/MM/DD/filename
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const uploadPath = process.env.GCS_UPLOAD_PATH || 'uploads';
      const filePath = `${uploadPath}/${year}/${month}/${day}/${fileName}`;

      const file = bucket.file(filePath);

      // Upload the file with metadata
      await file.save(fileBuffer, {
        metadata: {
          contentType: 'application/pdf',
          metadata: {
            uploadedAt: new Date().toISOString(),
            source: process.env.APP_NAME || 'app-service',
            ...metadata,
          },
        },
        resumable: false, // For files < 5MB, non-resumable is faster
      });

      this.logger.log(`✅ PDF uploaded successfully: ${filePath}`);

      // Make the file publicly accessible (optional - adjust based on security requirements)
      // await file.makePublic();
      // If you want public access, uncomment the line above

      // Generate a signed URL that expires in 7 days (for secure access)
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      this.logger.log(`🔗 Signed URL generated (expires in 7 days)`);

      return signedUrl;
    } catch (error) {
      this.logger.error('❌ Error uploading PDF to GCS:', error);
      throw new Error(`Failed to upload PDF: ${error.message}`);
    }
  }

  /**
   * Upload a PDF file to Google Cloud Storage with permanent public access
   * Use this if you want the PDF to be publicly accessible without signed URLs
   * @param fileBuffer - The PDF file as a Buffer
   * @param fileName - The name for the file (without path)
   * @param metadata - Optional metadata to attach to the file
   * @returns The public URL of the uploaded file
   */
  async uploadPdfPublic(
    fileBuffer: Buffer,
    fileName: string,
    metadata?: Record<string, string>,
  ): Promise<string> {
    try {
      this.logger.log(`📤 Uploading PDF (public): ${fileName}`);
      this.logger.log(`📦 File size: ${fileBuffer.length} bytes`);

      const bucket = this.storage.bucket(this.bucketName);
      
      // Create a unique path for the file
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const uploadPath = process.env.GCS_UPLOAD_PATH || 'uploads';
      const filePath = `${uploadPath}/${year}/${month}/${day}/${fileName}`;

      const file = bucket.file(filePath);

      // Upload the file
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

      // Make the file publicly accessible
      await file.makePublic();

      this.logger.log(`✅ PDF uploaded and made public: ${filePath}`);

      // Return the public URL
      const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${filePath}`;
      
      this.logger.log(`🔗 Public URL: ${publicUrl}`);

      return publicUrl;
    } catch (error) {
      this.logger.error('❌ Error uploading PDF to GCS:', error);
      throw new Error(`Failed to upload PDF: ${error.message}`);
    }
  }

  /**
   * Delete a PDF file from Google Cloud Storage
   * @param filePath - The full path to the file in the bucket
   */
  async deletePdf(filePath: string): Promise<void> {
    try {
      this.logger.log(`🗑️ Deleting PDF: ${filePath}`);

      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(filePath);

      await file.delete();

      this.logger.log(`✅ PDF deleted successfully: ${filePath}`);
    } catch (error) {
      this.logger.error('❌ Error deleting PDF from GCS:', error);
      throw new Error(`Failed to delete PDF: ${error.message}`);
    }
  }

  /**
   * Check if a file exists in Google Cloud Storage
   * @param filePath - The full path to the file in the bucket
   * @returns true if the file exists, false otherwise
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(filePath);

      const [exists] = await file.exists();
      return exists;
    } catch (error) {
      this.logger.error('❌ Error checking file existence:', error);
      return false;
    }
  }

  /**
   * Generate a new signed URL for an existing file
   * @param filePath - The full path to the file in the bucket
   * @param expirationDays - Number of days until the URL expires (default: 7)
   * @returns The signed URL
   */
  async getSignedUrl(filePath: string, expirationDays = 7): Promise<string> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(filePath);

      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + expirationDays * 24 * 60 * 60 * 1000,
      });

      return signedUrl;
    } catch (error) {
      this.logger.error('❌ Error generating signed URL:', error);
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }
  }
}
