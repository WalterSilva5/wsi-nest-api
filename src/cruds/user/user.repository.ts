import { PrismaService } from 'src/database/prisma/prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';
import { User } from './dto/user.type';
import { Injectable } from '@nestjs/common';
import { PaginationFilter } from 'src/filters/pagination.filter';
import { Paginated } from 'src/interfaces/paginated.interface';
import { UserDto } from './dto/user.dto';
import { Paginator } from 'src/utils/paginator';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  public async getMe(idUser: number): Promise<User> {
    return await this.prisma.user.findFirst({
      where: {
        id: idUser,
      },
    });
  }

  public async createUser(dto: RegisterDto): Promise<User> {
    return await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        password: dto.password,
        email: dto.email,
      },
    });
  }

  public async findById(id: number): Promise<User> {
    return await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
  }

  public async findByEmail(email: string): Promise<User> {
    return await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  public async update(id: number, dto: UserDto): Promise<User> {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  public async findPaginated(
    filter: PaginationFilter,
    _user?: UserDto,
  ): Promise<Paginated<User>> {
    const OR: Record<string, any>[] = [];

    if (filter?.search) {
      ['firstName', 'lastName', 'email'].map((field) => {
        OR.push({
          [field]: {
            contains: filter.search,
          },
        });
      });
    }

    return await Paginator.applyPagination(this.prisma.user, {
      ...filter,
      where: {
        deletedAt: null,
        AND: {
          OR,
        },
      },
    });
  }

  public async delete(id: number): Promise<void> {
    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
