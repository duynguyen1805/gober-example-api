import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { configService } from '@app/common/index';
// service
import { UploadMinioProxyService } from './upload-minio-proxy.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'UPLOAD_MINIO_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [configService.getEnv('RABBITMQ_URI')],
          queue: 'upload_minio_queue',
          queueOptions: { durable: true }
        }
      }
    ])
  ],
  providers: [UploadMinioProxyService],
  exports: [UploadMinioProxyService, ClientsModule]
})
export class UploadMinIOModule {}
