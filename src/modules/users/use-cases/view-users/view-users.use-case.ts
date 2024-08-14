import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../repositories/user.repository.js'
import { matchUuidsToEntities } from '../../../../common/helpers/sort-entities-by-uuids.helper.js'
import { UserTypesenseRepository } from '../../repositories/user-typesense.repository.js'

import { type ViewUsersQuery } from './view-users.query.js'
import { ViewUsersResponse } from './view-users.response.js'

@Injectable()
export class ViewUsersUseCase {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly userTypesenseRepository: UserTypesenseRepository
  ) {}

  async viewUsers (query: ViewUsersQuery): Promise<ViewUsersResponse> {
    const [uuids, count] = await this.userTypesenseRepository.findPaginatedUuids(query)
    const users = await this.userRepository.findWithUuids(uuids)
    const sortedUsers = matchUuidsToEntities(uuids.map(uuid => uuid.toString()), users)

    return new ViewUsersResponse(sortedUsers, count, query.pagination.)
  }
}
