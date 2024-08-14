import { randomUUID } from 'crypto'
import { type EntityManager } from 'typeorm'
import { randEmail } from '@ngneat/falso'
import { type Permission } from 'src/modules/permissions/permission.enum.js'
import { TokenSeeder } from '../../src/modules/auth/tests/seeders/token.seeder.js'
import { ClientSeeder } from '../../src/modules/auth/tests/seeders/client.seeder.js'
import { UserSeeder } from '../../src/modules/users/tests/user.seeder.js'
import { type Client } from '../../src/modules/auth/entities/client.entity.js'
import { RoleSeeder } from '../../src/modules/roles/tests/seeders/role.seeder.js'
import { type Role } from '../../src/modules/roles/entities/role.entity.js'
import { UserEntityBuilder } from '../../src/modules/users/tests/user-entity.builder.js'
import { type SetupUser } from '../../src/modules/users/tests/setup-user.type.js'
import { RoleEntityBuilder } from '../../src/modules/roles/tests/builders/entities/role-entity.builder.js'

export class TestContext {
  private readonly tokenSeeder: TokenSeeder
  private readonly clientSeeder: ClientSeeder
  private readonly userSeeder: UserSeeder
  private readonly roleSeeder: RoleSeeder

  private client?: Client
  private adminRole?: Role
  private readonlyRole?: Role

  constructor (
    private readonly manager: EntityManager
  ) {
    this.tokenSeeder = new TokenSeeder(this.manager)
    this.clientSeeder = new ClientSeeder(this.manager)
    this.roleSeeder = new RoleSeeder(this.manager)
    this.userSeeder = new UserSeeder(this.manager)
  }

  public async getClient (): Promise<Client> {
    if (this.client == null) {
      this.client = await this.clientSeeder.getTestClient()
    }

    return this.client
  }

  public async getAdminRole (): Promise<Role> {
    if (this.adminRole == null) {
      this.adminRole = await this.roleSeeder.seedAdminRole()
    }

    return this.adminRole
  }

  public async getReadonlyRole (): Promise<Role> {
    if (this.readonlyRole == null) {
      this.readonlyRole = await this.roleSeeder.seedReadonlyRole()
    }

    return this.readonlyRole
  }

  public async getRole (withPermissions: Permission[]): Promise<Role> {
    return await this.roleSeeder.seedOne(
      new RoleEntityBuilder()
        .withName(randomUUID())
        .withPermissions(withPermissions)
        .build()
    )
  }

  public async getUser (permissions: Permission[]): Promise<SetupUser> {
    const client = await this.getClient()
    const role = await this.getRole(permissions)
    const user = await this.userSeeder.seedOne(
      new UserEntityBuilder()
        .withEmail(randEmail())
        .withRole(role)
        .build()
    )
    const token = await this.tokenSeeder.seedOne(user, client)
    return { user, client, token }
  }

  public async getAdminUser (): Promise<SetupUser> {
    const client = await this.getClient()
    const adminRole = await this.getAdminRole()
    const adminUser = await this.userSeeder.seedOne(
      new UserEntityBuilder()
        .withEmail(randEmail())
        .withRole(adminRole)
        .build()
    )
    const token = await this.tokenSeeder.seedOne(adminUser, client)

    return { user: adminUser, client, token }
  }

  public async getReadonlyUser (): Promise<SetupUser> {
    const client = await this.getClient()
    const readonlyRole = await this.getReadonlyRole()
    const readonlyUser = await this.userSeeder.seedOne(
      new UserEntityBuilder()
        .withEmail(randEmail())
        .withRole(readonlyRole)
        .build()
    )
    const token = await this.tokenSeeder.seedOne(readonlyUser, client)

    return { user: readonlyUser, client, token }
  }

  public async getRandomUser (): Promise<SetupUser> {
    const client = await this.getClient()

    const randomUser = await this.userSeeder.seedOne(
      new UserEntityBuilder()
        .withEmail(randEmail())
        .build()
    )

    const token = await this.tokenSeeder.seedOne(randomUser, client)

    return { user: randomUser, client, token }
  }
}
