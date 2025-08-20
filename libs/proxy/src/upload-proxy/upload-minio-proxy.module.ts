import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { configService, jwtConstants } from '@app/common/index';
// service
import { UploadMinioProxyService } from './upload-minio-proxy.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'UPLOAD_MINIO_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [configService.getEnv('RABBITMQ_URI')],
          queue: 'upload_minio_queue',
          queueOptions: { durable: true }
        }
      }
    ])
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule.register({
    //   secret: jwtConstants.secret,
    //   signOptions: { expiresIn: '24h' }
    // })
  ],
  providers: [UploadMinioProxyService],
  exports: [UploadMinioProxyService, ClientsModule]
})
export class UploadMinIOModule {}
