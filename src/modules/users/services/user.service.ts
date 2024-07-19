import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { type CreateUserDto } from '../dtos/create-user.dto.js'
import { type UpdateUserDto } from '../dtos/update-user.dto.js'
import { type User } from '../entities/user.entity.js'
import { UserRepository } from '../repositories/user.repository.js'
import { KnownError } from '../../../utils/exceptions/errors.js'
import { type UserQuery } from '../queries/user.query.js'
import { UserTypesenseRepository } from '../repositories/user-typesense.repository.js'
import { createHash, validatePassword } from '../../../utils/helpers/hash.helper.js'
import { type UpdatePasswordDto } from '../dtos/update-password.dto.js'
import { sortEntitiesByUuids } from '../../../utils/helpers/sort-entities-by-uuids.helper.js'
import { RedisCacheService } from '../../../utils/cache/cache.js'
import { RoleService } from '../../roles/services/role.service.js'
import { transaction } from '../../typeorm/utils/transaction.js'

@Injectable()
export class UserService {
  constructor (
    private readonly dataSource: DataSource,
    private readonly userRepository: UserRepository,
    private readonly userTypesenseRepository: UserTypesenseRepository,
    private readonly roleService: RoleService,
    private readonly redisCacheService: RedisCacheService
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

  async create (dto: CreateUserDto): Promise<User> {
    dto.email = dto.email.toLowerCase()
    await this.checkIfExists(dto.email)
    dto.password = await createHash(dto.password)
    const user = this.userRepository.create(dto)

    return await this.userRepository.save(user)
  }

  async update (userUuid: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOneOrFail(userUuid)
    Object.assign(user, dto)

    return await this.userRepository.save(user)
  }

  async updatePassword (userUuid: string, dto: UpdatePasswordDto): Promise<User> {
    const user = await this.findOneOrFail(userUuid)
    await validatePassword(dto.oldPassword, user.password)

    await this.userRepository.update(user.uuid, { password: await createHash(dto.password) })
    return user
  }

  async delete (userUuid: string): Promise<User> {
    const user = await this.findOneOrFail(userUuid)
    return await this.userRepository.remove(user)
  }

  async verify (email: string, password: string): Promise<User | false> {
    try {
      const user = await this.findOneByEmail(email)
      await validatePassword(password, user.password)

      return user
    } catch (e) {
      return false
    }
  }

  async updateRole (uuid: string, roleUuid: string): Promise<User> {
    const user = await this.userRepository.findOneOrFail({ where: { uuid } })

    const role = await this.roleService.findOne(roleUuid)

    user.role = role
    user.roleUuid = role.uuid

    await transaction(this.dataSource, async () => {
      await this.userRepository.update(user.uuid, { roleUuid: role.uuid })
      await this.redisCacheService.clearUserRole(user.uuid)
    })

    return user
  }
}
