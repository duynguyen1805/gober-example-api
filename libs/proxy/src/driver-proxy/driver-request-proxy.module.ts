import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { configService } from '@app/common/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@app/common/constants';
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
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' }
    })
  ],
  providers: [DriverRequestProxyService],
  exports: [DriverRequestProxyService, ClientsModule]
})
export class DriverRequestProxyModule {}
