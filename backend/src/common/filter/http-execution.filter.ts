import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../response/api-response';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly _logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;
      let extractedMessage = exceptionResponse.message || exception.message;
      if (Array.isArray(extractedMessage)) {
        extractedMessage = extractedMessage[0];
      }
      message = String(extractedMessage);
    } else {
      this._logger.error('Unhandled Exception:', exception);
    }

    response.status(status).json(ApiResponse.error(message, status));
  }
}
