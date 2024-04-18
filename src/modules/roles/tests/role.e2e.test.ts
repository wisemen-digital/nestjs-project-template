import { before, describe, it, after } from 'node:test'
import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { expect } from 'expect'
import { randWord } from '@ngneat/falso'
import { In } from 'typeorm'
import { type TestingModule } from '@nestjs/testing'
import { type SetupUserType } from '../../users/tests/setup-user.type.js'
import { UserSeeder } from '../../users/tests/user.seeder.js'
import { type Role } from '../entities/role.entity.js'
import { UserRepository } from '../../users/repositories/user.repository.js'
import { Permission } from '../../permissions/permission.enum.js'
import { setupTest } from '../../../../test/setup/setup.js'
import { RoleSeeder } from './role.seeder.js'

describe('Roles', async () => {
  let app: INestApplication

  let userRepository: UserRepository
  let moduleRef: TestingModule

  let userSeeder: UserSeeder
  let roleSeeder: RoleSeeder

  let adminRole: Role
  let readonlyRole: Role
  let adminUser: SetupUserType
  let readonlyUser: SetupUserType

  before(async () => {
    ({ app, moduleRef } = await setupTest())

    userRepository = moduleRef.get(UserRepository)

    userSeeder = moduleRef.get(UserSeeder)
    roleSeeder = moduleRef.get(RoleSeeder)

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
      const roleReadRole = await roleSeeder.createRandomRole({
        name: roleSeeder.createRandomName(),
        permissions: [Permission.ROLE_READ]
      })

      const user = await userSeeder.setupUser({
        roleUuid: roleReadRole.uuid,
        email: roleSeeder.createRandomEmail()
      })

      const response = await request(app.getHttpServer())
        .get('/roles')
        .set('Authorization', `Bearer ${user.token}`)

      expect(response).toHaveStatus(200)
    })
  })

  describe('Create role', () => {
    it('should return 401 when not authenticated', async () => {
      const roleDto = await roleSeeder.createRandomRoleDto({ name: roleSeeder.createRandomName() })

      const response = await request(app.getHttpServer())
        .post('/roles')
        .send(roleDto)

      expect(response).toHaveStatus(401)
    })

    it('should return 403 when not authorized', async () => {
      const roleDto = await roleSeeder.createRandomRole({ name: roleSeeder.createRandomName() })

      const response = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${readonlyUser.token}`)
        .send(roleDto)

      expect(response).toHaveStatus(403)
    })

    it('should create role', async () => {
      const roleDto = await roleSeeder.createRandomRoleDto({ name: roleSeeder.createRandomName() })

      const response = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(roleDto)

      expect(response).toHaveStatus(201)
      expect(response.body.name).toBe(roleDto.name)
      expect(response.body.permissions).toEqual([])
    })

    it('should create role not a second time', async () => {
      const roleDto = await roleSeeder.createRandomRoleDto({ name: roleSeeder.createRandomName() })

      await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(roleDto)

      const response = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(roleDto)

      expect(response).toHaveStatus(409)
      expect(response).toHaveErrorCode('already_exists')
    })

    it('should not create role with invalid name', async () => {
      const roleDto = await roleSeeder.createRandomRoleDto({ name: roleSeeder.createRandomName() })

      roleDto.name = ''

      const response = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(roleDto)

      expect(response).toHaveStatus(400)
    })
  })

  describe('Update role', () => {
    it('should return 401 when not authenticated', async () => {
      const role = await roleSeeder.createRandomRole({ name: roleSeeder.createRandomName() })

      const response = await request(app.getHttpServer())
        .post(`/roles/${role.uuid}`)
        .send({ name: randWord() })

      expect(response).toHaveStatus(401)
    })

    it('should return 403 when not authorized', async () => {
      const role = await roleSeeder.createRandomRole({ name: roleSeeder.createRandomName() })

      const response = await request(app.getHttpServer())
        .post(`/roles/${role.uuid}`)
        .set('Authorization', `Bearer ${readonlyUser.token}`)
        .send({ name: randWord() })

      expect(response).toHaveStatus(403)
    })

    it('should update role', async () => {
      const role = await roleSeeder.createRandomRole({ name: roleSeeder.createRandomName() })

      const response = await request(app.getHttpServer())
        .post(`/roles/${role.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({ name: roleSeeder.createRandomName() })

      expect(response).toHaveStatus(201)
      expect(response.body.name).not.toBe(role.name)
    })

    it('should not update role with invalid name', async () => {
      const role = await roleSeeder.createRandomRole({ name: roleSeeder.createRandomName() })

      const response = await request(app.getHttpServer())
        .post(`/roles/${role.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({ name: '' })

      expect(response).toHaveStatus(400)
    })
  })

  describe('Delete role', () => {
    it('should return 401 when not authenticated', async () => {
      const role = await roleSeeder.createRandomRole({ name: roleSeeder.createRandomName() })

      const response = await request(app.getHttpServer())
        .delete(`/roles/${role.uuid}`)

      expect(response).toHaveStatus(401)
    })

    it('should return 403 when not authorized', async () => {
      const role = await roleSeeder.createRandomRole({ name: roleSeeder.createRandomName() })

      const response = await request(app.getHttpServer())
        .delete(`/roles/${role.uuid}`)
        .set('Authorization', `Bearer ${readonlyUser.token}`)

      expect(response).toHaveStatus(403)
    })

    it('should return 400 when deleting admin role', async () => {
      const role = await roleSeeder.createAdminRole()

      const response = await request(app.getHttpServer())
        .delete(`/roles/${role.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response.body.errors[0].code).toBe('not_editable')
      expect(response.body.errors[0].detail).toBe('Cannot delete this role')

      expect(response).toHaveStatus(400)
    })

    it('should delete role and replace all staff roles to readonly', async () => {
      const randomRole = await roleSeeder.createRandomRole({ name: roleSeeder.createRandomName() })
      await roleSeeder.createReadonlyRole()

      const user1 = await userSeeder.setupUser({
        roleUuid: randomRole.uuid,
        email: roleSeeder.createRandomEmail()
      })
      const user2 = await userSeeder.setupUser({
        roleUuid: randomRole.uuid,
        email: roleSeeder.createRandomEmail()
      })
      const user3 = await userSeeder.setupUser({
        roleUuid: randomRole.uuid,
        email: roleSeeder.createRandomEmail()
      })

      const users = [user1, user2, user3]

      const response = await request(app.getHttpServer())
        .delete(`/roles/${randomRole.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response).toHaveStatus(200)

      // check if staffs have readonly role
      const usersAfter = await userRepository.find({
        where: { uuid: In(users.map(user => user.user.uuid)) },
        relations: { role: true }
      })

      usersAfter.forEach(user => {
        expect(user.role?.name).toBe('readonly')
      })
    })
  })
})
