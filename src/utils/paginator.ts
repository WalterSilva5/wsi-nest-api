import { PaginationFilter } from 'src/filters/pagination.filter';
import * as DataObjectParser from 'dataobject-parser';
import { createPaginator } from 'prisma-pagination';
import { BadRequestException } from '@nestjs/common';

export class Paginator {
  static async applyPagination<T>(
    entity: T,
    filter: PaginationFilter,
  ): Promise<any> {
    const paginate = createPaginator({
      perPage: filter.perPage,
    });

    if (filter.orderBy && filter.orderByDirection) {
      const parser = new DataObjectParser();
      parser.set(filter.orderBy, filter.orderByDirection);
      filter.orderBy = parser.data();
    }

    try {
      return await paginate<T, any>(
        entity,
        {
          where: filter.where,
          orderBy: filter.orderBy,
        },
        {
          page: filter.page,
        },
      );
    } catch (error) {
      console.log('Erro pagination ', error);
      throw new BadRequestException('Data pagination error');
    }
  }
}
