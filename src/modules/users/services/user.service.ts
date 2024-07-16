import { Injectable } from '@nestjs/common'
import { type UpdateUserDto } from '../dtos/update-user.dto.js'
import { type User } from '../entities/user.entity.js'
import { UserRepository } from '../repositories/user.repository.js'
import { KnownError } from '../../../common/exceptions/errors.js'
import { type UserQuery } from '../queries/user.query.js'
import { UserTypesenseRepository } from '../repositories/user-typesense.repository.js'
import { sortEntitiesByUuids } from '../../../common/helpers/sort-entities-by-uuids.helper.js'
import { verifyPassword } from '../../../common/auth/verify-password.js'

@Injectable()
export class UserService {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly userTypesenseRepository: UserTypesenseRepository
  ) {}

  async findPaginated (
    query: UserQuery
  ): Promise<[items: User[], count: number]> {
    const [uuids, count] = await this.userTypesenseRepository.findPaginatedUuids(query)
    const users = await this.userRepository.findWithUuids(uuids)

    const sortedUsers = sortEntitiesByUuids(uuids, users)

    return [sortedUsers, count]
  }

  async findOneOrFail (uuid: string): Promise<User> {
    return await this.userRepository.findOneOrFail({ where: { uuid } })
  }

  async findOneByEmail (email: string): Promise<User> {
    return await this.userRepository.findOneOrFail({
      where: { email: email.toLowerCase() }
    })
  }

  async checkIfExists (email: string): Promise<void> {
    const exists = await this.userRepository.findOne({
      where: { email }
    })

    if (exists !== null) throw new KnownError('already_exists')
  }

  async update (userUuid: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOneOrFail(userUuid)
    Object.assign(user, dto)

    return await this.userRepository.save(user)
  }

  async delete (userUuid: string): Promise<User> {
    const user = await this.findOneOrFail(userUuid)
    return await this.userRepository.remove(user)
  }

  async verify (email: string, password: string): Promise<User | false> {
    try {
      const user = await this.findOneByEmail(email)
      await verifyPassword(password, user.password)

      return user
    } catch (e) {
      return false
    }
  }
}
