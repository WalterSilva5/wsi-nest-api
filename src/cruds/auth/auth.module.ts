import { GoogleStrategy } from './strategies/google-auth.strategy';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { AuthController } from './controller/auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from 'src/cruds/user/user.module';
import { OauthService } from './service/oauth.service';
import { AtStrategy } from './strategies/at.strategy';
import { RtStrategy } from './strategies/rt.strategy';
import { AuthService } from './service/auth.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserActivityRegistry } from 'src/cruds/user/user.registry';

@Module({
  imports: [
    UserModule,
    UserActivityRegistry,
    PrismaModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    AtStrategy,
    RtStrategy,
    OauthService,
    GoogleStrategy,
  ],
})
export class AuthModule {}
