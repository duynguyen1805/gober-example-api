import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { Request, Response } from 'express';
import { TranslateMessageCodeService } from '@app/common/services/translate-msg-code.service';

@Catch()
export class GatewayAllExceptionFilter implements ExceptionFilter {
  private translateMsgCode = new TranslateMessageCodeService();

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let messageCode: string | undefined;
    let messageText: string | undefined;

    // Trường hợp lỗi từ microservice trả về (RpcErrorFilter đã xử lý)
    if (exception?.statusCode && exception?.messageCode) {
      statusCode = exception.statusCode;
      messageCode = exception.messageCode; // coi như mã lỗi
      messageText = exception.message;
    }
    // Trường hợp là HttpException nội bộ Gateway
    else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const resp = exception.getResponse() as any;
      messageCode = resp?.messageCode || resp?.message || exception.message;
    }
    // Trường hợp exception bình thường
    else {
      statusCode = HttpStatus.BAD_REQUEST;
      messageCode = exception?.message || 'INTERNAL_SERVER_ERROR';
    }

    // Dịch message nếu có service translate
    const acceptLang = req.headers['accept-language'] as string | undefined;
    messageText =
      this.translateMsgCode.translateMessageCode(messageCode, acceptLang) ||
      messageCode;

    res.status(statusCode).json({
      messageCode,
      message: messageText,
      statusCode,
      timestamp: new Date().toISOString(),
      success: false,
      path: req.url,
      method: req.method,
      errorName: exception?.name
    });
  }
}
