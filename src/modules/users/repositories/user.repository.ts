import { EntityManager, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { User } from '../entities/user.entity.js'

@Injectable()
export class UserRepository extends Repository<User> {
  constructor (
    @InjectEntityManager()
    entityManager: EntityManager
  ) {
    super(User, entityManager)
  }

  async findWithUuids (
    userUuids: string[]
  ): Promise<User[]> {
    const usersQuery = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .andWhere('user.uuid IN (:...userUuids)', { userUuids })
      .orderBy('user.createdAt', 'DESC')

    return await usersQuery.getMany()
  }
}
