import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { ServerError } from '../exceptions/server-error.exception';
import { TranslateMessageCodeService } from '../../common/services/translate-msg-code.service';

@Catch(ServerError)
export class ServerErrorFilter implements ExceptionFilter {
  private translateMsgCode = new TranslateMessageCodeService();

  catch(exception: ServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode = exception.getStatus();
    const resp = exception.getResponse() as any;

    const acceptLang = request.headers['accept-language'] as string | undefined;

    const messageCode = resp?.messageCode || resp?.message || 'SERVER_ERROR';
    const messageText =
      this.translateMsgCode.translateMessageCode(messageCode, acceptLang) ||
      messageCode;

    res.status(statusCode).json({
      messageCode: messageCode,
      message: messageText,
      statusCode,
      timestamp: new Date().toISOString(),
      success: false,
      path: request.url,
      method: request.method,
      errorName: exception?.name
    });
  }
}
