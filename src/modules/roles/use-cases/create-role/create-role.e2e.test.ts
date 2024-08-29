import { before, describe, it, after } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import type { DataSource } from 'typeorm'
import { NestExpressApplication } from '@nestjs/platform-express'
import { setupTest } from '../../../../utils/test-setup/setup.js'
import { TestUser } from '../../../users/tests/setup-user.type.js'
import { TestContext } from '../../../../../test/utils/test-context.js'
import { CreateRoleDtoBuilder } from '../../tests/builders/dtos/create-role-dto.builder.js'

describe('role', () => {
  let app: NestExpressApplication
  let dataSource: DataSource

  let context: TestContext

  let adminUser: TestUser
  let readonlyUser: TestUser

  before(async () => {
    ({ app, dataSource } = await setupTest())

    context = new TestContext(dataSource.manager)

    adminUser = await context.getAdminUser()
    readonlyUser = await context.getReadonlyUser()
  })

  after(async () => {
    await app.close()
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
      expect(response).toHaveErrorCode('already_exists')
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
})
