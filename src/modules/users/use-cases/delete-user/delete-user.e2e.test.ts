import { after, before, describe, it } from 'node:test'
import { randomUUID } from 'crypto'
import type { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { expect } from 'expect'
import { type DataSource } from 'typeorm'
import { testSetup } from '../../../../utils/test-setup/setup.js'
import type { User } from '../../entities/user.entity.js'
import { type SetupUser } from '../../tests/setup-user.type.js'
import { TestContext } from '../../../../../test/utils/test-context.js'

describe('Register user e2e test', async () => {
  let app: INestApplication
  let dataSource: DataSource
  let adminUser: SetupUser
  let readonlyUser: SetupUser
  let context: TestContext

  before(async () => {
    ({ app, dataSource } = await testSetup())
    context = new TestContext(dataSource.manager)

    adminUser = await context.getAdminUser()
    readonlyUser = await context.getReadonlyUser()
  })

  after(async () => {
    await app.close()
  })

  function getDeleteUserRoute (forUser?: User): string {
    if (forUser === undefined) {
      return `/users/${randomUUID()}`
    } else {
      return `/users/${forUser.uuid.toString()}`
    }
  }

  it('responds with 401 when not authenticated', async () => {
    const response = await request(app.getHttpServer())
      .delete(getDeleteUserRoute())

    expect(response).toHaveStatus(401)
  })

  it('responds with 404 when the user does not exist', async () => {
    const response = await request(app.getHttpServer())
      .delete(getDeleteUserRoute())
      .set('Authorization', `Bearer ${adminUser.token}`)

    expect(response).toHaveStatus(404)
  })

  it('responds with 403 when user is not an admin and tries to delete another user', async () => {
    const response = await request(app.getHttpServer())
      .delete(getDeleteUserRoute(adminUser.user))
      .set('Authorization', `Bearer ${readonlyUser.token}`)

    expect(response).toHaveStatus(403)
  })

  it('responds with 200 when an admin deletes another user', async () => {
    const randomUser = await context.getRandomUser()

    const response = await request(app.getHttpServer())
      .delete(getDeleteUserRoute(randomUser.user))
      .set('Authorization', `Bearer ${adminUser.token}`)

    expect(response).toHaveStatus(200)
  })

  it('responds with 200 when a user deletes themselves', async () => {
    const randomUser = await context.getRandomUser()

    const response = await request(app.getHttpServer())
      .delete(getDeleteUserRoute(randomUser.user))
      .set('Authorization', `Bearer ${randomUser.token}`)

    expect(response).toHaveStatus(200)
  })
})
