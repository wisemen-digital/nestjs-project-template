import { Injectable } from '@nestjs/common'
import { UserTypesenseRepository } from '../../repositories/user-typesense.repository.js'
import type { ViewUsersQuery } from './view-users.query.js'
import { ViewUsersResponse } from './view-users.response.js'

@Injectable()
export class ViewUsersUseCase {
  constructor (
    private readonly userTypesenseRepository: UserTypesenseRepository
  ) {}

  async viewUsers (query: ViewUsersQuery): Promise<ViewUsersResponse> {
    const [users, count] = await this.userTypesenseRepository.findPaginated(query)

    return new ViewUsersResponse(
      users,
      count,
      query.pagination?.limit ?? 0,
      query.pagination?.offset ?? 0
    )
  }
}
