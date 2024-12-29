import { DefaultFilter } from 'src/filters/DefaultFilter';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { Paginated } from './pagintaed.interface';

export interface CrudService<Dto = any, Entity = any> {
  findFilteredAsync(filter: DefaultFilter, user?: UserDto): Promise<Paginated<Entity>>;
  updateAsync(id: number, dto: Dto, user?: UserDto): Promise<Entity>;
  findByIdAsync(id: number, user?: UserDto): Promise<Entity>;
  deleteAsync(id: number, user?: UserDto): Promise<void>;
  createAsync(dto: Dto, user?: UserDto): Promise<Entity>;
}
