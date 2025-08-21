// apps/api-gateway/src/modules/auth/auth-proxy.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthProxyService } from './auth-proxy.service';
import { AuthProxyController } from './auth-proxy.controller';
import { CustomeCacheModule } from '@app/common/cache/cache.module';
import { configService } from '@app/common/config';
import { JwtAuthModule } from '@app/common/auth/jwt-auth.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [configService.getEnv('RABBITMQ_URI')],
          queue: 'auth_queue',
          queueOptions: { durable: true }
        }
      }
    ]),
    JwtAuthModule,
    CustomeCacheModule,
    HttpModule
  ],
  controllers: [AuthProxyController],
  providers: [AuthProxyService]
})
export class AuthProxyModule {}
