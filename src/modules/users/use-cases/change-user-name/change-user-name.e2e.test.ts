import { after, before, describe, it } from 'node:test'
import { randomUUID } from 'crypto'
import type { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { expect } from 'expect'
import { type DataSource } from 'typeorm'
import { TestContext } from '../../../../../test/utils/test-context.js'
import { Permission } from '../../../permissions/permission.enum.js'
import { type TestUser } from '../../tests/setup-user.type.js'
import { setupTest } from '../../../../utils/test-setup/setup.js'
import { ChangeUserNameCommandBuilder } from './change-user-name-command.builder.js'

describe('Change password e2e test', async () => {
  let app: INestApplication
  let dataSource: DataSource
  let adminUser: TestUser
  let authorizedUser: TestUser

  before(async () => {
    ({ app, dataSource } = await setupTest())

    const context = new TestContext(dataSource.manager)

    adminUser = await context.getAdminUser()
    authorizedUser = await context.getUser([Permission.USER_UPDATE])
  })

  after(async () => {
    await app.close()
  })

  it('returns 401 when not authenticated', async () => {
    const command = new ChangeUserNameCommandBuilder().build()

    const response = await request(app.getHttpServer())
      .post(`/users/${authorizedUser.user.uuid}/name`)
      .send(command)

    expect(response).toHaveStatus(401)
  })

  it('returns 404 when the user does not exist', async () => {
    const command = new ChangeUserNameCommandBuilder().build()

    const response = await request(app.getHttpServer())
      .post(`/users/${randomUUID()}/name`)
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send(command)

    expect(response).toHaveStatus(404)
  })

  it('allows a user to change their own name', async () => {
    const command = new ChangeUserNameCommandBuilder()
      .withFirstName('Kobe')
      .withLastName('Kwanten')
      .build()

    const response = await request(app.getHttpServer())
      .post(`/users/${authorizedUser.user.uuid}/name`)
      .set('Authorization', `Bearer ${authorizedUser.token}`)
      .send(command)

    expect(response).toHaveStatus(201)
    expect(response.body.firstName).toBe(command.firstName)
    expect(response.body.lastName).toBe(command.lastName)
  })

  it('prohibits a user from changing the name of another user', async () => {
    const command = new ChangeUserNameCommandBuilder().build()

    const response = await request(app.getHttpServer())
      .post(`/users/${adminUser.user.uuid}/name`)
      .set('Authorization', `Bearer ${authorizedUser.token}`)
      .send(command)

    expect(response).toHaveStatus(403)
  })

  it('allows an admin to update any user\'s name', async () => {
    const command = new ChangeUserNameCommandBuilder().build()

    const response = await request(app.getHttpServer())
      .post(`/users/${authorizedUser.user.uuid}/name`)
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send(command)

    expect(response).toHaveStatus(201)
  })
})
