import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import type { DataSource } from 'typeorm'
import { NestExpressApplication } from '@nestjs/platform-express'
import type { File } from '../entities/file.entity.js'
import { TestContext } from '../../../../test/utils/test-context.js'
import type { TestUser } from '../../users/tests/setup-user.type.js'
import { setupTest } from '../../../utils/test-setup/setup.js'
import { CreateFileDtoBuilder } from './builders/create-file-dto.builder.js'
import { FileSeeder } from './seeders/file.seeder.js'
import { FileBuilder } from './builders/file-link.builder.js'

describe('File', () => {
  let app: NestExpressApplication
  let dataSource: DataSource

  let context: TestContext

  let adminUser: TestUser

  before(async () => {
    ({ app, dataSource, context } = await setupTest())

    adminUser = await context.getAdminUser()
  })

  after(async () => {
    await app.close()
  })

  describe('Create file', () => {
    it('should return 401 when creating a file without a token', async () => {
      const response = await request(app.getHttpServer())
        .post('/file')

      expect(response).toHaveStatus(401)
    })

    it('should return 400 when creating a file with an invalid body', async () => {
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

    it('should return 401 when downloading a file without a token', async () => {
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

  describe('Delete a file', () => {
    let file: File

    before(async () => {
      file = await new FileSeeder(dataSource.manager)
        .seedOne(new FileBuilder().build())
    })

    it('should return 401 when deleting a file when no token is provided', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/file/${file.uuid}`)

      expect(response).toHaveStatus(401)
    })

    it('should delete the file', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/file/${file.uuid}`)
        .set('Authorization', `Bearer ${adminUser.token}`)

      expect(response).toHaveStatus(200)
    })
  })
})
