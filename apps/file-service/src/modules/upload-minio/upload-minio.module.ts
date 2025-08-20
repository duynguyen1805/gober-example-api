import { Module } from '@nestjs/common';
// interceptors
import {
  SingleUploadInterceptor,
  MultiUploadInterceptor
} from '@app/common/interceptors/upload.interceptor';
// controller
import { UploadMinioController } from './upload-minio.controller';
// service
import { UploadMinioService } from './upload-minio.service';

@Module({
  imports: [],
  controllers: [UploadMinioController],
  providers: [
    UploadMinioService,
    SingleUploadInterceptor,
    MultiUploadInterceptor
  ],
  exports: [UploadMinioService]
})
export class UploadMinIOModule {}
