import { User } from 'src/modules/user/dto/user.type';
import { Request } from 'express';

export interface AuthRequestDTO extends Request {
  user: User;
}
