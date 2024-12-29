import { User } from 'src/modules/user/dto/user.type';
import { Request } from 'express';

export interface IAuthRequest extends Request {
  user: User;
}
