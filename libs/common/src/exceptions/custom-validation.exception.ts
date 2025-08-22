// common/exceptions/custom-validation.exception.ts
import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class CustomValidationException extends BadRequestException {
  constructor(errors: ValidationError[]) {
    const formattedErrors = CustomValidationException.formatErrors(errors);
    console.log('formattedErrors: ', formattedErrors);
    super({
      statusCode: 400,
      messageCode: 'VALIDATION_ERROR',
      errors: formattedErrors
    });
  }

  private static formatErrors(errors: ValidationError[]) {
    return errors.map((error) => {
      const constraints = Object.values(error.constraints || {});
      return {
        field: error.property,
        messages: constraints // chứa array key i18n
      };
    });
  }
}
