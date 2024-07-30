import { type EntityManager } from 'typeorm'
import { randEmail } from '@ngneat/falso'
import { TokenSeeder } from '../../src/modules/auth/tests/seeders/token.seeder.js'
import { ClientSeeder } from '../../src/modules/auth/tests/seeders/client.seeder.js'
import { UserSeeder } from '../../src/modules/users/tests/seeders/user.seeder.js'
import { type Client } from '../../src/modules/auth/entities/client.entity.js'
import { RoleSeeder } from '../../src/modules/roles/tests/seeders/role.seeder.js'
import { type Role } from '../../src/modules/roles/entities/role.entity.js'
import { UserEntityBuilder } from '../../src/modules/users/tests/builders/entities/user-entity.builder.js'
import { type SetupUser } from '../../src/modules/users/tests/setup-user.type.js'

export class TestContext {
  private readonly tokenSeeder: TokenSeeder
  private readonly clientSeeder: ClientSeeder
  private readonly userSeeder: UserSeeder
  private readonly roleSeeder: RoleSeeder

  private client?: Client
  private adminRole?: Role
  private readonlyRole?: Role
  private userRole?: Role

  constructor (
    private readonly manager: EntityManager
  ) {
    this.tokenSeeder = new TokenSeeder(this.manager)
    this.clientSeeder = new ClientSeeder(this.manager)
    this.roleSeeder = new RoleSeeder(this.manager)
    this.userSeeder = new UserSeeder(this.manager)
  }

  public async getClient (): Promise<Client> {
    if (this.client === undefined) {
      this.client = await this.clientSeeder.getTestClient()
    }

    return this.client
  }

  public async getAdminRole (): Promise<Role> {
    if (this.adminRole === undefined) {
      this.adminRole = await this.roleSeeder.seedAdminRole()
    }

    return this.adminRole
  }

  public async getReadonlyRole (): Promise<Role> {
    if (this.readonlyRole === undefined) {
      this.readonlyRole = await this.roleSeeder.seedReadonlyRole()
    }

    return this.readonlyRole
  }

  public async getUserRole (): Promise<Role> {
    if (this.userRole === undefined) {
      this.userRole = await this.roleSeeder.seedUserRole()
    }

    return this.userRole
  }

  public async getAdminUser (): Promise<SetupUser> {
    const client = await this.getClient()
    const adminRole = await this.getAdminRole()
    const adminUser = await this.userSeeder.seedOne(
      new UserEntityBuilder()
        .withFirstName('Admin')
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
        .withFirstName('Readonly')
        .withEmail(randEmail())
        .withRole(readonlyRole)
        .build()
    )
    const token = await this.tokenSeeder.seedOne(readonlyUser, client)

    return { user: readonlyUser, client, token }
  }

  public async getDefaultUser (): Promise<SetupUser> {
    const client = await this.getClient()
    const userRole = await this.getUserRole()
    const defaultUser = await this.userSeeder.seedOne(
      new UserEntityBuilder()
        .withFirstName('Default')
        .withEmail(randEmail())
        .withPassword('Password123')
        .withRole(userRole)
        .build()
    )
    const token = await this.tokenSeeder.seedOne(defaultUser, client)

    return { user: defaultUser, client, token }
  }
}
