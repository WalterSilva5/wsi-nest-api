/* eslint-disable @typescript-eslint/no-unused-vars */
import { CrudRepository as ICrudRepository } from 'src/interfaces/crud-repository.interface';
import { PaginationFilter } from 'src/filters/pagination.filter';
import { NotImplementedException } from '@nestjs/common';
import { Paginated } from 'src/interfaces/pagintaed.interface';
import { UserDto } from '../user/dto/user.dto';

export abstract class CrudRepository<Dto = any, Entity = any>
  implements ICrudRepository<Dto, Entity>
{
  async findFilteredAsync(
    filter: PaginationFilter,
    user?: UserDto
  ): Promise<Paginated<Entity>> {
    throw new NotImplementedException();
  }
  abstract updateAsync(id: number, dto: Dto, user?: UserDto): Promise<Entity>;
  abstract findByIdAsync(id: number, user?: UserDto): Promise<Entity>;
  abstract deleteAsync(id: number, user?: UserDto): Promise<void>;
  abstract createAsync(dto: any, user?: UserDto): Promise<Entity>;
}
