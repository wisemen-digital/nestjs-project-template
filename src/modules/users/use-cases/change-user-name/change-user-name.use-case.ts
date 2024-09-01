import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../repositories/user.repository.js'
import type { User } from '../../entities/user.entity.js'

import {
  TypesenseCollectionService
} from '../../../typesense/services/typesense-collection.service.js'
import {
  TypesenseCollectionName
} from '../../../typesense/enums/typesense-collection-index.enum.js'
import type { ChangeUserNameCommand } from './change-user-name.command.js'

@Injectable()
export class ChangeUserNameUseCase {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly typesenseService: TypesenseCollectionService
  ) {}

  async changeName (userUuid: string, dto: ChangeUserNameCommand): Promise<User> {
    const user = await this.userRepository.findOneByOrFail({ uuid: userUuid })

    user.firstName = dto.firstName ?? null
    user.lastName = dto.lastName ?? null

    await this.typesenseService.importManuallyToTypesense(TypesenseCollectionName.USER, [user])
    await this.userRepository.update(
      { uuid: userUuid },
      { firstName: user.firstName, lastName: user.lastName }
    )

    return user
  }
}
