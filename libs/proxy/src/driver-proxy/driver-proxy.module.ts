// apps/libs/proxy/src/driver-proxy/driver-proxy.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DriverProxyService } from '@app/proxy/driver-proxy/driver-proxy.service';
import { configService } from '@app/common/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@app/common/constants';
import { JwtStrategy } from 'apps/api-gateway/src/modules/auth-proxy/jwt.strategy';
import { AuthProxyModule } from '../../../../apps/api-gateway/src/modules/auth-proxy/auth-proxy.module';

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
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' }
    })
  ],
  providers: [DriverProxyService],
  exports: [DriverProxyService, ClientsModule]
})
export class DriverProxyModule {}
