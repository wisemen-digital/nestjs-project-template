import { before, describe, it, after } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import type { DataSource } from 'typeorm'
import { NestExpressApplication } from '@nestjs/platform-express'
import { setupTest } from '../../../../utils/test-setup/setup.js'
import { ClientSeeder } from '../../../auth/tests/seeders/client.seeder.js'
import { TokenSeeder } from '../../../auth/tests/seeders/token.seeder.js'
import { TestUser } from '../../../users/tests/setup-user.type.js'
import { UserEntityBuilder } from '../../../users/tests/user-entity.builder.js'
import { UserSeeder } from '../../../users/tests/user.seeder.js'
import { RoleEntityBuilder } from '../../tests/builders/entities/role-entity.builder.js'
import { RoleSeeder } from '../../tests/seeders/role.seeder.js'
import { TestContext } from '../../../../../test/utils/test-context.js'
import { Permission } from '../../../permissions/permission.enum.js'
import { Role } from '../../entities/role.entity.js'

describe('role', () => {
  let app: NestExpressApplication
  let dataSource: DataSource

  let context: TestContext

  let adminUser: TestUser
  let readonlyUser: TestUser

  let role: Role

  before(async () => {
    ({ app, dataSource } = await setupTest())

    context = new TestContext(dataSource.manager)

    adminUser = await context.getAdminUser()
    readonlyUser = await context.getReadonlyUser()

    role = await new RoleSeeder(dataSource.manager).seedOne(
      new RoleEntityBuilder()
        .withName('should-return-role-when-having-role-read-permission')
        .withPermissions([Permission.ROLE_READ])
        .build()
    )
  })

  after(async () => {
    await app.close()
  })

  describe('Get role', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get(`/role/${role.uuid}`)

      expect(response).toHaveStatus(401)
    })

    it('should return 403 when not authorized', async () => {
      const response = await request(app.getHttpServer())
        .get(`/role/${role.uuid}`)
        .set('Authorization', `Bearer ${readonlyUser.token}`)

      expect(response).toHaveStatus(403)
    })

    it('should return role when admin', async () => {
      const response = await request(app.getHttpServer())
        .get(`/role/${role.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response).toHaveStatus(200)
    })

    it('should return role when having ROLE_READ permission', async () => {
      const user = await new UserSeeder(dataSource.manager).seedOne(
        new UserEntityBuilder()
          .withRole(role)
          .build()
      )
      const client = await new ClientSeeder(dataSource.manager).getTestClient()
      const token = await new TokenSeeder(dataSource.manager).seedOne(user, client)

      const response = await request(app.getHttpServer())
        .get(`/role/${role.uuid}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response).toHaveStatus(200)
    })
  })
})
