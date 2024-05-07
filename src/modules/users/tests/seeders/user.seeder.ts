import type { EntityManager } from 'typeorm'
import bcrypt from 'bcryptjs'
import { type User } from '../../entities/user.entity.js'
import { UserRepository } from '../../repositories/user.repository.js'
import { AbstractSeeder } from '../../../../../test/seeders/abstract-seeder.js'
import { type SetupUser } from '../setup-user.type.js'
import { TokenSeeder } from '../../../auth/tests/seeders/token.seeder.js'
import { type Client } from '../../../auth/entities/client.entity.js'

export class UserSeeder extends AbstractSeeder<User> {
  constructor (
    private readonly manager: EntityManager
  ) {
    super(new UserRepository(manager))
  }

  protected async seed (user: User): Promise<User> {
    user.password = await bcrypt.hash(user.password, 10)

    return await super.seed(user)
  }

  public async setup (client: Client, user: User): Promise<SetupUser> {
    const seededUser = await this.seed(user)

    const tokenSeeder = new TokenSeeder(this.manager)

    const token = await tokenSeeder.seedOne(seededUser, client)

    return { user: seededUser, client, token }
  }
}
