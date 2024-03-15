import { before, describe, it, after } from 'node:test'
import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import bcrypt from 'bcryptjs'
import { expect } from 'expect'
import { randEmail, randUuid } from '@ngneat/falso'
import { type TestingModule } from '@nestjs/testing'
import { Role } from '../entities/user.entity.js'
import { globalTestSetup } from '../../../test/setup.js'
import { UserRepository } from '../repositories/user.repository.js'
import { UserSeeder } from './user.seeder.js'

describe('Users', async () => {
  let app: INestApplication
  let moduleRef: TestingModule
  let userSeeder: UserSeeder
  let userRepository: UserRepository

  before(async () => {
    ({ app, moduleRef } = await globalTestSetup())

    userSeeder = moduleRef.get(UserSeeder)
    userRepository = moduleRef.get(UserRepository)
  })

  describe('Get users', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')

      expect(response.status).toBe(401)
    })

    it('should return users with typesense search', async () => {
      const { token, user } = await userSeeder.setupUser()
      const user2 = await userSeeder.setupUser()

      const response = await request(app.getHttpServer())
        .get(`/users?q=${user.email}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body.items.map(item => item.uuid))
        .toContain(user.uuid)
      expect(response.body.items.map(item => item.uuid))
        .not.toContain(user2.user.uuid)
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
