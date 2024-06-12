import { EntityManager } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { User } from '../entities/user.entity.js'
import { TypeOrmRepository } from '../../typeorm/utils/transaction.js'

@Injectable()
export class UserRepository extends TypeOrmRepository<User> {
  constructor (entityManager: EntityManager) {
    super(User, entityManager)
  }
}
