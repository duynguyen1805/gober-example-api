import { NestFactory } from '@nestjs/core';
import { UploadAppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { configService } from '@app/common/config/config.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import { setupGlobal } from '@app/common/bootstrap';

async function bootstrap() {
  const app = await NestFactory.create(UploadAppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getEnv('RABBITMQ_URI')],
      queue: 'upload_minio_queue',
      queueOptions: { durable: true }
    }
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getEnv('RABBITMQ_URI')],
      queue: 'file_queue',
      queueOptions: { durable: true }
    }
  });

  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   FileAppModule,
  //   {
  //     transport: Transport.RMQ,
  //     options: {
  //       urls: [configService.getEnv('RABBITMQ_URI')],
  //       queue: 'file_queue',
  //       queueOptions: { durable: true }
  //     }
  //   }
  // );

  setupGlobal(app, false);

  await app.startAllMicroservices();
  Logger.log(
    'UPLOAD SERVICE is listening (RMQ queue: upload_minio_queue, file_queue)'
  );
}
bootstrap();
