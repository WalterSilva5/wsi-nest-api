import {
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Catch,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  private extractChildrenMessages(errors: any[]): string[] {
    let messages: string[] = [];

    errors.forEach((error) => {
      if (error.children) {
        messages = [
          ...messages,
          ...this.extractChildrenMessages(error.children),
        ];
      }
      if (error.constraints) {
        messages.push(...(Object.values(error.constraints) as string[]));
      }
    });

    return messages;
  }

  private extractMessages(exception: any): string[] {
    let messages: string[] = [];

    const errorMessages = exception.messages || [exception.message] || [
        'Unknown server error',
      ];
    errorMessages.forEach((message: Record<string, any>) => {
      if (message.constraints) {
        messages.push(...(Object.values(message.constraints) as string[]));
      } else if (message.children) {
        messages = [
          ...messages,
          ...this.extractChildrenMessages(message.children),
        ];
      } else if (typeof message === 'string') {
        messages.push(message);
      }
    });

    return messages;
  }

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let responseBody: any;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      responseBody =
        typeof exceptionResponse === 'object'
          ? {
              ...exceptionResponse,
              timestamp: new Date().toISOString(),
              path: httpAdapter.getRequestUrl(ctx.getRequest()),
            }
          : {
              statusCode: httpStatus,
              message: exceptionResponse,
              timestamp: new Date().toISOString(),
              path: httpAdapter.getRequestUrl(ctx.getRequest()),
            };
    } else {
      responseBody = {
        statusCode: httpStatus,
        message: exception.message || 'Internal server error',
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      };
    }

    if (exception?.stack) {
      console.log(exception.stack);
      console.log('---------------------');
      console.log(exception);
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}

export { AllExceptionsFilter };
