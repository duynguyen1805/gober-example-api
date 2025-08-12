import { NestFactory } from '@nestjs/core';
import { FileAppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { configService } from '@app/common/config/config.service';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    FileAppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [configService.getEnv('RABBITMQ_URI')],
        queue: 'file_queue',
        queueOptions: { durable: true }
      }
    }
  );
  await app.listen();
  console.log('File service is listening (RMQ queue: file_queue)');
}
bootstrap();
