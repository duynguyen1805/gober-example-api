import { RpcException } from '@nestjs/microservices';

// common/exceptions/rpc-error.exception.ts
export class RpcError extends RpcException {
  constructor(
    public messageCode: string,
    public statusCode: number, // http-like code
    public messageText?: string
  ) {
    super({
      messageCode,
      message: messageText || messageCode,
      statusCode
    });
  }
}
