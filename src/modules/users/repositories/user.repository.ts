import { EntityManager, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { User } from '../entities/user.entity.js'
import { TypesenseQueryService } from '../../typesense/services/typesense-query.service.js'
import { TypesenseAliasName } from '../../typesense/enums/typesense-collection.index.enum.js'
import { type PaginatedResult, emptyPaginatedResult } from '../../../utils/pagination/paginated-result.interface.js'
import { userCollection } from '../../typesense/collections/user.collection.js'

@Injectable()
export class UserRepository extends Repository<User> {
  constructor (
    @InjectEntityManager() entityManager: EntityManager,
      private readonly typesenseQueryService: TypesenseQueryService
  ) {
    super(User, entityManager)
  }

  async findPaginated (
    q: string
  ): Promise<PaginatedResult<User>> {
    const userQuery = this.createQueryBuilder('user')

    const searchedValues = await this.typesenseQueryService.search(
      TypesenseAliasName.USER,
      {
        q,
        query_by: userCollection.fields?.map(f => f.name).join(',') ?? ''
      }
    )

    const userUuids = searchedValues[TypesenseAliasName.USER]?.items.map(
      item => item.uuid
    )

    if (userUuids != null && userUuids.length === 0) {
      return emptyPaginatedResult<User>()
    }

    if (userUuids != null && userUuids.length > 0) {
      userQuery.where('user.uuid IN (:...userUuids)', { userUuids })
    }

    const [users, count] = await userQuery.getManyAndCount()

    return {
      items: users,
      meta: { total: count }
    }
  }
}
