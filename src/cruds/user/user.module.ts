import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PrismaModule } from 'src/database/prisma/prisma.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserActivityRegistry } from './user.registry';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, UserActivityRegistry],
  imports: [PrismaModule, JwtModule],
  exports: [UserService, UserActivityRegistry],
})
export class UserModule {}
