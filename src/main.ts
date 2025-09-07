import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/exceptions/all-exception.filter';
import { ServerErrorFilter } from './common/exceptions/server-error-exception.filter';
import { CustomValidationException } from './common/exceptions/custom-validation.exception';

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

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter(), new ServerErrorFilter());
  // app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // custome validation exception
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      exceptionFactory: (errors) => new CustomValidationException(errors)
    })
  );

  const config = new DocumentBuilder()
    .setTitle('GOBER API')
    .setDescription('GOBER API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 4000;
  await app.startAllMicroservices();
  await app.listen(port);
  Logger.log(`Listening on http://localhost:${port}`);
}
bootstrap();
