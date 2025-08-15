// apps/api-gateway/src/modules/file-proxy/file-proxy.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FileProxyService } from './file-proxy.service';
import { configService } from '@app/common/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'FILE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [configService.getEnv('RABBITMQ_URI')],
          queue: 'file_queue',
          queueOptions: { durable: true }
        }
      }
    ])
  ],
  providers: [FileProxyService],
  exports: [FileProxyService, ClientsModule]
})
export class FileProxyModule {}
