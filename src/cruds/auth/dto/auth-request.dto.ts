import { User } from 'src/cruds/user/dto/user.type';
import { Request } from 'express';

export interface AuthRequestDTO extends Request {
  user: User;
}
