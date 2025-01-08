import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { ValidationException } from './validation.exception';

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const { statusCode, message, errors } = exception.getResponse();

    response.status(statusCode).json({
      statusCode,
      message,
      errors,
    });
  }
}
