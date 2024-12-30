import { AuthService } from 'src/cruds/auth/service/auth.service';
import { User } from 'src/cruds/user/dto/user.type';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.AT_SECRET,
      passReqToCallback: true,
      ignoreExpiration: true,
    });
  }

  async validate(req: any, payload: User): Promise<User> {
    const token = req.headers.authorization.replace('Bearer', '').trim();
    await this.authService.validateSession(payload, token, 'access');
    return payload;
  }
}
