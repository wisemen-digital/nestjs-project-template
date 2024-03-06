import { EntityManager, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { type PaginatedResult } from '../../../utils/pagination/paginated-result.interface.js'
import { transformPaginationForTypeORM } from '../../../utils/query/transform-pagination.js'
import { User } from '../entities/user.entity.js'
import { type PaginationQuery } from '../../../utils/query/pagination-query.dto.js'

@Injectable()
export class UserRepository extends Repository<User> {
  constructor (@InjectEntityManager() entityManager: EntityManager) {
    super(User, entityManager)
  }

  async findPaginated (q: PaginationQuery): Promise<PaginatedResult<User>> {
    const pagination = transformPaginationForTypeORM(q)

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
