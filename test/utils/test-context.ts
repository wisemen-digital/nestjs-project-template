import { randomUUID } from 'crypto'
import type { EntityManager } from 'typeorm'
import type { Permission } from 'src/modules/permissions/permission.enum.js'
import { UserSeeder } from '../../src/modules/users/tests/user.seeder.js'
import { RoleSeeder } from '../../src/modules/roles/tests/seeders/role.seeder.js'
import type { Role } from '../../src/modules/roles/entities/role.entity.js'
import { UserEntityBuilder } from '../../src/modules/users/tests/user-entity.builder.js'
import type { TestUser } from '../../src/modules/users/tests/setup-user.type.js'
import { RoleEntityBuilder } from '../../src/modules/roles/tests/builders/entities/role-entity.builder.js'
import { User } from '../../src/modules/users/entities/user.entity.js'

export class TestContext {
  private readonly userSeeder: UserSeeder
  private readonly roleSeeder: RoleSeeder

  private adminRole?: Role
  private readonlyRole?: Role

  private users: Map<string, User> = new Map()

  constructor (
    private readonly manager: EntityManager
  ) {
    this.roleSeeder = new RoleSeeder(this.manager)
    this.userSeeder = new UserSeeder(this.manager)
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

  public async getUser (permissions: Permission[]): Promise<TestUser> {
    const role = await this.getRole(permissions)
    const user = await this.userSeeder.seedOne(
      new UserEntityBuilder()
        .withEmail(randomUUID() + '@mail.com')
        .withRole(role)
        .build()
    )

    const token = this.getToken(user)

    return { user, token }
  }

  public async getAdminUser (): Promise<TestUser> {
    const adminRole = await this.getAdminRole()
    const adminUser = await this.userSeeder.seedOne(
      new UserEntityBuilder()
        .withEmail(randomUUID() + '@mail.com')
        .withRole(adminRole)
        .build()
    )

    const token = this.getToken(adminUser)

    return { user: adminUser, token }
  }

  public async getReadonlyUser (): Promise<TestUser> {
    const readonlyRole = await this.getReadonlyRole()
    const readonlyUser = await this.userSeeder.seedOne(
      new UserEntityBuilder()
        .withEmail(randomUUID() + '@mail.com')
        .withRole(readonlyRole)
        .build()
    )

    const token = this.getToken(readonlyUser)

    return { user: readonlyUser, token }
  }

  public async getRandomUser (): Promise<TestUser> {
    const randomUser = await this.userSeeder.seedOne(
      new UserEntityBuilder()
        .withEmail(randomUUID() + '@mail.com')
        .build()
    )

    const token = this.getToken(randomUser)

    return { user: randomUser, token }
  }

  public resolveUser (token: string): User {
    const user = this.users.get(token)

    if (user == null) {
      throw new Error('User not found')
    }

    return user
  }

  public getToken (user: User): string {
    const token = randomUUID()

    this.users.set(token, user)

    return token
  }
}
