import { EntityManager } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { User } from '../entities/user.entity.js'
import { TypeOrmRepository } from '../../typeorm/utils/transaction.js'
import { type UserUuid } from '../user-uuid.js'

@Injectable()
export class UserRepository extends TypeOrmRepository<User> {
  constructor (entityManager: EntityManager) {
    super(User, entityManager)
  }

  async findByUuidOrFail (uuid: UserUuid): Promise<User> {
    return await this.findOneByOrFail({ uuid: uuid.toString() })
  }

  async findWithUuids (
    userUuids: UserUuid[]
  ): Promise<User[]> {
    if (userUuids.length === 0) return []
    const usersQuery = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .andWhere('user.uuid IN (:...userUuids)', { userUuids })

    return await usersQuery.getMany()
  }
}
