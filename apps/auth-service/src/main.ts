import { NestFactory } from '@nestjs/core';
import { AuthAppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { configService } from '@app/common/config/config.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthAppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getEnv('RABBITMQ_URI')],
      queue: 'auth_queue',
      queueOptions: { durable: true }
    }
  });
  await app.startAllMicroservices();
  Logger.log('AUTH SERVICE is listening (RMQ queue: auth_queue)');
}
bootstrap();
