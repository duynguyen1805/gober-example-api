// app/api-gateway/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { setupGlobal } from '@app/common/bootstrap';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:4000',
      'https://expense-tracker-fe-gules.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  });

  setupGlobal(app);

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('GOBER API')
    .setDescription('GOBER API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 4000;
  app.startAllMicroservices();
  await app.listen(port);
  Logger.log(`API GATEWAY is running on: http://localhost:${port}`);
}

bootstrap();
