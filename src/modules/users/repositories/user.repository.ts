import { EntityManager, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { type PaginatedResult } from '../../../utils/pagination/paginated-result.interface.js'
import { transformPaginationForTypeORM } from '../../../utils/query/transform-pagination.js'
import { type PaginatedSearchQuery } from '../../../utils/query/paginated-search-query.dto.js'
import { User } from '../entities/user.entity.js'

@Injectable()
export class UserRepository extends Repository<User> {
  constructor (@InjectEntityManager() entityManager: EntityManager) {
    super(User, entityManager)
  }

  async findPaginated (q: PaginatedSearchQuery): Promise<PaginatedResult<User>> {
    const pagination = transformPaginationForTypeORM(q.pagination)

    const userQuery = this.createQueryBuilder('user')
      .take(pagination.limit)
      .skip(pagination.page * pagination.limit)

    const [users, count] = await userQuery.getManyAndCount()

    return {
      items: users,
      meta: {
        total: count,
        limit: pagination.limit,
        page: pagination.page
      }
    }
  }
}
