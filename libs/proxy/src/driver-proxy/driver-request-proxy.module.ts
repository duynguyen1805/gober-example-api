import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { configService } from '@app/common/config';
// service
import { DriverRequestProxyService } from './driver-request-proxy.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DRIVER_REQUEST_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [configService.getEnv('RABBITMQ_URI')],
          queue: 'driver_request_queue',
          queueOptions: { durable: true }
        }
      }
    ])
  ],
  providers: [DriverRequestProxyService],
  exports: [DriverRequestProxyService]
})
export class DriverRequestProxyModule {}
