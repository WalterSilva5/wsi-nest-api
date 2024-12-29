import { CrudRepository as ICrudRepository } from 'src/interfaces/crud-repository.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CrudService as ICrudService } from 'src/interfaces/crud-service.interface';
import { PaginationFilter } from 'src/filters/pagination.filter';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { Paginated } from 'src/interfaces/pagintaed.interface';

@Injectable()
export abstract class CrudService<Dto = any, Entity = any>
  implements ICrudService<Dto, Entity>
{
  constructor(protected repository: ICrudRepository) {}

  async createAsync(dto: Dto, user: UserDto): Promise<Entity> {
    return await this.repository.createAsync(dto, user);
  }

  async updateAsync(id: number, dto: Dto, user?: UserDto): Promise<Entity> {
    await this.findByIdAsync(id, user);
    return await this.repository.updateAsync(id, dto, user);
  }

  async deleteAsync(id: number, user?: UserDto): Promise<void> {
    await this.findByIdAsync(id, user);
    await this.repository.deleteAsync(id, user);
  }

  async findByIdAsync(id: number, user?: UserDto): Promise<Entity> {
    const item = await this.repository.findByIdAsync(id, user);
    if (!item) throw new NotFoundException('Objeto não encontrado');
    return item;
  }

  async findFilteredAsync(
    filter: PaginationFilter,
    user?: UserDto
  ): Promise<Paginated<Entity>> {
    return await this.repository.findFilteredAsync(filter, user);
  }
}
