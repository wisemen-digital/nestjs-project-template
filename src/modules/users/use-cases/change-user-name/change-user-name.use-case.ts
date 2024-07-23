import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../repositories/user.repository.js'
import type { User } from '../../entities/user.entity.js'

import { type UserUuid } from '../../user-uuid.js'
import { UserTypesenseRepository } from '../../repositories/user-typesense.repository.js'

import { type ChangeUserNameRequest } from './change-user-name.request.js'

@Injectable()
export class ChangeUserNameUseCase {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly userTypesenseRepository: UserTypesenseRepository
  ) {}

  async changeName (userUuid: UserUuid, dto: ChangeUserNameRequest): Promise<User> {
    const user = await this.userRepository.findByUuidOrFail(userUuid)
    user.firstName = dto.firstName ?? null
    user.lastName = dto.lastName ?? null

    await this.userTypesenseRepository.insert(user)
    await this.userRepository.update(
      { uuid: userUuid.toString() },
      { firstName: user.firstName, lastName: user.lastName }
    )

    return user
  }
}
