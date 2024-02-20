import { before, describe, it, after } from 'node:test'
import { type INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import bcrypt from 'bcryptjs'
import { expect } from 'expect'
import { randEmail, randUuid } from '@ngneat/falso'
import { HttpAdapterHost } from '@nestjs/core'
import { AppModule } from '../../../app.module.js'
import { UserRepository } from '../repositories/user.repository.js'
import { HttpExceptionFilter } from '../../../utils/Exceptions/http-exception.filter.js'
import { type Role } from '../../roles/entities/role.entity.js'
import { RoleSeederModule } from '../../roles/tests/role-seeder.module.js'
import { RoleSeeder } from '../../roles/tests/role.seeder.js'
import { UserSeeder } from './user.seeder.js'
import { UserSeederModule } from './user-seeder.module.js'
import { type SetupUserType } from './setup-user.type.js'

describe('Users', async () => {
  let app: INestApplication
  let userSeeder: UserSeeder
  let roleSeeder: RoleSeeder
  let userRepository: UserRepository

  let adminRole: Role
  let readonlyRole: Role

  let adminUser: SetupUserType
  let readonlyUser: SetupUserType

  before(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AppModule,
        UserSeederModule,
        RoleSeederModule
      ]
    }).compile()

    app = moduleRef.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true
        }
      })
    )

    const httpAdapterHost = app.get(HttpAdapterHost)
    app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost))

    userSeeder = moduleRef.get(UserSeeder)
    roleSeeder = moduleRef.get(RoleSeeder)
    userRepository = moduleRef.get(UserRepository)
    await app.init()

    adminRole = await roleSeeder.createAdminRole()
    readonlyRole = await roleSeeder.createReadonlyRole()

    adminUser = await userSeeder.setupUser({ roleUuid: adminRole.uuid })
    readonlyUser = await userSeeder.setupUser({ roleUuid: readonlyRole.uuid })
  })

  describe('Get users', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')

      expect(response.status).toBe(401)
    })

    it('should return users', async () => {
      await userSeeder.createRandomUser()

      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response.status).toBe(200)
    })
  })

  describe('Get user', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${adminUser.user.uuid}`)

      expect(response.status).toBe(401)
    })

    it('should return 404 when user not found', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${randUuid()}`)
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response.status).toBe(404)
    })

    it('should return 400 when invalid uuid', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${adminUser.user.uuid}s`)
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response.status).toBe(400)
    })

    it('should return user', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${adminUser.user.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response.status).toBe(200)
    })

    it('should return 403 when user is not admin', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${adminUser.user.uuid}`)
        .set('Authorization', `Bearer ${readonlyUser.token}`)

      expect(response.status).toBe(403)
    })

    it('should return user when user is admin', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${readonlyUser.user.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response.status).toBe(200)
    })
  })

  describe('Create user', () => {
    it('should return 400 when email is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({})

      expect(response.status).toBe(400)
    })

    it('should return 400 when password is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          email: randEmail()
        })

      expect(response.status).toBe(400)
    })

    it('should return 201', async () => {
      const dto = await userSeeder.createRandomUserDto()

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(dto)

      expect(response.status).toBe(201)
    })
  })

  describe('Update user', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .post(`/users/${randUuid()}`)
        .send({})

      expect(response.status).toBe(401)
    })

    it('should return 201 when user is self', async () => {
      const response = await request(app.getHttpServer())
        .post(`/users/${readonlyUser.user.uuid}`)
        .set('Authorization', `Bearer ${readonlyUser.token}`)
        .send({
          firstName: 'John',
          lastName: 'Doe'
        })

      expect(response.status).toBe(201)
    })

    it('should return 404 when user not found', async () => {
      const response = await request(app.getHttpServer())
        .post(`/users/${randUuid()}`)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({})

      expect(response.status).toBe(404)
    })

    it('should return 403 when user is not admin', async () => {
      const response = await request(app.getHttpServer())
        .post(`/users/${adminUser.user.uuid}`)
        .set('Authorization', `Bearer ${readonlyUser.token}`)
        .send({
          firstName: 'John',
          lastName: 'Doe'
        })

      expect(response.status).toBe(403)
    })

    it('should return 201 when user is admin', async () => {
      const response = await request(app.getHttpServer())
        .post(`/users/${readonlyUser.user.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({
          firstName: 'John',
          lastName: 'Doe'
        })

      expect(response.status).toBe(201)
      expect(response.body.firstName).toBe('John')
    })
  })

  describe('Delete user', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/users/${randUuid()}`)

      expect(response.status).toBe(401)
    })

    it('should return 404 when user not found', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/users/${randUuid()}`)
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response.status).toBe(404)
    })

    it('should return 403 when user is not admin', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/users/${adminUser.user.uuid}`)
        .set('Authorization', `Bearer ${readonlyUser.token}`)

      expect(response.status).toBe(403)
    })

    it('should return 200 when user is admin', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/users/${readonlyUser.user.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response.status).toBe(200)
    })

    it('should return 200 when user is self', async () => {
      const { user, token } = await userSeeder.setupUser()

      const response = await request(app.getHttpServer())
        .delete(`/users/${user.uuid}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
    })
  })

  describe('Change password', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .post(`/users/${randUuid()}/password`)
        .send({})

      expect(response.status).toBe(401)
    })

    it('should return 404 when user not found', async () => {
      const response = await request(app.getHttpServer())
        .post(`/users/${randUuid()}/password`)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({
          password: 'newPassword',
          oldPassword: 'password'
        })

      expect(response.status).toBe(404)
    })

    it('should return 403 when user is not admin', async () => {
      const response = await request(app.getHttpServer())
        .post(`/users/${adminUser.user.uuid}/password`)
        .set('Authorization', `Bearer ${readonlyUser.token}`)
        .send({
          password: 'newPassword',
          oldPassword: 'password'
        })
      expect(response.status).toBe(403)
    })

    it('should return 201 when user is self', async () => {
      const { user, token } = await userSeeder.setupUser()

      user.password = await bcrypt.hash('password', 10)

      await userRepository.save(user)

      const response = await request(app.getHttpServer())
        .post(`/users/${user.uuid}/password`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          password: 'newPassword',
          oldPassword: 'password'
        })

      expect(response.status).toBe(201)
    })

    it('should return 201 when admin can change other users password', async () => {
      const user = await userSeeder.createRandomUser()

      user.password = await bcrypt.hash('password', 10)

      await userRepository.save(user, { reload: true })

      const response = await request(app.getHttpServer())
        .post(`/users/${user.uuid}/password`)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({
          password: 'newPassword',
          oldPassword: 'password'
        })

      expect(response.status).toBe(201)
    })

    it('should return 403 when non-admin user wants to change other users password', async () => {
      const user = await userSeeder.createRandomUser()

      user.password = await bcrypt.hash('password', 10)

      await userRepository.save(user, { reload: true })

      const response = await request(app.getHttpServer())
        .post(`/users/${user.uuid}/password`)
        .set('Authorization', `Bearer ${readonlyUser.token}`)
        .send({
          password: 'newPassword',
          oldPassword: 'password'
        })

      expect(response.status).toBe(403)
    })

    it('should return 400 when password is missing', async () => {
      const { user, token } = await userSeeder.setupUser()

      const response = await request(app.getHttpServer())
        .post(`/users/${user.uuid}/password`)
        .set('Authorization', `Bearer ${token}`)
        .send({})

      expect(response.status).toBe(400)
    })
  })

  after(async () => {
    await app.close()
  })
})
