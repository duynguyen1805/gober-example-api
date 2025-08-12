// apps/api-gateway/src/modules/file-proxy/file-proxy.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FileProxyService } from './file-proxy.service';
import { FileProxyController } from './file-proxy.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'FILE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'file_queue',
          queueOptions: { durable: false }
        }
      }
    ])
  ],
  controllers: [FileProxyController],
  providers: [FileProxyService],
  exports: [FileProxyService]
})
export class FileProxyModule {}
