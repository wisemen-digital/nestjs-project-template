import { before, describe, it, after } from 'node:test'
import { type INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { expect } from 'expect'
import { HttpAdapterHost } from '@nestjs/core'
import { randWord } from '@ngneat/falso'
import { In } from 'typeorm'
import { AppModule } from '../../../app.module.js'
import { HttpExceptionFilter } from '../../../utils/Exceptions/http-exception.filter.js'
import { type SetupUserType } from '../../users/tests/setup-user.type.js'
import { UserSeederModule } from '../../users/tests/user-seeder.module.js'
import { UserSeeder } from '../../users/tests/user.seeder.js'
import { type Role } from '../entities/role.entity.js'
import { UserRepository } from '../../users/repositories/user.repository.js'
import { Permission } from '../../permissions/permission.enum.js'
import { RoleSeederModule } from './role-seeder.module.js'
import { RoleSeeder } from './role.seeder.js'

describe('Roles', async () => {
  let app: INestApplication

  let userRepository: UserRepository

  let userSeeder: UserSeeder
  let roleSeeder: RoleSeeder

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

    userRepository = moduleRef.get(UserRepository)

    userSeeder = moduleRef.get(UserSeeder)
    roleSeeder = moduleRef.get(RoleSeeder)

    await app.init()

    adminRole = await roleSeeder.createAdminRole()
    readonlyRole = await roleSeeder.createReadonlyRole()
    adminUser = await userSeeder.setupUser({ roleUuid: adminRole.uuid })
    readonlyUser = await userSeeder.setupUser({ roleUuid: readonlyRole.uuid })
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
        .set('Authorization', `Bearer ${readonlyUser.token}`)

      expect(response.status).toBe(403)
    })

    it('should return roles when admin', async () => {
      const response = await request(app.getHttpServer())
        .get('/roles')
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response.status).toBe(200)
    })

    it('should return roles when having ROLE_READ permission', async () => {
      const roleReadRole = await roleSeeder.createRandomRole({
        permissions: [Permission.ROLE_READ]
      })

      const user = await userSeeder.setupUser({ roleUuid: roleReadRole.uuid })

      const response = await request(app.getHttpServer())
        .get('/roles')
        .set('Authorization', `Bearer ${user.token}`)

      expect(response.status).toBe(200)
    })
  })

  describe('Create role', () => {
    it('should return 401 when not authenticated', async () => {
      const roleDto = await roleSeeder.createRandomRoleDto()

      const response = await request(app.getHttpServer())
        .post('/roles')
        .send(roleDto)

      expect(response.status).toBe(401)
    })

    it('should return 403 when not authorized', async () => {
      const roleDto = await roleSeeder.createRandomRole()

      const response = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${readonlyUser.token}`)
        .send(roleDto)

      expect(response.status).toBe(403)
    })

    it('should create role', async () => {
      const roleDto = await roleSeeder.createRandomRoleDto()

      const response = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(roleDto)

      expect(response.status).toBe(201)
      expect(response.body.name).toBe(roleDto.name)
      expect(response.body.permissions).toEqual([])
    })

    it('should create role not a second time', async () => {
      const roleDto = await roleSeeder.createRandomRoleDto()

      await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(roleDto)

      const response = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(roleDto)

      expect(response.status).toBe(409)
      expect(response.body.errors.find(error => error.code === 'already_exists')).not.toBeUndefined()
    })

    it('should not create role with invalid name', async () => {
      const roleDto = await roleSeeder.createRandomRoleDto()

      roleDto.name = ''

      const response = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(roleDto)

      expect(response.status).toBe(400)
    })
  })

  describe('Update role', () => {
    it('should return 401 when not authenticated', async () => {
      const role = await roleSeeder.createRandomRole()

      const response = await request(app.getHttpServer())
        .post(`/roles/${role.uuid}`)
        .send({ name: randWord() })

      expect(response.status).toBe(401)
    })

    it('should return 403 when not authorized', async () => {
      const role = await roleSeeder.createRandomRole()

      const response = await request(app.getHttpServer())
        .post(`/roles/${role.uuid}`)
        .set('Authorization', `Bearer ${readonlyUser.token}`)
        .send({ name: randWord() })

      expect(response.status).toBe(403)
    })

    it('should update role', async () => {
      const role = await roleSeeder.createRandomRole()

      const response = await request(app.getHttpServer())
        .post(`/roles/${role.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({ name: roleSeeder.createRandomName() })

      expect(response.status).toBe(201)
      expect(response.body.name).not.toBe(role.name)
    })

    it('should not update role with invalid name', async () => {
      const role = await roleSeeder.createRandomRole()

      const response = await request(app.getHttpServer())
        .post(`/roles/${role.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({ name: '' })

      expect(response.status).toBe(400)
    })
  })

  describe('Delete role', () => {
    it('should return 401 when not authenticated', async () => {
      const role = await roleSeeder.createRandomRole()

      const response = await request(app.getHttpServer())
        .delete(`/roles/${role.uuid}`)

      expect(response.status).toBe(401)
    })

    it('should return 403 when not authorized', async () => {
      const role = await roleSeeder.createRandomRole()

      const response = await request(app.getHttpServer())
        .delete(`/roles/${role.uuid}`)
        .set('Authorization', `Bearer ${readonlyUser.token}`)

      expect(response.status).toBe(403)
    })

    it('should return 400 when deleting admin role', async () => {
      const role = await roleSeeder.createAdminRole()

      const response = await request(app.getHttpServer())
        .delete(`/roles/${role.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response.body.errors[0].code).toBe('not_editable')
      expect(response.body.errors[0].detail).toBe('Cannot delete this role')

      expect(response.status).toBe(400)
    })

    it('should delete role and replace all staff roles to readonly', async () => {
      const randomRole = await roleSeeder.createRandomRole()
      await roleSeeder.createReadonlyRole()

      const user1 = await userSeeder.setupUser({ roleUuid: randomRole.uuid })
      const user2 = await userSeeder.setupUser({ roleUuid: randomRole.uuid })
      const user3 = await userSeeder.setupUser({ roleUuid: randomRole.uuid })

      const users = [user1, user2, user3]

      const response = await request(app.getHttpServer())
        .delete(`/roles/${randomRole.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response.status).toBe(200)

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
