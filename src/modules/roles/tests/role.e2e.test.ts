import { before, describe, it, after } from 'node:test'
import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { expect } from 'expect'
import { randEmail } from '@ngneat/falso'
import { type DataSource, In } from 'typeorm'
import { type Role } from '../entities/role.entity.js'
import { UserRepository } from '../../users/repositories/user.repository.js'
import { Permission } from '../../permissions/permission.enum.js'
import { UserSeeder } from '../../users/tests/seeders/user.seeder.js'
import { UserEntityBuilder } from '../../users/tests/builders/entities/user-entity.builder.js'
import { type User } from '../../users/entities/user.entity.js'
import { TokenSeeder } from '../../auth/tests/seeders/token.seeder.js'
import { globalTestSetup } from '../../../../test/setup/setup.js'
import { ClientSeeder } from '../../auth/tests/seeders/client.seeder.js'
import { RoleSeeder } from './seeders/role.seeder.js'
import { RoleEntityBuilder } from './builders/entities/role-entity.builder.js'
import { CreateRoleDtoBuilder } from './builders/dtos/create-role-dto.builder.js'

describe('Roles', async () => {
  let app: INestApplication

  let dataSource: DataSource

  let adminRole: Role
  let readonlyRole: Role

  let adminUser: User
  let readonlyUser: User

  let adminToken: string
  let readonlyToken: string

  before(async () => {
    ({ app, dataSource } = await globalTestSetup())

    const roleSeeder = new RoleSeeder(dataSource.manager)
    adminRole = await roleSeeder.seedAdminRole()
    readonlyRole = await roleSeeder.seedReadonlyRole()

    const userSeeder = new UserSeeder(dataSource.manager)
    adminUser = await userSeeder.seedOne(
      new UserEntityBuilder()
        .withEmail(randEmail())
        .withRole(adminRole)
        .build()
    )
    readonlyUser = await userSeeder.seedOne(
      new UserEntityBuilder()
        .withEmail(randEmail())
        .withRole(readonlyRole)
        .build()
    )

    const tokenSeeder = new TokenSeeder(dataSource.manager)
    const client = await new ClientSeeder(dataSource.manager).getTestClient()

    adminToken = await tokenSeeder.seedOne(adminUser, client)
    readonlyToken = await tokenSeeder.seedOne(readonlyUser, client)
  })

  after(async () => {
    await app.close()
  })

  describe('Get roles', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/roles')

      expect(response.status).toBe(401)
    })

    it('should return 403 when not authorized', async () => {
      const response = await request(app.getHttpServer())
        .get('/roles')
        .set('Authorization', `Bearer ${readonlyToken}`)

      expect(response.status).toBe(403)
    })

    it('should return roles when admin', async () => {
      const response = await request(app.getHttpServer())
        .get('/roles')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
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
      const client = await new ClientSeeder(dataSource.manager).getTestClient()
      const token = await new TokenSeeder(dataSource.manager).seedOne(user, client)

      const response = await request(app.getHttpServer())
        .get('/roles')
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
    })
  })

  describe('Create role', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .post('/roles')
        .send(
          new CreateRoleDtoBuilder()
            .withName('should-return-401-when-not-authenticated')
            .build()
        )

      expect(response.status).toBe(401)
    })

    it('should return 403 when not authorized', async () => {
      const response = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${readonlyToken}`)
        .send(
          new CreateRoleDtoBuilder()
            .build()
        )

      expect(response.status).toBe(403)
    })

    it('should create role', async () => {
      const dto = new CreateRoleDtoBuilder()
        .withName('should-create-role-test')
        .build()

      const response = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(dto)

      expect(response.status).toBe(201)
      expect(response.body.name).toBe(dto.name)
      expect(response.body.permissions).toEqual([])
    })

    it('should create role not a second time', async () => {
      const dto = new CreateRoleDtoBuilder().build()

      await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(dto)

      const response = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(dto)

      expect(response.status).toBe(409)
      expect(response.body.errors.find(error => error.code === 'already_exists')).not.toBeUndefined()
    })

    it('should not create role with invalid name', async () => {
      const response = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(
          new CreateRoleDtoBuilder()
            .withName('')
            .build()
        )

      expect(response.status).toBe(400)
    })
  })

  describe('Update role', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .post(`/roles/${readonlyRole.uuid}`)
        .send(
          new CreateRoleDtoBuilder()
            .build()
        )

      expect(response.status).toBe(401)
    })

    it('should return 403 when not authorized', async () => {
      const response = await request(app.getHttpServer())
        .post(`/roles/${readonlyRole.uuid}`)
        .set('Authorization', `Bearer ${readonlyToken}`)
        .send(
          new CreateRoleDtoBuilder()
            .build()
        )

      expect(response.status).toBe(403)
    })

    it('should update role', async () => {
      const role = await new RoleSeeder(dataSource.manager).seedOne(
        new RoleEntityBuilder()
          .withName('should-update-role')
          .build()
      )

      const response = await request(app.getHttpServer())
        .post(`/roles/${role.uuid}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(
          new CreateRoleDtoBuilder()
            .withName('should-update-role-test')
            .build()
        )

      expect(response.status).toBe(201)
      expect(response.body.name).not.toBe(role.name)
    })

    it('should not update role with invalid name', async () => {
      const response = await request(app.getHttpServer())
        .post(`/roles/${readonlyRole.uuid}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(
          new CreateRoleDtoBuilder()
            .withName('')
            .build()
        )

      expect(response.status).toBe(400)
    })
  })

  describe('Delete role', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/roles/${readonlyRole.uuid}`)

      expect(response.status).toBe(401)
    })

    it('should return 403 when not authorized', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/roles/${readonlyRole.uuid}`)
        .set('Authorization', `Bearer ${readonlyToken}`)

      expect(response.status).toBe(403)
    })

    it('should return 400 when deleting admin role', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/roles/${adminRole.uuid}`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.body.errors[0].code).toBe('not_editable')
      expect(response.body.errors[0].detail).toBe('Cannot delete this role')

      expect(response.status).toBe(400)
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
          .withEmail(randEmail())
          .withRole(role)
          .build()
      )
      const user2 = await userSeeder.seedOne(
        new UserEntityBuilder()
          .withEmail(randEmail())
          .withRole(role)
          .build()
      )
      const user3 = await userSeeder.seedOne(
        new UserEntityBuilder()
          .withEmail(randEmail())
          .withRole(role)
          .build()
      )

      const users = [user1, user2, user3]

      const response = await request(app.getHttpServer())
        .delete(`/roles/${role.uuid}`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)

      // check if staffs have readonly role
      const usersAfter = await new UserRepository(dataSource.manager).find({
        where: { uuid: In(users.map(user => user.uuid)) },
        relations: { role: true }
      })

      usersAfter.forEach(user => {
        expect(user.role?.name).toBe('readonly')
      })
    })
  })
})
