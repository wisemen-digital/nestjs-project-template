import { after, before, describe, it } from 'node:test'
import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { expect } from 'expect'
import { type DataSource } from 'typeorm'
import { type File } from '../entities/file.entity.js'
import { TestContext } from '../../../../test/utils/test-context.js'
import { type SetupUser } from '../../users/tests/setup-user.type.js'
import { globalTestSetup } from '../../../../test/setup/setup.js'
import { CreateFileDtoBuilder } from './builders/create-file-dto.builder.js'
import { FileSeeder } from './seeders/file.seeder.js'
import { FileBuilder } from './builders/file-entity.builder.js'

describe('File', async () => {
  let app: INestApplication
  let dataSource: DataSource

  let context: TestContext

  let adminUser: SetupUser

  before(async () => {
    ({ app, dataSource } = await globalTestSetup())

    context = new TestContext(dataSource.manager)

    adminUser = await context.getAdminUser()
  })

  describe('Create file', () => {
    it('should return 401 when no token is provided', async () => {
      const response = await request(app.getHttpServer())
        .post('/file')

      expect(response).toHaveStatus(401)
    })

    it('should return 400 when invalid body', async () => {
      const response = await request(app.getHttpServer())
        .post('/file')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({})

      expect(response).toHaveStatus(400)
    })

    it('should create file and return 201', async () => {
      const fileDto = new CreateFileDtoBuilder()
        .build()

      const response = await request(app.getHttpServer())
        .post('/file')
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send(fileDto)

      expect(response).toHaveStatus(201)
    })
  })

  describe('Download file', () => {
    let file: File

    before(async () => {
      file = await new FileSeeder(dataSource.manager)
        .seedOne(new FileBuilder().build())
    })

    it('should return 401 when no token is provided', async () => {
      const response = await request(app.getHttpServer())
        .post(`/file/${file.uuid}/download`)

      expect(response).toHaveStatus(401)
    })

    it('should redirect to s3 download link', async () => {
      const response = await request(app.getHttpServer())
        .post(`/file/${file.uuid}/download`)
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response).toHaveStatus(302)
    })
  })

  describe('Delete file', () => {
    let file: File

    before(async () => {
      file = await new FileSeeder(dataSource.manager)
        .seedOne(new FileBuilder().build())
    })

    it('should return 401 when no token is provided', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/file/${file.uuid}`)

      expect(response).toHaveStatus(401)
    })

    it('should return 200', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/file/${file.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response).toHaveStatus(200)
    })
  })

  after(async () => {
    await app.close()
  })
})
