import { after, before, describe, it } from 'node:test'
import { randomUUID } from 'crypto'
import type { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { expect } from 'expect'
import { type DataSource } from 'typeorm'
import { globalTestSetup } from '../../../../../test/setup/setup.js'
import { type User } from '../../entities/user.entity.js'
import { TestContext } from '../../../../../test/utils/test-context.js'
import { type AuthorizedUser } from '../../tests/setup-user.type.js'
import { Permission } from '../../../permissions/permission.enum.js'

describe('View user e2e test', async () => {
  let app: INestApplication
  let dataSource: DataSource
  let adminUser: AuthorizedUser
  let authorizedUser: AuthorizedUser

  function getViewUserRoute (forUser?: User): string {
    if (forUser === undefined) {
      return `/users/${randomUUID()}`
    } else {
      return `/users/${forUser.uuid.toString()}`
    }
  }

  before(async () => {
    ({ app, dataSource } = await globalTestSetup())

    const context = new TestContext(dataSource.manager)

    const [admin, user] = await Promise.all([
      context.getAdminUser(),
      context.getUser([Permission.USER_READ])
    ])

    adminUser = admin
    authorizedUser = user
  })

  after(async () => {
    await app.close()
  })

  it('returns 401 when not authenticated', async () => {
    const response = await request(app.getHttpServer())
      .get(getViewUserRoute(authorizedUser.user))

    expect(response).toHaveStatus(401)
  })

  it('returns 404 when the user does not exist', async () => {
    const response = await request(app.getHttpServer())
      .get(getViewUserRoute())
      .set('Authorization', `Bearer ${adminUser.token}`)

    expect(response).toHaveStatus(404)
  })

  it('returns the user when the user views themselves', async () => {
    const response = await request(app.getHttpServer())
      .get(getViewUserRoute(authorizedUser.user))
      .set('Authorization', `Bearer ${authorizedUser.token}`)

    expect(response).toHaveStatus(200)
  })

  it('returns 403 (unauthorized) when a user attempts to view another user', async () => {
    const response = await request(app.getHttpServer())
      .get(getViewUserRoute(adminUser.user))
      .set('Authorization', `Bearer ${authorizedUser.token}`)

    expect(response).toHaveStatus(403)
  })

  it('an admin can view any user', async () => {
    const response = await request(app.getHttpServer())
      .get(getViewUserRoute(authorizedUser.user))
      .set('Authorization', `Bearer ${adminUser.token}`)

    expect(response).toHaveStatus(200)
  })
})
