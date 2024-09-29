import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { NestExpressApplication } from '@nestjs/platform-express'
import { TestingModule } from '@nestjs/testing'
import { TestContext } from '../../../../../test/utils/test-context.js'
import { Permission } from '../../../permissions/permission.enum.js'
import type { TestUser } from '../../tests/setup-user.type.js'
import { setupTest } from '../../../../utils/test-setup/setup.js'
import {
  TypesenseCollectionService
} from '../../../typesense/services/typesense-collection.service.js'
import {
  TypesenseCollectionName
} from '../../../typesense/enums/typesense-collection-index.enum.js'

describe('View user e2e test', () => {
  let app: NestExpressApplication
  let testModule: TestingModule
  let context: TestContext
  let adminUser: TestUser
  let readonlyUser: TestUser

  before(async () => {
    ({ app, context, testModule } = await setupTest())

    readonlyUser = await context.getReadonlyUser()
    adminUser = await context.getAdminUser()

    const typesenseCollectionService = testModule.get(TypesenseCollectionService)

    await typesenseCollectionService.importManuallyToTypesense(
      TypesenseCollectionName.USER,
      [adminUser.user, readonlyUser.user]
    )
  })

  after(async () => {
    await app.close()
  })

  it('returns 401 when not authenticated', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')

    expect(response).toHaveStatus(401)
  })

  it('returns users in a paginated format', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .query({
        'pagination': {
          limit: 10,
          offset: 0
        },
        'filter[permissions][0]': Permission.READ_ONLY
      })

    expect(response).toHaveStatus(200)
    expect(response.body).toStrictEqual(expect.objectContaining({
      items: [expect.objectContaining({
        email: readonlyUser.user.email,
        firstName: readonlyUser.user.firstName,
        lastName: readonlyUser.user.lastName,
        uuid: readonlyUser.user.uuid
      })],
      meta: {
        total: 1,
        offset: 0,
        limit: 10
      }
    }))
  })
})
