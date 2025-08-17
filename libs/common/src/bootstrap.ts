import { INestApplication, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { AllExceptionsFilter } from './exceptions/all-exception.filter';
import { ServerErrorFilter } from './exceptions/server-error.exception.filter';
import { GatewayAllExceptionFilter } from './exceptions/gateway-all-exception.filter';
import { RpcErrorExceptionFilter } from './exceptions/rpc-error.exception.filter';

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
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
  } else {
    app.useGlobalFilters(new RpcErrorExceptionFilter());
  }
}
