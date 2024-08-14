import { after, before, describe, it } from 'node:test'
import { randomUUID } from 'crypto'
import type { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { expect } from 'expect'
import { type DataSource, type EntityManager } from 'typeorm'
import { UserSeeder } from '../../tests/seeders/user.seeder.js'
import { UserEntityBuilder } from '../../tests/builders/entities/user-entity.builder.js'
import { TokenSeeder } from '../../../auth/tests/seeders/token.seeder.js'
import { type User } from '../../entities/user.entity.js'
import { TestContext } from '../../../../../test/utils/test-context.js'
import { type Client } from '../../../auth/entities/client.entity.js'
import { Permission } from '../../../permissions/permission.enum.js'
import { type Role } from '../../../roles/entities/role.entity.js'
import { testSetup } from '../../../../utils/test-setup/setup.js'
import { type SetupUser } from '../../tests/setup-user.type.js'
import { ChangePasswordCommandBuilder } from './change-password-command.builder.js'

describe('Change password e2e test', async () => {
  let app: INestApplication
  let dataSource: DataSource
  let entityManager: EntityManager
  let client: Client
  let updateUserRole: Role
  let adminUser: SetupUser
  let authorizedUser: SetupUser

  function getChangePasswordRoute (forUser?: User): string {
    if (forUser === undefined) {
      return `/users/${randomUUID()}/password`
    } else {
      return `/users/${forUser.uuid.toString()}/password`
    }
  }

  before(async () => {
    ({ app, dataSource } = await testSetup())
    entityManager = dataSource.manager

    const context = new TestContext(dataSource.manager)

    adminUser = await context.getAdminUser()
    authorizedUser = await context.getUser([Permission.USER_UPDATE])
    client = await context.getClient()
    updateUserRole = await context.getRole([Permission.USER_UPDATE])
  })

  after(async () => {
    await app.close()
  })

  it('responds 401 when not authenticated', async () => {
    const user = await new UserSeeder(entityManager).seedOne(
      new UserEntityBuilder()
        .withEmail('test1@email.com')
        .build()
    )
    const response = await request(app.getHttpServer())
      .post(getChangePasswordRoute(user))
      .send(new ChangePasswordCommandBuilder().build())

    expect(response).toHaveStatus(401)
  })

  it('responds with 404 when user not found', async () => {
    const response = await request(app.getHttpServer())
      .post(getChangePasswordRoute())
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send(new ChangePasswordCommandBuilder().build())

    expect(response).toHaveStatus(404)
  })

  it('responds with a validation error when sending an empty body', async () => {
    const user = await new UserSeeder(entityManager).seedOne(
      new UserEntityBuilder()
        .withEmail('test2@email.com')
        .build()
    )
    const response = await request(app.getHttpServer())
      .post(getChangePasswordRoute(user))
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send({})

    expect(response).toHaveStatus(400)
  })

  it('responds with 403 when user is not an admin nor the owner themselves', async () => {
    const user = await new UserSeeder(entityManager).seedOne(
      new UserEntityBuilder()
        .withEmail('test3@email.com')
        .build()
    )
    const response = await request(app.getHttpServer())
      .post(getChangePasswordRoute(user))
      .set('Authorization', `Bearer ${authorizedUser.token}`)
      .send(new ChangePasswordCommandBuilder().build())

    expect(response).toHaveStatus(403)
  })

  it('responds with 201 when the user changes their own password', async () => {
    const oldPassword = 'OldPassword'
    const user = await new UserSeeder(entityManager).seedOne(
      new UserEntityBuilder()
        .withEmail('test4@email.com')
        .withPassword(oldPassword)
        .withRole(updateUserRole)
        .build()
    )

    const token = await new TokenSeeder(entityManager).seedOne(user, client)
    const dto = new ChangePasswordCommandBuilder()
      .withOldPassword(oldPassword)
      .build()

    const response = await request(app.getHttpServer())
      .post(getChangePasswordRoute(user))
      .set('Authorization', `Bearer ${token}`)
      .send(dto)

    expect(response).toHaveStatus(201)
  })

  it('responds with 200 when an admin changes another user\'s password', async () => {
    const oldPassword = 'OldPassword'
    const user = await new UserSeeder(entityManager).seedOne(
      new UserEntityBuilder()
        .withEmail('test5@email.com')
        .withPassword(oldPassword)
        .build()
    )
    const dto = new ChangePasswordCommandBuilder()
      .withOldPassword(oldPassword)
      .build()

    const response = await request(app.getHttpServer())
      .post(getChangePasswordRoute(user))
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send(dto)

    expect(response).toHaveStatus(201)
  })

  it('responds with an invalid password error when the old password ' +
    'does not match the user\'s password', async () => {
    const user = await new UserSeeder(entityManager).seedOne(
      new UserEntityBuilder()
        .withEmail('test7@email.com')
        .withPassword('OldPassword')
        .build()
    )
    const dto = new ChangePasswordCommandBuilder()
      .withOldPassword('NotOldPassword')
      .build()

    const response = await request(app.getHttpServer())
      .post(getChangePasswordRoute(user))
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send(dto)

    expect(response).toHaveStatus(401)
    expect(response).toHaveErrorCode('invalid_credentials')
  })
})
