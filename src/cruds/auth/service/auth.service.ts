import {
  UnauthorizedException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { UserService } from 'src/cruds/user/user.service';
import { User } from 'src/cruds/user/dto/user.type';
import { RegisterDto } from '../dto/register.dto';
import { JWTTokenDto } from '../dto/token.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string) {
    let user = undefined;

    try {
      user = await this.userService.findByEmail(email, { password: true });
    } catch (error: any) {}

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Usuário ou senha inválidos');
    }

    return user;
  }

  async validateSession(
    user: User,
    token: string,
    tokenType: 'refresh' | 'access',
  ): Promise<void> {
    try {
      await this.jwtService.verify(token, {
        secret:
          tokenType === 'refresh'
            ? process.env.RT_SECRET
            : process.env.AT_SECRET,
        ignoreExpiration: false,
      });
    } catch (_: any) {
      throw new UnauthorizedException('Sessão expirada');
    }

    const userInDb = await this.userService.findById(user.id, {
      sessionToken: true,
    });

    if (process.env.PERMIT_DOUBLE_SESSION === 'false') {
      if (user.sessionToken !== userInDb.sessionToken) {
        throw new UnauthorizedException(
          'Já existe uma sessão ativa para esta conta',
        );
      }
    }
  }

  async login(user: User): Promise<JWTTokenDto> {
    const userInDb = await this.userService.findById(user.id);
    return await this.getTokens(userInDb);
  }

  async logout(user: User): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        sessionToken: null,
      },
    });
  }

  async createUser(dto: RegisterDto): Promise<JWTTokenDto> {
    const newUser = await this.userService.create(dto);
    return await this.getTokens(newUser);
  }

  async refreshTokens(user: User) {
    const userInDb = await this.userService.findById(user.id, {
      sessionToken: true,
    });

    if (!userInDb || !userInDb.sessionToken) {
      throw new UnauthorizedException('Sessão expirada');
    }

    return await this.getTokens(userInDb);
  }

  async updateSessionToken(user: User, sessionToken: string) {
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        sessionToken,
      },
    });
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(user: User): Promise<JWTTokenDto> {
    const sessionToken = crypto.randomBytes(16).toString('hex');

    const payload = {
      sub: user.id,
      ...user,
      sessionToken,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(payload, {
        secret: process.env.AT_SECRET,
        expiresIn: process.env.JWT_ACCESS_LIFETIME,
      }),
      this.jwtService.sign(payload, {
        secret: process.env.RT_SECRET,
        expiresIn: process.env.JWT_REFRESH_LIFETIME,
      }),
    ]);

    await this.updateSessionToken(user, sessionToken);

    return {
      refreshToken,
      accessToken,
      user,
    };
  }
}
