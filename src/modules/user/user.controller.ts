import { Controller, Get, Query, Param, ParseIntPipe, Body, Patch } from '@nestjs/common';
import { AuthenticatedUser } from 'src/decorators/authenticated-user.decorator';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DefaultFilter } from 'src/filters/DefaultFilter';
import { Roles } from 'src/decorators/role.decorator';
import { User } from './dto/user.type';
import { UserService } from './user.service';
import { Role } from '@prisma/client';
import { UserDto } from './dto/user.dto';

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
  protected async getFilteredAsync(
    @AuthenticatedUser() user: UserDto,
    @Query() filter: DefaultFilter
  ): Promise<any> {
    return this.userService.findFilteredAsync(filter, user);
  }

  @Get('/:id')
  @ApiOkResponse({ type: UserDto })
  @Roles(Role.ADMIN)
  protected async findByIdAsync(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findById(id);
  }

  @Patch('/:id')
  @Roles(Role.ADMIN)
  @ApiOkResponse({ type: UserDto })
  protected async updateAsync(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UserDto
  ): Promise<User> {
    return this.userService.updateAsync(id, dto);
  }
}
