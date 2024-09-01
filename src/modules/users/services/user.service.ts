import { Injectable } from '@nestjs/common'
import type { User } from '../entities/user.entity.js'
import { UserRepository } from '../repositories/user.repository.js'
import { UserTypesenseRepository } from '../repositories/user-typesense.repository.js'
import { RoleRepository } from '../../roles/repositories/role.repository.js'
import { verifyPassword } from '../../../utils/helpers/hash.helper.js'

@Injectable()
export class UserService {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly userTypesenseRepository: UserTypesenseRepository,
    private readonly roleRepository: RoleRepository
  ) {}

  async findOne (uuid: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { uuid } })
  }

  async findOneOrFail (uuid: string): Promise<User> {
    return await this.userRepository.findOneOrFail({ where: { uuid } })
  }

  async findOneByEmail (email: string): Promise<User> {
    return await this.userRepository.findOneOrFail({
      where: { email: email.toLowerCase() }
    })
  }

  async verify (email: string, password: string): Promise<User | false> {
    try {
      const user = await this.findOneByEmail(email)

      await verifyPassword(password, user.password)

      return user
    } catch (_e) {
      return false
    }
  }
}
