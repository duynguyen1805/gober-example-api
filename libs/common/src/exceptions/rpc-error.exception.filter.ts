import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcError } from '../exceptions/rpc-error.exception';

@Catch(RpcError)
export class RpcErrorExceptionFilter implements RpcExceptionFilter<RpcError> {
  catch(exception: RpcError, host: ArgumentsHost): Observable<any> {
    return throwError(() => ({
      statusCode: exception.statusCode,
      message: exception.message,
      messageCode: exception.messageCode || null
    }));
  }
}
