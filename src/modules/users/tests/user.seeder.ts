import type { EntityManager } from 'typeorm'
import type { User } from '../entities/user.entity.js'
import { UserRepository } from '../repositories/user.repository.js'
import { AbstractSeeder } from '../../../../test/seeders/abstract-seeder.js'

export class UserSeeder extends AbstractSeeder<User> {
  constructor (
    manager: EntityManager
  ) {
    super(new UserRepository(manager))
  }
}
