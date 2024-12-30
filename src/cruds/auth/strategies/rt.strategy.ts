import { AuthService } from 'src/cruds/auth/service/auth.service';
import { User } from 'src/cruds/user/dto/user.type';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.RT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: User): Promise<User> {
    const token = req.headers.authorization.replace('Bearer', '').trim();
    await this.authService.validateSession(payload, token, 'refresh');
    return payload;
  }
}
