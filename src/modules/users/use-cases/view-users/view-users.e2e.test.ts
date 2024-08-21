import { after, before, describe, it } from 'node:test'
import type { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { expect } from 'expect'
import { type DataSource } from 'typeorm'
import { TestContext } from '../../../../../test/utils/test-context.js'
import { Permission } from '../../../permissions/permission.enum.js'
import { type SetupUser } from '../../tests/setup-user.type.js'
import { testSetup } from '../../../../utils/test-setup/setup.js'
import {
  TypesenseCollectionService
} from '../../../typesense/services/typesense-collection.service.js'
import {
  TypesenseCollectionName
} from '../../../typesense/enums/typesense-collection-index.enum.js'

describe('View user e2e test', async () => {
  let app: INestApplication
  let dataSource: DataSource
  let adminUser: SetupUser
  let readonlyUser: SetupUser

  function getViewUsersRoute (): string {
    return '/users'
  }

  before(async () => {
    const setup = await testSetup()
    dataSource = setup.dataSource
    app = setup.app
    const moduleRef = setup.moduleRef

    const context = new TestContext(dataSource.manager)
    readonlyUser = await context.getReadonlyUser()
    adminUser = await context.getAdminUser()

    const typesenseCollectionService = moduleRef.get(TypesenseCollectionService)
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
      .get(getViewUsersRoute())

    expect(response).toHaveStatus(401)
  })

  it('returns users in a paginated format', async () => {
    const response = await request(app.getHttpServer())
      .get(getViewUsersRoute())
      .set('Authorization', `Bearer ${adminUser.token}`)
      .query({
        pagination: {
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
