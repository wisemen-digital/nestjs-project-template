import { before, describe, it, after } from 'node:test'
import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { expect } from 'expect'
import { randUuid } from '@ngneat/falso'
import { type DataSource } from 'typeorm'
import { type TestingModule } from '@nestjs/testing'
import { testSetup, migrateTypesense } from '../../../utils/test-setup/setup.js'
import { TestContext } from '../../../../test/utils/test-context.js'
import { Permission } from '../../permissions/permission.enum.js'
import { TypesenseCollectionName } from '../../typesense/enums/typesense-collection-index.enum.js'
import { TypesenseCollectionService } from '../../typesense/services/typesense-collection.service.js'
import { type SetupUser } from './setup-user.type.js'

describe('Users', async () => {
  let app: INestApplication
  let moduleRef: TestingModule
  let dataSource: DataSource

  let context: TestContext

  let adminUser: SetupUser
  let readonlyUser: SetupUser

  before(async () => {
    ({ app, moduleRef, dataSource } = await testSetup())

    context = new TestContext(dataSource.manager)

    adminUser = await context.getAdminUser()
    readonlyUser = await context.getReadonlyUser()

    await migrateTypesense(moduleRef)

    const typesenseCollectionService = moduleRef.get(TypesenseCollectionService)
    await typesenseCollectionService.importManuallyToTypesense(
      TypesenseCollectionName.USER,
      [adminUser.user, readonlyUser.user]
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
          'filter[permissions][0]': Permission.READ_ONLY
        })

      expect(response).toHaveStatus(200)
      expect(response.body.items.length).toBe(1)
      expect(response.body.meta.total).toBe(1)
      expect(response.body.meta.limit).toBe(10)
      expect(response.body.meta.offset).toBe(0)
      expect(response.body.items[0].role.permissions).toContain(Permission.READ_ONLY)
      expect(response.body.items[0].uuid).toBe(readonlyUser.user.uuid)
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
      const randomUser = await context.getRandomUser()

      const response = await request(app.getHttpServer())
        .delete(`/users/${randomUser.user.uuid}`)
        .set('Authorization', `Bearer ${randomUser.token}`)

      expect(response).toHaveStatus(200)
    })
  })

  after(async () => {
    await app.close()
  })
})
