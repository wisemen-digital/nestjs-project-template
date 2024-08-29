import { before, describe, it, after } from 'node:test'
import { randomUUID } from 'crypto'
import request from 'supertest'
import { expect } from 'expect'
import { In, type DataSource } from 'typeorm'
import { NestExpressApplication } from '@nestjs/platform-express'
import { setupTest } from '../../../../utils/test-setup/setup.js'
import { TestUser } from '../../../users/tests/setup-user.type.js'
import { UserEntityBuilder } from '../../../users/tests/user-entity.builder.js'
import { UserSeeder } from '../../../users/tests/user.seeder.js'
import { RoleEntityBuilder } from '../../tests/builders/entities/role-entity.builder.js'
import { RoleSeeder } from '../../tests/seeders/role.seeder.js'
import { TestContext } from '../../../../../test/utils/test-context.js'
import { Role } from '../../entities/role.entity.js'
import { UserRepository } from '../../../users/repositories/user.repository.js'

describe('role', () => {
  let app: NestExpressApplication
  let dataSource: DataSource

  let context: TestContext

  let adminUser: TestUser
  let readonlyUser: TestUser

  let adminRole: Role
  let readonlyRole: Role

  before(async () => {
    ({ app, dataSource } = await setupTest())

    context = new TestContext(dataSource.manager)

    adminRole = await context.getAdminRole()
    adminUser = await context.getAdminUser()
    readonlyUser = await context.getReadonlyUser()
    readonlyRole = await context.getReadonlyRole()
  })

  after(async () => {
    await app.close()
  })

  describe('Delete role', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/roles/${readonlyRole.uuid}`)

      expect(response).toHaveStatus(401)
    })

    it('should return 403 when not authorized', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/roles/${readonlyRole.uuid}`)
        .set('Authorization', `Bearer ${readonlyUser.token}`)

      expect(response).toHaveStatus(403)
    })

    it('should return 400 when deleting admin role', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/roles/${adminRole.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response.body.errors[0].code).toBe('not_editable')
      expect(response.body.errors[0].detail).toBe('Cannot delete this role')

      expect(response).toHaveStatus(400)
    })

    it('should delete role and replace all staff roles to readonly', async () => {
      const role = await new RoleSeeder(dataSource.manager).seedOne(
        new RoleEntityBuilder()
          .withName('should-delete-role-with-staff')
          .build()
      )

      const userSeeder = new UserSeeder(dataSource.manager)
      const user1 = await userSeeder.seedOne(
        new UserEntityBuilder()
          .withEmail(randomUUID() + '@mail.com')
          .withRole(role)
          .build()
      )
      const user2 = await userSeeder.seedOne(
        new UserEntityBuilder()
          .withEmail(randomUUID() + '@mail.com')
          .withRole(role)
          .build()
      )
      const user3 = await userSeeder.seedOne(
        new UserEntityBuilder()
          .withEmail(randomUUID() + '@mail.com')
          .withRole(role)
          .build()
      )

      const users = [user1, user2, user3]

      const response = await request(app.getHttpServer())
        .delete(`/roles/${role.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response).toHaveStatus(200)

      // check if staffs have readonly role
      const usersAfter = await new UserRepository(dataSource.manager).find({
        where: { uuid: In(users.map(user => user.uuid)) },
        relations: { role: true }
      })

      usersAfter.forEach((user) => {
        expect(user.role?.name).toBe('readonly')
      })
    })
  })
})
