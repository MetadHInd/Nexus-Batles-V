import { Module, Global } from '@nestjs/common';
import { GoogleCloudStorageService } from './google-cloud-storage.service';

@Global()
@Module({
  providers: [GoogleCloudStorageService],
  exports: [GoogleCloudStorageService],
})
export class GoogleCloudStorageModule {}
