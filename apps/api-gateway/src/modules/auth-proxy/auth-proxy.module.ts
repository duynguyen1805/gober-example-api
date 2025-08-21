// apps/api-gateway/src/modules/auth/auth-proxy.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthProxyService } from './auth-proxy.service';
import { AuthProxyController } from './auth-proxy.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@app/common/constants';
import { CustomeCacheModule } from '@app/common/cache/cache.module';
import { configService } from '@app/common/config';

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
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule.register({
    //   secret: jwtConstants.secret,
    //   signOptions: { expiresIn: '24h' }
    // }),
    CustomeCacheModule,
    HttpModule
  ],
  controllers: [AuthProxyController],
  providers: [AuthProxyService],
  exports: [AuthProxyService]
})
export class AuthProxyModule {}
