import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ISensitiveData } from 'src/interfaces/sensitive-date.interface';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';
import { UserRepository } from './user.repository';
import { User } from './dto/user.type';
import * as bcrypt from 'bcrypt';
import { DefaultFilter } from 'src/filters/DefaultFilter';
import { Paginated } from 'src/interfaces/pagintaed.interface';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  excludeUserFields<User, Key extends keyof User>(user: User, keys: Key[]): User {
    for (const key of keys) {
      delete user[key];
    }
    return user;
  }

  async getMe(dto: User): Promise<User> {
    return await this.findById(dto.id);
  }

  async findByEmail(email: string, returningOptions?: ISensitiveData): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const fieldsToExclude = [];

    if (!returningOptions?.sessionToken) fieldsToExclude.push('sessionToken');
    if (!returningOptions?.password) fieldsToExclude.push('password');

    return this.excludeUserFields(user, fieldsToExclude);
  }

  async findById(idUser: number, returningOptions?: ISensitiveData): Promise<User> {
    const user = await this.userRepository.findById(idUser);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const fieldsToExclude = [];

    if (!returningOptions?.sessionToken) fieldsToExclude.push('sessionToken');
    if (!returningOptions?.password) fieldsToExclude.push('password');

    return this.excludeUserFields(user, fieldsToExclude);
  }

  async createUser(dto: RegisterDto): Promise<User> {
    const userAlreadyRegistred = await this.userRepository.findByEmail(dto.email);

    if (userAlreadyRegistred) {
      throw new BadRequestException('User already registred');
    }

    if (dto.password) dto.password = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.createUser(dto);
    return this.excludeUserFields(user, ['password', 'sessionToken']);
  }

  async findFilteredAsync(
    filter: DefaultFilter,
    user?: UserDto
  ): Promise<Paginated<User>> {
    return await this.userRepository.findFilteredAsync(filter, user);
  }

  async updateAsync(id: number, dto: UserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.userRepository.updateAsync(id, dto);
    return this.excludeUserFields(updatedUser, ['password', 'sessionToken']);
  }
}
