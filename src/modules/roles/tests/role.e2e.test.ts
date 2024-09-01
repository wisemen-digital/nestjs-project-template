import { before, describe, it, after } from 'node:test'
import { randomUUID } from 'node:crypto'
import request from 'supertest'
import { expect } from 'expect'
import { type DataSource, In } from 'typeorm'
import { NestExpressApplication } from '@nestjs/platform-express'
import type { Role } from '../entities/role.entity.js'
import { UserRepository } from '../../users/repositories/user.repository.js'
import { Permission } from '../../permissions/permission.enum.js'
import { UserSeeder } from '../../users/tests/user.seeder.js'
import { UserEntityBuilder } from '../../users/tests/user-entity.builder.js'
import { setupTest } from '../../../utils/test-setup/setup.js'
import { TestContext } from '../../../../test/utils/test-context.js'
import type { TestUser } from '../../users/tests/setup-user.type.js'
import { RoleSeeder } from './seeders/role.seeder.js'
import { RoleEntityBuilder } from './builders/entities/role-entity.builder.js'
import { CreateRoleDtoBuilder } from './builders/dtos/create-role-dto.builder.js'

describe('Roles', () => {
  let app: NestExpressApplication
  let dataSource: DataSource

  let context: TestContext

  let adminRole: Role
  let readonlyRole: Role

  let adminUser: TestUser
  let readonlyUser: TestUser

  before(async () => {
    ({ app, dataSource, context } = await setupTest())

    adminRole = await context.getAdminRole()
    readonlyRole = await context.getReadonlyRole()

    adminUser = await context.getAdminUser()
    readonlyUser = await context.getReadonlyUser()
  })

  after(async () => {
    await app.close()
  })

  describe('Get roles', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/roles')

      expect(response).toHaveStatus(401)
    })

    it('should return 403 when not authorized', async () => {
      const response = await request(app.getHttpServer())
        .get('/roles')
        .set('Authorization', `Bearer ${readonlyUser.token}`)

      expect(response).toHaveStatus(403)
    })

    it('should return roles when admin', async () => {
      const response = await request(app.getHttpServer())
        .get('/roles')
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response).toHaveStatus(200)
    })

    it('should return roles when having ROLE_READ permission', async () => {
      const role = await new RoleSeeder(dataSource.manager).seedOne(
        new RoleEntityBuilder()
          .withName('should-return-roles-when-having-role-read-permission')
          .withPermissions([Permission.ROLE_READ])
          .build()
      )
      const user = await new UserSeeder(dataSource.manager).seedOne(
        new UserEntityBuilder()
          .withRole(role)
          .build()
      )

      const token = context.getToken(user)

      const response = await request(app.getHttpServer())
        .get('/roles')
        .set('Authorization', `Bearer ${token}`)

      expect(response).toHaveStatus(200)
    })
  })

  describe('Create role', () => {
    it('should return 401 when not authenticated', async () => {
      const roleDto = new CreateRoleDtoBuilder()
        .withName('should-return-401-when-not-authenticated')
        .build()

      const response = await request(app.getHttpServer())
        .post('/roles')
        .send(roleDto)

      expect(response).toHaveStatus(401)
    })

    it('should return 403 when not authorized', async () => {
      const roleDto = new CreateRoleDtoBuilder()
        .build()

      const response = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${readonlyUser.token}`)
        .send(roleDto)

      expect(response).toHaveStatus(403)
    })

    it('should create role', async () => {
      const roleDto = new CreateRoleDtoBuilder()
        .withName('should-create-role-test')
        .build()

      const response = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(roleDto)

      expect(response).toHaveStatus(201)
      expect(response.body.name).toBe(roleDto.name)
      expect(response.body.permissions).toEqual([])
    })

    it('should create role not a second time', async () => {
      const roleDto = new CreateRoleDtoBuilder().build()

      await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(roleDto)

      const response = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(roleDto)

      expect(response).toHaveStatus(409)
      expect(response).toHaveErrorCode('role_name_already_in_use')
    })

    it('should not create role with invalid name', async () => {
      const roleDto = new CreateRoleDtoBuilder()
        .withName('')
        .build()

      const response = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(roleDto)

      expect(response).toHaveStatus(400)
    })
  })

  describe('Update role', () => {
    it('should return 401 when not authenticated', async () => {
      const roleDto = new CreateRoleDtoBuilder()
        .build()

      const response = await request(app.getHttpServer())
        .post(`/roles/${readonlyRole.uuid}`)
        .send(roleDto)

      expect(response).toHaveStatus(401)
    })

    it('should return 403 when not authorized', async () => {
      const roleDto = new CreateRoleDtoBuilder()
        .build()

      const response = await request(app.getHttpServer())
        .post(`/roles/${readonlyRole.uuid}`)
        .set('Authorization', `Bearer ${readonlyUser.token}`)
        .send(roleDto)

      expect(response).toHaveStatus(403)
    })

    it('should update role', async () => {
      const role = await new RoleSeeder(dataSource.manager).seedOne(
        new RoleEntityBuilder()
          .withName('should-update-role')
          .build()
      )

      const roleDto = new CreateRoleDtoBuilder()
        .withName('should-update-role-test')
        .build()

      const response = await request(app.getHttpServer())
        .post(`/roles/${role.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(roleDto)

      expect(response).toHaveStatus(201)
      expect(response.body.name).not.toBe(role.name)
    })

    it('should not update role with invalid name', async () => {
      const roleDto = new CreateRoleDtoBuilder()
        .withName('')
        .build()

      const response = await request(app.getHttpServer())
        .post(`/roles/${readonlyRole.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(roleDto)

      expect(response).toHaveStatus(400)
    })
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

      expect(response.body.errors[0].code).toBe('role_not_editable')
      expect(response.body.errors[0].detail).toBe('This role is not editable')

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
