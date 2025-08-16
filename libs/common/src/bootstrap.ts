import { INestApplication, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { AllExceptionsFilter } from './exceptions/all-exception.filter';
import { ServerErrorFilter } from './exceptions/server-error-exception.filter';

export function setupGlobal(app: INestApplication) {
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor()
  );
  app.useGlobalFilters(new AllExceptionsFilter(), new ServerErrorFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
}
