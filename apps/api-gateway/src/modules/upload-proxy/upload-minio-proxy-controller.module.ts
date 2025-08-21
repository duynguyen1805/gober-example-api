// apps/libs/proxy/src/file-proxy/file-proxy-controller.module.ts
import { Module } from '@nestjs/common';
// module
import { JwtAuthModule } from '@app/common/auth/jwt-auth.module';
import { UploadMinIOModule } from '@app/proxy/upload-proxy/upload-minio-proxy.module';
// controller-proxy
import { UploadMinioController } from './upload-minio-proxy.controller';

@Module({
  imports: [JwtAuthModule, UploadMinIOModule],
  controllers: [UploadMinioController]
})
export class UploadMinioProxyControllerModule {}
