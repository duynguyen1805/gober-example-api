import { NestFactory } from '@nestjs/core';
import { FileAppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { configService } from '@app/common/config/config.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(FileAppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getEnv('RABBITMQ_URI')],
      queue: 'file_queue',
      queueOptions: { durable: true }
    }
  });
  await app.startAllMicroservices();
  const port = 4001;
  await app.listen(port);
  Logger.log(
    'FILE SERVICE is running on port ' +
      port +
      ', is listening (RMQ queue: file_queue)'
  );
}
bootstrap();
