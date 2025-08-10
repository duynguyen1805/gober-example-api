import { HttpException, HttpStatus } from '@nestjs/common';

export class ServerError extends HttpException {
  constructor(
    messageCode: string,
    statusCode: number = HttpStatus.BAD_REQUEST,
    messageText?: string
  ) {
    super(
      {
        messageCode,
        message: messageText || messageCode
      },
      statusCode
    );
  }
}
