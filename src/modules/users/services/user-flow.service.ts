import { Injectable } from '@nestjs/common'

import { TypesenseCollectionService } from '../../typesense/services/typesense-collection.service.js'
import { TypesenseCollectionName } from '../../typesense/enums/typesense-collection-index.enum.js'
import { type User } from '../entities/user.entity.js'
import { type UpdateUserDto } from '../dtos/update-user.dto.js'
import { type ViewUsersQuery } from '../use-cases/view-users/view-users.query.js'
import { UserService } from './user.service.js'

@Injectable()
export class UserFlowService {
  constructor (
    private readonly userService: UserService,
    private readonly typesenseService: TypesenseCollectionService
  ) {}

  async findPaginatedAndCount (query: ViewUsersQuery): Promise<[User[], number]> {
    return await this.userService.findPaginated(query)
  }

  async update (userUuid: string, dto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userService.update(userUuid, dto)
    await this.typesenseService.importManually(
      TypesenseCollectionName.USER,
      [updatedUser]
    )
    return updatedUser
  }

  async delete (userUuid: string): Promise<void> {
    await this.userService.delete(userUuid)
    await this.typesenseService.deleteFromTypesense(TypesenseCollectionName.USER, userUuid)
  }
}
