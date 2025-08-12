// apps/api-gateway/src/modules/auth/auth-proxy.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthProxyService } from './auth-proxy.service';
import { AuthProxyController } from './auth-proxy.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'auth_queue',
          queueOptions: { durable: false }
        }
      }
    ])
  ],
  controllers: [AuthProxyController],
  providers: [AuthProxyService],
  exports: [AuthProxyService]
})
export class AuthProxyModule {}
