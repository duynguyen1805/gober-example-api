import { NestFactory } from '@nestjs/core';
import { DriverAppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { configService } from '@app/common/config/config.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import { setupGlobal } from '@app/common/bootstrap';

async function bootstrap() {
  const app = await NestFactory.create(DriverAppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getEnv('RABBITMQ_URI')],
      queue: 'driver_queue',
      queueOptions: { durable: true }
    }
  });

  setupGlobal(app);

  await app.startAllMicroservices();
  Logger.log('DRIVER SERVICE is listening (RMQ queue: driver_queue)');
}
bootstrap();
