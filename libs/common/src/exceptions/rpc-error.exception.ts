// common/exceptions/rpc-error.exception.ts
export class RpcError extends Error {
  constructor(
    public messageCode: string,
    public statusCode: number, // http-like code
    public message: string
  ) {
    super(message);
  }
}
