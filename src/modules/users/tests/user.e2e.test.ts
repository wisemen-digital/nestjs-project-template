import { before, describe, it, after } from 'node:test'
import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import bcrypt from 'bcryptjs'
import { expect } from 'expect'
import { randEmail, randUuid } from '@ngneat/falso'
import { type TestingModule } from '@nestjs/testing'
import { UserRepository } from '../repositories/user.repository.js'
import { type Role } from '../../roles/entities/role.entity.js'
import { RoleSeeder } from '../../roles/tests/role.seeder.js'
import { setupTest } from '../../../../test/setup/setup.js'
import { UserSeeder } from './user.seeder.js'
import { type SetupUserType } from './setup-user.type.js'

describe('Users', async () => {
  let app: INestApplication
  let moduleRef: TestingModule

  let userSeeder: UserSeeder
  let roleSeeder: RoleSeeder
  let userRepository: UserRepository

  let adminRole: Role
  let readonlyRole: Role

  let adminUser: SetupUserType
  let readonlyUser: SetupUserType

  before(async () => {
    ({ app, moduleRef } = await setupTest())

    userSeeder = moduleRef.get(UserSeeder)
    roleSeeder = moduleRef.get(RoleSeeder)
    userRepository = moduleRef.get(UserRepository)

    adminRole = await roleSeeder.createAdminRole()
    readonlyRole = await roleSeeder.createReadonlyRole()

    adminUser = await userSeeder.setupUser({
      roleUuid: adminRole.uuid,
      email: roleSeeder.createRandomEmail()
    })
    readonlyUser = await userSeeder.setupUser({
      roleUuid: readonlyRole.uuid,
      email: roleSeeder.createRandomEmail()
    })
  })

  describe('Get users', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')

      expect(response.status).toBe(401)
    })

    it('should return users', async () => {
      await userSeeder.createRandomUser({ email: roleSeeder.createRandomEmail() })

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
      const dto = await userSeeder.createRandomUserDto({ email: roleSeeder.createRandomEmail() })

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
      const { user, token } = await userSeeder.setupUser({ email: roleSeeder.createRandomEmail() })

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
      const { user, token } = await userSeeder.setupUser({ email: roleSeeder.createRandomEmail() })

      user.password = await bcrypt.hash('password', 10)

      await userRepository.save(user)

      const response = await request(app.getHttpServer())
        .post(`/users/${user.uuid}/password`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          password: 'newPassword',
          oldPassword: 'password'
        })

      expect(response).toHaveStatus(201)
    })

    it('should return 201 when admin can change other users password', async () => {
      const user = await userSeeder.createRandomUser({ email: roleSeeder.createRandomEmail() })

      user.password = await bcrypt.hash('password', 10)

      await userRepository.save(user, { reload: true })

      const response = await request(app.getHttpServer())
        .post(`/users/${user.uuid}/password`)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({
          password: 'newPassword',
          oldPassword: 'password'
        })

      expect(response).toHaveStatus(201)
    })

    it('should return 403 when non-admin user wants to change other users password', async () => {
      const user = await userSeeder.createRandomUser({ email: roleSeeder.createRandomEmail() })

      user.password = await bcrypt.hash('password', 10)

      await userRepository.save(user, { reload: true })

      const response = await request(app.getHttpServer())
        .post(`/users/${user.uuid}/password`)
        .set('Authorization', `Bearer ${readonlyUser.token}`)
        .send({
          password: 'newPassword',
          oldPassword: 'password'
        })

      expect(response).toHaveStatus(403)
    })

    it('should return 400 when password is missing', async () => {
      const { user, token } = await userSeeder.setupUser({ email: roleSeeder.createRandomEmail() })

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
