import {
  BadRequestException,
  INestApplication,
  ValidationPipe
} from '@nestjs/common';
// exception
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { CustomValidationException } from './exceptions/custom-validation.exception';
// filter
// import { AllExceptionsFilter } from './filters/all-exception.filter';
// import { ServerErrorFilter } from './filters/server-error-exception.filter';
import { GatewayAllExceptionFilter } from './filters/gateway-all-exception.filter';
import { RpcErrorExceptionFilter } from './filters/rpc-error-exception.filter';

export function setupGlobal(app: INestApplication, isGateway = true) {
  if (isGateway) {
    app.useGlobalInterceptors(
      new LoggingInterceptor(),
      new TransformInterceptor()
    );
    app.useGlobalFilters(
      new GatewayAllExceptionFilter()
      // new AllExceptionsFilter(),
      // new ServerErrorFilter()
    );
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
        exceptionFactory: (errors) => new CustomValidationException(errors)
      })
    );
  } else {
    app.useGlobalFilters(new RpcErrorExceptionFilter());
  }
}
