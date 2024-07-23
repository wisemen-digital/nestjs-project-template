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
import { ChangeUserNameRequestBuilder } from './change-user-name.request.builder.js'

describe('Change password e2e test', async () => {
  let app: INestApplication
  let dataSource: DataSource
  let adminUser: AuthorizedUser
  let authorizedUser: AuthorizedUser

  function getChangeUserNameRoute (forUser?: User): string {
    if (forUser === undefined) {
      return `/users/${randomUUID()}/name`
    } else {
      return `/users/${forUser.uuid.toString()}/name`
    }
  }

  before(async () => {
    ({ app, dataSource } = await globalTestSetup())

    const context = new TestContext(dataSource.manager)

    adminUser = await context.getAdminUser()
    authorizedUser = await context.getUser([Permission.USER_UPDATE])
  })

  after(async () => {
    await app.close()
  })

  it('returns 401 when not authenticated', async () => {
    const response = await request(app.getHttpServer())
      .post(getChangeUserNameRoute(authorizedUser.user))
      .send(new ChangeUserNameRequestBuilder().build())

    expect(response).toHaveStatus(401)
  })

  it('returns 404 when the user does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post(getChangeUserNameRoute())
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send(new ChangeUserNameRequestBuilder().build())

    expect(response).toHaveStatus(404)
  })

  it('allows a user to change their own name', async () => {
    const dto = new ChangeUserNameRequestBuilder()
      .withFirstName('Kobe')
      .withLastName('Kwanten')
      .build()

    const response = await request(app.getHttpServer())
      .post(getChangeUserNameRoute(authorizedUser.user))
      .set('Authorization', `Bearer ${authorizedUser.token}`)
      .send(dto)

    expect(response).toHaveStatus(201)
    expect(response.body.firstName).toBe(dto.firstName)
    expect(response.body.lastName).toBe(dto.lastName)
  })

  it('prohibits a user from changing the name of another user', async () => {
    const response = await request(app.getHttpServer())
      .post(getChangeUserNameRoute(adminUser.user))
      .set('Authorization', `Bearer ${authorizedUser.token}`)
      .send(new ChangeUserNameRequestBuilder().build())

    expect(response).toHaveStatus(403)
  })

  it('allows an admin to update any user\'s name', async () => {
    const response = await request(app.getHttpServer())
      .post(getChangeUserNameRoute(authorizedUser.user))
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send(new ChangeUserNameRequestBuilder().build())

    expect(response).toHaveStatus(201)
  })
})
