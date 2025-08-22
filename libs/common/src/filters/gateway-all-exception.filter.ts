import {
  ArgumentsHost,
  BadRequestException,
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

  async catch(exception: any, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const acceptLang = req.headers['accept-language'] as string | undefined;
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let messageCode: string | undefined;
    let messageText: string | undefined;
    let errors: any = undefined;

    // Trường hợp lỗi validation (BadRequestException + errors)
    if (
      exception instanceof BadRequestException &&
      typeof exception.getResponse === 'function'
    ) {
      const response = exception.getResponse() as any;

      if (response?.errors && Array.isArray(response.errors)) {
        statusCode = exception.getStatus();
        messageCode = response.messageCode || 'VALIDATION_ERROR';
        const translatedErrors = await Promise.all(
          response.errors.map(async (e) => {
            const translatedMsgs = await Promise.all(
              (e.messages || []).map((key: string) =>
                this.translateMsgCode.translateMessageCode(key, acceptLang)
              )
            );
            return {
              field: e.field,
              messages: translatedMsgs
            };
          })
        );
        messageText = translatedErrors[0]?.messages?.[0] || messageCode;
        errors = translatedErrors;

        res.status(statusCode).json({
          statusCode,
          messageCode,
          message: messageText,
          errors,
          path: req.url,
          method: req.method,
          success: false,
          errorName: exception?.name
        });
        return;
      }
    }

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
