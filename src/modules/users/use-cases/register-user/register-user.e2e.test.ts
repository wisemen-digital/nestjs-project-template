import { after, before, describe, it } from 'node:test'
import { randomUUID } from 'crypto'
import request from 'supertest'
import { expect } from 'expect'
import type { DataSource, EntityManager } from 'typeorm'
import { NestExpressApplication } from '@nestjs/platform-express'
import { UserSeeder } from '../../tests/user.seeder.js'
import { UserEntityBuilder } from '../../tests/user-entity.builder.js'
import { setupTest } from '../../../../utils/test-setup/setup.js'
import { RegisterUserCommandBuilder } from './register-user-command.builder.js'
import { EmailAlreadyInUseError } from './email-already-in-use.error.js'

describe('Register user e2e test', () => {
  let app: NestExpressApplication
  let dataSource: DataSource
  let entityManager: EntityManager

  before(async () => {
    ({ app, dataSource } = await setupTest())
    entityManager = dataSource.manager
  })

  after(async () => {
    await app.close()
  })

  it('responds with a validation error when sending an empty body', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({})

    expect(response).toHaveStatus(400)
  })

  it('responds with a validation error when omitting the password', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ email: randomUUID() + '@mail.com' })

    expect(response).toHaveStatus(400)
  })

  it('responds with a validation error when omitting the email', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ password: 'somerandompassword' })

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
      .post('/users')
      .send(dto)

    expect(response).toHaveStatus(409)
    expect(response).toHaveApiError(new EmailAlreadyInUseError(email))
  })

  it('should return 201', async () => {
    const dto = new RegisterUserCommandBuilder()
      .withEmail('should-return-201@mail.com')
      .build()

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(dto)

    expect(response).toHaveStatus(201)
  })
})
