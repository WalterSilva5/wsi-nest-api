import { CrudRepository as ICrudRepository } from 'src/interfaces/crud-repository.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CrudService as ICrudService } from 'src/interfaces/crud-service.interface';
import { PaginationFilter } from 'src/filters/pagination.filter';
import { UserDto } from 'src/cruds/user/dto/user.dto';
import { Paginated } from 'src/interfaces/paginated.interface';

@Injectable()
export abstract class CrudService<Dto = any, Entity = any>
  implements ICrudService<Dto, Entity>
{
  constructor(protected repository: ICrudRepository) {}

  async create(dto: Dto, user: UserDto): Promise<Entity> {
    return await this.repository.create(dto, user);
  }

  async update(id: number, dto: Dto, user?: UserDto): Promise<Entity> {
    await this.findById(id, user);
    return await this.repository.update(id, dto, user);
  }

  async delete(id: number, user?: UserDto): Promise<void> {
    await this.findById(id, user);
    await this.repository.delete(id, user);
  }

  async findById(id: number, user?: UserDto): Promise<Entity> {
    const item = await this.repository.findById(id, user);
    if (!item) throw new NotFoundException('Objeto não encontrado');
    return item;
  }

  async findPaginated(
    filter: PaginationFilter,
    user?: UserDto,
  ): Promise<Paginated<Entity>> {
    return await this.repository.findPaginated(filter, user);
  }
}
