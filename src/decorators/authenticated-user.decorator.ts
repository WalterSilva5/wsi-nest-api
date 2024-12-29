import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuthRequest } from 'src/interfaces/auth-request.interface';
import { User } from 'src/modules/user/dto/user.type';

export const AuthenticatedUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest<IAuthRequest>();
    return request.user;
  }
);
