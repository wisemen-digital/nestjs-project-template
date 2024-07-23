import { before, describe, it, after } from 'node:test'
import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { expect } from 'expect'
import { randEmail, randUuid } from '@ngneat/falso'
import { type DataSource } from 'typeorm'
import { type TestingModule } from '@nestjs/testing'
import { globalTestSetup, migrateTypesense } from '../../../../test/setup/setup.js'
import { TestContext } from '../../../../test/utils/test-context.js'
import { Permission } from '../../permissions/enums/permission.enum.js'
import { TypesenseCollectionName } from '../../typesense/enums/typesense-collection-index.enum.js'
import { TypesenseCollectionService } from '../../typesense/services/typesense-collection.service.js'
import { UserEntityBuilder } from './builders/entities/user-entity.builder.js'
import { CreateUserDtoBuilder } from './builders/dtos/create-user-dto.builder.js'
import { UserSeeder } from './seeders/user.seeder.js'
import { type SetupUser } from './setup-user.type.js'

describe('Users', async () => {
  let app: INestApplication
  let moduleRef: TestingModule
  let dataSource: DataSource

  let context: TestContext

  let adminUser: SetupUser
  let defaultUser: SetupUser

  before(async () => {
    ({ app, moduleRef, dataSource } = await globalTestSetup())

    context = new TestContext(dataSource.manager)

    adminUser = await context.getAdminUser()
    defaultUser = await context.getDefaultUser()

    await migrateTypesense(moduleRef)

    const typesenseCollectionService = moduleRef.get(TypesenseCollectionService)
    await typesenseCollectionService.importManuallyToTypesense(
      TypesenseCollectionName.USER,
      [adminUser.user, defaultUser.user]
    )
  })

  describe('Get users', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')

      expect(response).toHaveStatus(401)
    })

    it('should return users paginated', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .query({
          pagination: {
            limit: 10,
            offset: 0
          },
          'filter[permissions][0]': Permission.USER_READ
        })

      expect(response).toHaveStatus(200)
      expect(response.body.items.length).toBe(1)
      expect(response.body.meta.total).toBe(1)
      expect(response.body.meta.limit).toBe(10)
      expect(response.body.meta.offset).toBe(0)
      expect(response.body.items[0].role.permissions).toContain(Permission.USER_READ)
      expect(response.body.items[0].uuid).toBe(defaultUser.user.uuid)
    })
  })

  describe('Get user', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${adminUser.user.uuid}`)

      expect(response).toHaveStatus(401)
    })

    it('should return 404 when user not found', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${randUuid()}`)
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response).toHaveStatus(404)
    })

    it('should return 400 when invalid uuid', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${adminUser.user.uuid}s`)
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response).toHaveStatus(400)
    })

    it('should return user', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${adminUser.user.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response).toHaveStatus(200)
    })

    it('should return 403 when user is not admin', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${adminUser.user.uuid}`)
        .set('Authorization', `Bearer ${defaultUser.token}`)

      expect(response).toHaveStatus(403)
    })

    it('should return user when user is admin', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${defaultUser.user.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response).toHaveStatus(200)
    })
  })

  describe('Create user', () => {
    it('should return 400 when email is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({})

      expect(response).toHaveStatus(400)
    })

    it('should return 400 when password is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          email: randEmail()
        })

      expect(response).toHaveStatus(400)
    })

    it('should return 201', async () => {
      const dto = new CreateUserDtoBuilder()
        .withEmail('should-return-201@mail.com')
        .build()

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(dto)

      expect(response).toHaveStatus(201)
    })
  })

  describe('Update user', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .post(`/users/${randUuid()}`)
        .send({})

      expect(response).toHaveStatus(401)
    })

    it('should return 201 when user is self', async () => {
      const response = await request(app.getHttpServer())
        .post(`/users/${defaultUser.user.uuid}`)
        .set('Authorization', `Bearer ${defaultUser.token}`)
        .send({
          firstName: 'John',
          lastName: 'Doe'
        })

      expect(response).toHaveStatus(201)
    })

    it('should return 404 when user not found', async () => {
      const response = await request(app.getHttpServer())
        .post(`/users/${randUuid()}`)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({})

      expect(response).toHaveStatus(404)
    })

    it('should return 403 when user is not admin', async () => {
      const response = await request(app.getHttpServer())
        .post(`/users/${adminUser.user.uuid}`)
        .set('Authorization', `Bearer ${defaultUser.token}`)
        .send({
          firstName: 'John',
          lastName: 'Doe'
        })

      expect(response).toHaveStatus(403)
    })

    it('should return 201 when user is admin', async () => {
      const response = await request(app.getHttpServer())
        .post(`/users/${defaultUser.user.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({
          firstName: 'John',
          lastName: 'Doe'
        })

      expect(response).toHaveStatus(201)
      expect(response.body.firstName).toBe('John')
    })
  })

  describe('Delete user', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/users/${randUuid()}`)

      expect(response).toHaveStatus(401)
    })

    it('should return 404 when user not found', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/users/${randUuid()}`)
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response).toHaveStatus(404)
    })

    it('should return 403 when user is not admin', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/users/${adminUser.user.uuid}`)
        .set('Authorization', `Bearer ${defaultUser.token}`)

      expect(response).toHaveStatus(403)
    })

    it('should return 200 when user is admin', async () => {
      const user = await new UserSeeder(dataSource.manager).seedOne(
        new UserEntityBuilder()
          .withEmail(randEmail())
          .withPassword('Lol123')
          .build()
      )

      const response = await request(app.getHttpServer())
        .delete(`/users/${user.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response).toHaveStatus(200)
    })

    it('should return 200 when user is self', async () => {
      const randomUser = await context.getDefaultUser()

      const response = await request(app.getHttpServer())
        .delete(`/users/${randomUser.user.uuid}`)
        .set('Authorization', `Bearer ${randomUser.token}`)

      expect(response).toHaveStatus(200)
    })
  })

  describe('Change password', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .post(`/users/${randUuid()}/password`)
        .send({})

      expect(response).toHaveStatus(401)
    })

    it('should return 404 when user not found', async () => {
      const response = await request(app.getHttpServer())
        .post(`/users/${randUuid()}/password`)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({
          password: 'newPassword',
          oldPassword: 'password'
        })

      expect(response).toHaveStatus(404)
    })

    it('should return 403 when user is not admin', async () => {
      const response = await request(app.getHttpServer())
        .post(`/users/${adminUser.user.uuid}/password`)
        .set('Authorization', `Bearer ${defaultUser.token}`)
        .send({
          password: 'newPassword',
          oldPassword: 'password'
        })
      expect(response).toHaveStatus(403)
    })

    it('should return 201 when user is self', async () => {
      const response = await request(app.getHttpServer())
        .post(`/users/${defaultUser.user.uuid}/password`)
        .set('Authorization', `Bearer ${defaultUser.token}`)
        .send({
          oldPassword: 'Password123',
          password: 'newPassword'
        })

      expect(response).toHaveStatus(201)
    })

    it('should return 201 when admin can change other users password', async () => {
      const oldPassword = 'Password123'
      const user = await new UserSeeder(dataSource.manager).seedOne(
        new UserEntityBuilder()
          .withEmail(randEmail())
          .withPassword(oldPassword)
          .build()
      )

      const response = await request(app.getHttpServer())
        .post(`/users/${user.uuid}/password`)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({
          password: 'newPassword',
          oldPassword
        })

      expect(response).toHaveStatus(201)
    })

    it('should return 403 when non-admin user wants to change other users password', async () => {
      const oldPassword = 'Password123'
      const user = await new UserSeeder(dataSource.manager).seedOne(
        new UserEntityBuilder()
          .withEmail(randEmail())
          .withPassword(oldPassword)
          .build()
      )

      const response = await request(app.getHttpServer())
        .post(`/users/${user.uuid}/password`)
        .set('Authorization', `Bearer ${defaultUser.token}`)
        .send({
          password: 'newPassword',
          oldPassword
        })

      expect(response).toHaveStatus(403)
    })

    it('should return 400 when password is missing', async () => {
      const randomUser = await context.getDefaultUser()

      const response = await request(app.getHttpServer())
        .post(`/users/${randomUser.user.uuid}/password`)
        .set('Authorization', `Bearer ${randomUser.token}`)
        .send({})

      expect(response).toHaveStatus(400)
    })
  })

  after(async () => {
    await app.close()
  })
})
