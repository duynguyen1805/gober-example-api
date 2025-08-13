// apps/api-gateway/src/modules/file-proxy/file-proxy.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FileProxyService } from './file-proxy.service';
import { FileProxyController } from './file-proxy.controller';
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
  controllers: [FileProxyController],
  providers: [FileProxyService],
  exports: [FileProxyService]
})
export class FileProxyModule {}
