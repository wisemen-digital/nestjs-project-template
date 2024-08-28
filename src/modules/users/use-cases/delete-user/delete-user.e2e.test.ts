import { after, before, describe, it } from 'node:test'
import { randomUUID } from 'crypto'
import type { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { expect } from 'expect'
import { type DataSource } from 'typeorm'
import { setupTest } from '../../../../utils/test-setup/setup.js'
import { type TestUser } from '../../tests/setup-user.type.js'
import { TestContext } from '../../../../../test/utils/test-context.js'

describe('Register user e2e test', async () => {
  let app: INestApplication
  let dataSource: DataSource
  let adminUser: TestUser
  let readonlyUser: TestUser
  let context: TestContext

  before(async () => {
    ({ app, dataSource } = await setupTest())
    context = new TestContext(dataSource.manager)

    adminUser = await context.getAdminUser()
    readonlyUser = await context.getReadonlyUser()
  })

  after(async () => {
    await app.close()
  })

  it('responds with 401 when not authenticated', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/users/${randomUUID()}`)

    expect(response).toHaveStatus(401)
  })

  it('responds with 404 when the user does not exist', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/users/${randomUUID()}`)
      .set('Authorization', `Bearer ${adminUser.token}`)

    expect(response).toHaveStatus(404)
  })

  it('responds with 403 when user is not an admin and tries to delete another user', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/users/${adminUser.user.uuid}`)
      .set('Authorization', `Bearer ${readonlyUser.token}`)

    expect(response).toHaveStatus(403)
  })

  it('responds with 200 when an admin deletes another user', async () => {
    const randomUser = await context.getRandomUser()

    const response = await request(app.getHttpServer())
      .delete(`/users/${randomUser.user.uuid}`)
      .set('Authorization', `Bearer ${adminUser.token}`)

    expect(response).toHaveStatus(200)
  })

  it('responds with 200 when a user deletes themselves', async () => {
    const randomUser = await context.getRandomUser()

    const response = await request(app.getHttpServer())
      .delete(`/users/${randomUser.user.uuid}`)
      .set('Authorization', `Bearer ${randomUser.token}`)

    expect(response).toHaveStatus(200)
  })
})
