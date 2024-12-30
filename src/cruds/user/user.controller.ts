import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Body,
  Patch,
  Delete,
  Post,
} from '@nestjs/common';
import { AuthenticatedUser } from 'src/cruds/auth/decorators/authenticated-user.decorator';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PaginationFilter } from 'src/filters/pagination.filter';
import { Roles } from 'src/cruds/auth/decorators/role.decorator';
import { User } from './dto/user.type';
import { UserService } from './user.service';
import { Role } from '@prisma/client';
import { UserDto } from './dto/user.dto';
import { RegisterDto } from '../auth/dto/register.dto';

@ApiTags('user')
@Controller('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserDto })
  async getMe(@AuthenticatedUser() user: User): Promise<User> {
    return this.userService.getMe(user);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: [UserDto] })
  @Roles(Role.ADMIN)
  protected async getFiltered(
    @AuthenticatedUser() user: UserDto,
    @Query() filter: PaginationFilter,
  ): Promise<any> {
    return this.userService.findPaginated(filter, user);
  }

  @Get('/:id')
  @ApiOkResponse({ type: UserDto })
  @Roles(Role.ADMIN)
  protected async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User> {
    return this.userService.findById(id);
  }

  @Patch('/:id')
  @Roles(Role.ADMIN)
  @ApiOkResponse({ type: UserDto })
  protected async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UserDto,
  ): Promise<User> {
    return this.userService.update(id, dto);
  }

  @Delete('/:id')
  @Roles(Role.ADMIN)
  protected async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.userService.delete(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOkResponse({ type: UserDto })
  protected async create(@Body() dto: RegisterDto): Promise<User> {
    return this.userService.create(dto);
  }
}
