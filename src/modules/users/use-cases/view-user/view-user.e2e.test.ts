import { after, before, describe, it } from 'node:test'
import { randomUUID } from 'crypto'
import type { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { expect } from 'expect'
import { type DataSource } from 'typeorm'
import { TestContext } from '../../../../../test/utils/test-context.js'
import { Permission } from '../../../permissions/permission.enum.js'
import { type SetupUser } from '../../tests/setup-user.type.js'
import { setupTest } from '../../../../utils/test-setup/setup.js'

describe('View user e2e test', async () => {
  let app: INestApplication
  let dataSource: DataSource
  let adminUser: SetupUser
  let authorizedUser: SetupUser

  before(async () => {
    ({ app, dataSource } = await setupTest())

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
