import { after, before, describe, it } from 'node:test'
import { randomUUID } from 'crypto'
import request from 'supertest'
import { expect } from 'expect'
import { NestExpressApplication } from '@nestjs/platform-express'
import { TestContext } from '../../../../../test/utils/test-context.js'
import { Permission } from '../../../permissions/permission.enum.js'
import type { TestUser } from '../../tests/setup-user.type.js'
import { setupTest } from '../../../../utils/test-setup/setup.js'

describe('View user e2e test', () => {
  let app: NestExpressApplication
  let adminUser: TestUser
  let authorizedUser: TestUser
  let context: TestContext

  before(async () => {
    ({ app, context } = await setupTest())

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
      .get(`/users/${authorizedUser.user.uuid}`)

    expect(response).toHaveStatus(401)
  })

  it('returns 404 when the user does not exist', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${randomUUID()}`)
      .set('Authorization', `Bearer ${adminUser.token}`)

    expect(response).toHaveStatus(404)
  })

  it('returns the user when the user views themselves', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${authorizedUser.user.uuid}`)
      .set('Authorization', `Bearer ${authorizedUser.token}`)

    expect(response).toHaveStatus(200)
  })

  it('returns 403 (unauthorized) when a user attempts to view another user', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${adminUser.user.uuid}`)
      .set('Authorization', `Bearer ${authorizedUser.token}`)

    expect(response).toHaveStatus(403)
  })

  it('an admin can view any user', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${authorizedUser.user.uuid}`)
      .set('Authorization', `Bearer ${adminUser.token}`)

    expect(response).toHaveStatus(200)
  })
})
