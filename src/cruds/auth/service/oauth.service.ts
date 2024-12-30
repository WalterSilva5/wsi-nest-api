import {
  BadRequestException,
  NotFoundException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { RegisterDto } from 'src/cruds/auth/dto/register.dto';
import { UserService } from 'src/cruds/user/user.service';
import { Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Injectable } from '@nestjs/common';
import { config } from 'src/utils/config';
import { Response } from 'express';

@Injectable()
export class OauthService {
  private readonly logger = new Logger(OauthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  private async registerUserAndReturnToken(
    userData: RegisterDto,
    @Res() res: Response,
  ): Promise<void> {
    const newUser = new RegisterDto();

    newUser.firstName = userData.firstName;
    newUser.lastName = userData.lastName;
    newUser.email = userData.email;
    newUser.password = '';

    try {
      await this.userService.create(newUser);
      const user = await this.userService.findByEmail(userData.email);
      await this.generateTokenAndRedirect(user, res);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.message);
    }
  }

  private async generateTokenAndRedirect(
    user: any,
    @Res() res: Response,
  ): Promise<void> {
    const tokens = await this.authService.getTokens(user);
    const url = this.getRedirectUrl(tokens);
    res.redirect(HttpStatus.FOUND, url);
  }

  private async googleLogin(@Request() req: any) {
    if (!req.user) throw new NotFoundException('User not found');

    return {
      message: 'User not found',
      user: req.user,
    };
  }

  private getRedirectUrl(tokens: any) {
    return (
      config.frontendUrl +
      '/auth/login?access=' +
      tokens.accessToken +
      '&refresh=' +
      tokens.refreshToken
    );
  }

  public async processOuthRedirect(
    @Request() req: Request,
    @Res() res: Response,
  ) {
    const { user }: any = await this.googleLogin(req);
    try {
      const userDb = await this.userService.findByEmail(user.email);
      return await this.generateTokenAndRedirect(userDb, res);
    } catch (error) {
      return await this.registerUserAndReturnToken(user, res);
    }
  }
}
