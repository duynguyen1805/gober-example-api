import { NestFactory } from '@nestjs/core';
import { AuthAppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { configService } from '@app/common/config/config.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import {
  LoggingInterceptor,
  TransformInterceptor
} from '@app/common/interceptors';
import { AllExceptionsFilter, ServerErrorFilter } from '@app/common/exceptions';

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

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor()
  );
  app.useGlobalFilters(new AllExceptionsFilter(), new ServerErrorFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.startAllMicroservices();
  Logger.log('AUTH SERVICE is listening (RMQ queue: auth_queue)');
}
bootstrap();
