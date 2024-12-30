import {
  Body,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { AuthenticatedUser } from 'src/cruds/auth/decorators/authenticated-user.decorator';
import { CrudService as ICrudService } from 'src/interfaces/crud-service.interface';
import { PaginationFilter } from 'src/filters/pagination.filter';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserDto } from '../user/dto/user.dto';
import { Response } from 'express';
import { Paginated } from 'src/interfaces/paginated.interface';

@ApiBearerAuth()
export class CrudController<Dto = any> {
  constructor(protected service: ICrudService<Dto>) {}

  @Get()
  protected async getFiltered(
    @AuthenticatedUser() user: UserDto,
    @Query() filter: PaginationFilter,
  ): Promise<Paginated<Dto>> {
    return this.service.findPaginated(filter, user);
  }

  @Get('/:id')
  protected async findById(
    @AuthenticatedUser() user: UserDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    return this.service.findById(id, user);
  }

  @Post()
  protected async create(
    @AuthenticatedUser() user: UserDto,
    @Body() dto: Dto,
  ): Promise<any> {
    return this.service.create(dto, user);
  }

  @Put('/:id')
  protected async update(
    @AuthenticatedUser() user: UserDto,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Dto,
  ): Promise<any> {
    return this.service.update(id, dto, user);
  }

  @Delete('/:id')
  protected async delete(
    @Res({ passthrough: true }) response: Response,
    @AuthenticatedUser() user: UserDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    response.status(204);
    return this.service.delete(id, user);
  }
}
