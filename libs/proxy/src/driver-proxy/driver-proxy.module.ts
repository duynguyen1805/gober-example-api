// apps/libs/proxy/src/driver-proxy/driver-proxy.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DriverProxyService } from '@app/proxy/driver-proxy/driver-proxy.service';
import { configService } from '@app/common/config';
// service
import { DriverRequestProxyService } from './driver-request-proxy.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DRIVER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [configService.getEnv('RABBITMQ_URI')],
          queue: 'driver_queue',
          queueOptions: { durable: true }
        }
      }
    ]),
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
  providers: [DriverProxyService, DriverRequestProxyService],
  exports: [ClientsModule, DriverProxyService, DriverRequestProxyService]
})
export class DriverProxyModule {}
