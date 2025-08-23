/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';
import { ErrorResult } from '@commons/types/error-result.type';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let errorType = 'Unknown error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        errorType = exception.name;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as Record<string, any>;
        // Puede ser string o array
        if (Array.isArray(responseObj.message)) {
          message = responseObj.message[0] || message;
        } else {
          message = responseObj.message || message;
        }
        errorType = responseObj.error || exception.name;
      }
      // Forzar errorType si el mensaje es "Not Allow"
      if (message === 'Not Allow') {
        errorType = 'Not Allow';
      }
    } else if (exception instanceof QueryFailedError) {
      status = HttpStatus.NOT_FOUND;
      message = 'Entity not found';
      errorType = EntityNotFoundError as unknown as string;
    } else {
      message = (exception as any)?.message || message;
      errorType = exception?.constructor.name || errorType;
    }

    this.logger.error(`[${errorType}] ${status} - ${message} | ${request.url}`);

    const errorResponse: ErrorResult = {
      statusCode: status,
      error: errorType,
      message,
      details:
        process.env.NODE_ENV !== 'production'
          ? (exception as any)?.stack
          : undefined,
    };
    response.status(status).json(errorResponse);
  }
}
