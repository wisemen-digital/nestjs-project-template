import { before, describe, it, after } from 'node:test'
import { type INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import bcrypt from 'bcryptjs'
import { expect } from 'expect'
import { randEmail, randUuid } from '@ngneat/falso'
import { HttpAdapterHost } from '@nestjs/core'
import { AppModule } from '../../../app.module.js'
import { Role } from '../entities/user.entity.js'
import { UserRepository } from '../repositories/user.repository.js'
import { base64JSON } from '../../../utils/conversion/base64-json.js'
import { HttpExceptionFilter } from '../../../utils/exceptions/http-exception.filter.js'
import { UserSeeder } from './user.seeder.js'
import { UserSeederModule } from './user-seeder.module.js'

describe('Users', async () => {
  let app: INestApplication
  let userSeeder: UserSeeder
  let userRepository: UserRepository

  before(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AppModule,
        UserSeederModule
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
    userRepository = moduleRef.get(UserRepository)
    await app.init()
  })

  describe('Get users', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')

      expect(response.status).toBe(401)
    })

    it('should return users', async () => {
      await userSeeder.createRandomUser()

      const { token } = await userSeeder.setupUser()

      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body.items.length).toBe(25)
    })

    it('should return users with pagination limit', async () => {
      await userSeeder.createRandomUser()

      const { token } = await userSeeder.setupUser()

      const query = base64JSON(
        { pagination: { limit: 5, page: 0 } }
      )

      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .query({ q: query })

      expect(response.status).toBe(200)
      expect(response.body.items.length).toBe(5)
    })

    it('should return 400 when invalid query', async () => {
      await userSeeder.createRandomUser()

      const { token } = await userSeeder.setupUser()

      const query = base64JSON(
        { p: { limit: 5, page: 0 } }
      )

      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .query({ q: query })

      expect(response.status).toBe(400)
    })
  })

  describe('Get user', () => {
    it('should return 401 when not authenticated', async () => {
      const { user } = await userSeeder.setupUser()

      const response = await request(app.getHttpServer())
        .get(`/users/${user.uuid}`)

      expect(response.status).toBe(401)
    })

    it('should return 404 when user not found', async () => {
      const { token } = await userSeeder.setupUser(Role.ADMIN)

      const response = await request(app.getHttpServer())
        .get(`/users/${randUuid()}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(404)
    })

    it('should return 400 when invalid uuid', async () => {
      const { user, token } = await userSeeder.setupUser(Role.ADMIN)

      const response = await request(app.getHttpServer())
        .get(`/users/${user.uuid}s`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(400)
    })

    it('should return user', async () => {
      const { user, token } = await userSeeder.setupUser()

      const response = await request(app.getHttpServer())
        .get(`/users/${user.uuid}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
    })

    it('should return 403 when user is not admin', async () => {
      const { token } = await userSeeder.setupUser()

      const user = await userSeeder.createRandomUser()

      const response = await request(app.getHttpServer())
        .get(`/users/${user.uuid}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(403)
    })

    it('should return user when user is admin', async () => {
      const { token } = await userSeeder.setupUser(Role.ADMIN)

      const user = await userSeeder.createRandomUser()

      const response = await request(app.getHttpServer())
        .get(`/users/${user.uuid}`)
        .set('Authorization', `Bearer ${token}`)

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
      const { user, token } = await userSeeder.setupUser()

      const response = await request(app.getHttpServer())
        .post(`/users/${user.uuid}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'John',
          lastName: 'Doe'
        })

      expect(response.status).toBe(201)
    })

    it('should return 404 when user not found', async () => {
      const { token } = await userSeeder.setupUser(Role.ADMIN)

      const response = await request(app.getHttpServer())
        .post(`/users/${randUuid()}`)
        .set('Authorization', `Bearer ${token}`)
        .send({})

      expect(response.status).toBe(404)
    })

    it('should return 403 when user is not admin', async () => {
      const { token } = await userSeeder.setupUser()

      const user = await userSeeder.createRandomUser()

      const response = await request(app.getHttpServer())
        .post(`/users/${user.uuid}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'John',
          lastName: 'Doe'
        })

      expect(response.status).toBe(403)
    })

    it('should return 201 when user is admin', async () => {
      const { token } = await userSeeder.setupUser(Role.ADMIN)

      const user = await userSeeder.createRandomUser()

      const response = await request(app.getHttpServer())
        .post(`/users/${user.uuid}`)
        .set('Authorization', `Bearer ${token}`)
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
      const { token } = await userSeeder.setupUser(Role.ADMIN)

      const response = await request(app.getHttpServer())
        .delete(`/users/${randUuid()}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(404)
    })

    it('should return 403 when user is not admin', async () => {
      const { token } = await userSeeder.setupUser()

      const user = await userSeeder.createRandomUser()

      const response = await request(app.getHttpServer())
        .delete(`/users/${user.uuid}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(403)
    })

    it('should return 200 when user is admin', async () => {
      const { token } = await userSeeder.setupUser(Role.ADMIN)

      const user = await userSeeder.createRandomUser()

      const response = await request(app.getHttpServer())
        .delete(`/users/${user.uuid}`)
        .set('Authorization', `Bearer ${token}`)

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
      const { token } = await userSeeder.setupUser(Role.ADMIN)

      const response = await request(app.getHttpServer())
        .post(`/users/${randUuid()}/password`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          password: 'newPassword',
          oldPassword: 'password'
        })

      expect(response.status).toBe(404)
    })

    it('should return 403 when user is not admin', async () => {
      const { token } = await userSeeder.setupUser()

      const user = await userSeeder.createRandomUser()

      const response = await request(app.getHttpServer())
        .post(`/users/${user.uuid}/password`)
        .set('Authorization', `Bearer ${token}`)
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
      const { token } = await userSeeder.setupUser(Role.ADMIN)

      const user = await userSeeder.createRandomUser()

      user.password = await bcrypt.hash('password', 10)

      await userRepository.save(user, { reload: true })

      const response = await request(app.getHttpServer())
        .post(`/users/${user.uuid}/password`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          password: 'newPassword',
          oldPassword: 'password'
        })

      expect(response.status).toBe(201)
    })

    it('should return 403 when non-admin user wants to change other users password', async () => {
      const { token } = await userSeeder.setupUser(Role.USER)

      const user = await userSeeder.createRandomUser()

      user.password = await bcrypt.hash('password', 10)

      await userRepository.save(user, { reload: true })

      const response = await request(app.getHttpServer())
        .post(`/users/${user.uuid}/password`)
        .set('Authorization', `Bearer ${token}`)
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
