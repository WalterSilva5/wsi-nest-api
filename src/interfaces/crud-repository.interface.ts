import { PaginationFilter } from 'src/filters/pagination.filter';
import { UserDto } from 'src/cruds/user/dto/user.dto';
import { Paginated } from './paginated.interface';

export interface CrudRepository<Dto = any, Entity = any> {
  findPaginated(
    filter: PaginationFilter,
    user?: UserDto,
  ): Promise<Paginated<Entity>>;
  update(id: number, dto: Dto, user?: UserDto): Promise<Entity>;
  findById(id: number, user?: UserDto): Promise<Entity>;
  delete(id: number, user?: UserDto): Promise<void>;
  create(dto: Dto, user?: UserDto): Promise<Entity>;
}
