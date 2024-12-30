/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticatedUser } from 'src/cruds/auth/decorators/authenticated-user.decorator';
import { IsPublic } from 'src/cruds/auth/decorators/is-public.decorator';
import { User } from 'src/cruds/user/dto/user.type';
import { AuthService } from '../service/auth.service';
import { JWTTokenDto } from '../dto/token.dto';
import { RtGuard } from '../guards/rt.guard';
import { AtGuard } from '../guards/at.guard';
import { LoginDto } from '../dto/login.dto';
import { Request } from '@nestjs/common';
import { GoogleOAuthGuard } from 'src/cruds/auth/guards/google-oauth.guard';
import { OauthService } from 'src/cruds/auth/service/oauth.service';
import { ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { LocalAuthGuard } from '../guards/local-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly oauthService: OauthService,
  ) {}

  @Get('refresh')
  @UseGuards(RtGuard)
  @ApiOkResponse({ type: JWTTokenDto })
  async refresh(@AuthenticatedUser() user: User) {
    return this.authService.refreshTokens(user);
  }

  @IsPublic()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOkResponse({ type: JWTTokenDto })
  @ApiBody({ type: LoginDto })
  async login(
    @AuthenticatedUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.status(HttpStatus.OK);
    return this.authService.login(user);
  }

  @Post('logout')
  @UseGuards(AtGuard)
  @ApiNoContentResponse()
  @ApiBearerAuth()
  async logout(
    @AuthenticatedUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.status(HttpStatus.OK);
    await this.authService.logout(user);
  }

  @Get('/accounts/google/login')
  @UseGuards(GoogleOAuthGuard)
  @IsPublic()
  async googleAuth(@Request() _req) {}

  @Get('/accounts/google/redirect')
  @ApiResponse({ status: HttpStatus.NOT_MODIFIED })
  @UseGuards(GoogleOAuthGuard)
  @IsPublic()
  async googleAuthRedirect(@Request() req, @Res() res: Response) {
    return this.oauthService.processOuthRedirect(req, res);
  }
}
