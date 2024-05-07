import { before, describe, it, after } from 'node:test'
import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { expect } from 'expect'
import { randEmail, randUuid } from '@ngneat/falso'
import { type DataSource } from 'typeorm'
import { type Role } from '../../roles/entities/role.entity.js'
import { RoleSeeder } from '../../roles/tests/seeders/role.seeder.js'
import { TokenSeeder } from '../../auth/tests/seeders/token.seeder.js'
import { type Client } from '../../auth/entities/client.entity.js'
import { globalTestSetup } from '../../../../test/setup/setup.js'
import { ClientSeeder } from '../../auth/tests/seeders/client.seeder.js'
import { UserEntityBuilder } from './builders/entities/user-entity.builder.js'
import { CreateUserDtoBuilder } from './builders/dtos/create-user-dto.builder.js'
import { UserSeeder } from './seeders/user.seeder.js'
import { type SetupUser } from './setup-user.type.js'

describe('Users', async () => {
  let app: INestApplication
  let dataSource: DataSource

  let client: Client

  let adminRole: Role
  let readonlyRole: Role

  let adminUser: SetupUser
  let readonlyUser: SetupUser

  before(async () => {
    ({ app, dataSource } = await globalTestSetup())

    const roleSeeder = new RoleSeeder(dataSource.manager)
    const clientSeeder = new ClientSeeder(dataSource.manager)
    const userSeeder = new UserSeeder(dataSource.manager)

    adminRole = await roleSeeder.seedAdminRole()
    readonlyRole = await roleSeeder.seedReadonlyRole()

    client = await clientSeeder.getTestClient()

    adminUser = await userSeeder.setup(
      client,
      new UserEntityBuilder()
        .withEmail(randEmail())
        .withRole(adminRole)
        .build()
    )
    readonlyUser = await userSeeder.setup(
      client,
      new UserEntityBuilder()
        .withEmail(randEmail())
        .withRole(readonlyRole)
        .build()
    )
  })

  describe('Get users', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')

      expect(response).toHaveStatus(401)
    })

    it('should return users', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response).toHaveStatus(200)
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
        .set('Authorization', `Bearer ${readonlyUser.token}`)

      expect(response).toHaveStatus(403)
    })

    it('should return user when user is admin', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${readonlyUser.user.uuid}`)
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
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(
          new CreateUserDtoBuilder()
            .withEmail('should-return-201@mail.com')
            .build()
        )

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
        .post(`/users/${readonlyUser.user.uuid}`)
        .set('Authorization', `Bearer ${readonlyUser.token}`)
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
        .set('Authorization', `Bearer ${readonlyUser.token}`)
        .send({
          firstName: 'John',
          lastName: 'Doe'
        })

      expect(response).toHaveStatus(403)
    })

    it('should return 201 when user is admin', async () => {
      const response = await request(app.getHttpServer())
        .post(`/users/${readonlyUser.user.uuid}`)
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
        .set('Authorization', `Bearer ${readonlyUser.token}`)

      expect(response).toHaveStatus(403)
    })

    it('should return 200 when user is admin', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/users/${readonlyUser.user.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response).toHaveStatus(200)
    })

    it('should return 200 when user is self', async () => {
      const user = await new UserSeeder(dataSource.manager).seedOne(
        new UserEntityBuilder()
          .withEmail(randEmail())
          .build()
      )
      const token = await new TokenSeeder(dataSource.manager).seedOne(user, client)

      const response = await request(app.getHttpServer())
        .delete(`/users/${user.uuid}`)
        .set('Authorization', `Bearer ${token}`)

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
        .set('Authorization', `Bearer ${readonlyUser.token}`)
        .send({
          password: 'newPassword',
          oldPassword: 'password'
        })
      expect(response).toHaveStatus(403)
    })

    it('should return 201 when user is self', async () => {
      const oldPassword = 'Password123'
      const user = await new UserSeeder(dataSource.manager).seedOne(
        new UserEntityBuilder()
          .withEmail(randEmail())
          .withPassword(oldPassword)
          .build()
      )
      const token = await new TokenSeeder(dataSource.manager).seedOne(user, client)

      const response = await request(app.getHttpServer())
        .post(`/users/${user.uuid}/password`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          password: 'newPassword',
          oldPassword
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
        .set('Authorization', `Bearer ${readonlyUser.token}`)
        .send({
          password: 'newPassword',
          oldPassword
        })

      expect(response).toHaveStatus(403)
    })

    it('should return 400 when password is missing', async () => {
      const user = await new UserSeeder(dataSource.manager).seedOne(
        new UserEntityBuilder()
          .withEmail(randEmail())
          .build()
      )
      const token = await new TokenSeeder(dataSource.manager).seedOne(user, client)

      const response = await request(app.getHttpServer())
        .post(`/users/${user.uuid}/password`)
        .set('Authorization', `Bearer ${token}`)
        .send({})

      expect(response).toHaveStatus(400)
    })
  })

  after(async () => {
    await app.close()
  })
})
