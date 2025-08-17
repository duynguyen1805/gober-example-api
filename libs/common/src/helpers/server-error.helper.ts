// import { ServerError } from '../exceptions/server-error.exception';
import { RpcError } from '@app/common/exceptions/rpc-error.exception';

export function mustAuthenticateTwoFa(
  expression: boolean,
  message = 'TWO_FA_INCORRECT',
  messageText?: string,
  statusCode = 400
) {
  if (expression) return;
  throw new RpcError(message, statusCode, messageText ? messageText : message);
  // throw new ServerError(message, statusCode, messageText);
}

export function mustTwoFa(
  expression: boolean,
  message = 'REQUIRED_TWO_FA',
  messageText?: string,
  statusCode = 400
) {
  if (!expression) return;
  throw new RpcError(message, statusCode, messageText ? messageText : message);
  // throw new ServerError(message, statusCode, messageText);
}

export function makeSure(
  expression: boolean,
  message = 'INVALID_MAKE_SURE',
  messageText?: string,
  statusCode = 400
) {
  if (expression) return;
  throw new RpcError(message, statusCode, messageText ? messageText : message);
  // throw new ServerError(message, statusCode, messageText);
}

export function mustExist(
  value: unknown,
  message = 'NOT_EXIST',
  messageText?: string,
  statusCode = 400
) {
  if (value) return;
  throw new RpcError(message, statusCode, messageText ? messageText : message);
  // throw new ServerError(message, statusCode, messageText);
}

export function mustMatchReg(
  value: string,
  reg: RegExp,
  message = 'NOT_MATCH_REGEX',
  messageText?: string,
  statusCode = 400
) {
  if (typeof value === 'string' && value.match(reg)) return;
  throw new RpcError(message, statusCode, messageText ? messageText : message);
  // throw new ServerError(message, statusCode, messageText);
}

export function serverError(
  message: string,
  messageText?: string,
  statusCode = 500
) {
  throw new RpcError(message, statusCode, messageText ? messageText : message);
  // throw new ServerError(message, statusCode, messageText);
}
