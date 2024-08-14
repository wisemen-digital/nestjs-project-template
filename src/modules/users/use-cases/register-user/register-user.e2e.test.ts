import { after, before, describe, it } from 'node:test'
import type { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { expect } from 'expect'
import { randEmail, randPassword } from '@ngneat/falso'
import { type DataSource, type EntityManager } from 'typeorm'
import { UserSeeder } from '../../tests/user.seeder.js'
import { UserEntityBuilder } from '../../tests/user-entity.builder.js'
import { testSetup } from '../../../../utils/test-setup/setup.js'
import { RegisterUserCommandBuilder } from './register-user-command.builder.js'

describe('Register user e2e test', async () => {
  const REGISTER_USER_ROUTE = '/users'
  let app: INestApplication
  let dataSource: DataSource
  let entityManager: EntityManager

  before(async () => {
    ({ app, dataSource } = await testSetup())
    entityManager = dataSource.manager
  })

  after(async () => {
    await app.close()
  })

  it('responds with a validation error when sending an empty body', async () => {
    const response = await request(app.getHttpServer())
      .post(REGISTER_USER_ROUTE)
      .send({})

    expect(response).toHaveStatus(400)
  })

  it('responds with a validation error when omitting the password', async () => {
    const response = await request(app.getHttpServer())
      .post(REGISTER_USER_ROUTE)
      .send({ email: randEmail() })

    expect(response).toHaveStatus(400)
  })

  it('responds with a validation error when omitting the email', async () => {
    const response = await request(app.getHttpServer())
      .post(REGISTER_USER_ROUTE)
      .send({ password: randPassword() })

    expect(response).toHaveStatus(400)
  })

  it('responds with email already in use error when the email is already in use', async () => {
    const email = 'kobe.kwanten@wisemen.digital'
    await new UserSeeder(entityManager).seedOne(
      new UserEntityBuilder()
        .withEmail(email)
        .build()
    )

    const dto = new RegisterUserCommandBuilder()
      .withEmail(email)
      .build()

    const response = await request(app.getHttpServer())
      .post(REGISTER_USER_ROUTE)
      .send(dto)

    expect(response).toHaveStatus(409)
    expect(response).toHaveErrorCode('email_exists')
  })

  it('should return 201', async () => {
    const dto = new RegisterUserCommandBuilder()
      .withEmail('should-return-201@mail.com')
      .build()

    const response = await request(app.getHttpServer())
      .post(REGISTER_USER_ROUTE)
      .send(dto)

    expect(response).toHaveStatus(201)
  })
})
