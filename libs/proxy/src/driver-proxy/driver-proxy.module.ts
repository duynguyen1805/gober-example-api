// apps/libs/proxy/src/driver-proxy/driver-proxy.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DriverProxyService } from '@app/proxy/driver-proxy/driver-proxy.service';
import { configService } from '@app/common/config';

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
    ])
  ],
  providers: [DriverProxyService],
  exports: [DriverProxyService]
})
export class DriverProxyModule {}
