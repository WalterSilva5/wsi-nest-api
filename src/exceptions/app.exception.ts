import { BadRequestException } from '@nestjs/common';

export class AppException extends BadRequestException {
  name = 'AppException';

  constructor(details: any) {
    super({
      statusCode: 400,
      error: 'Bad Request',
      ...(typeof details === 'object' && !Array.isArray(details)
        ? details
        : { message: details }),
    });
  }
}
