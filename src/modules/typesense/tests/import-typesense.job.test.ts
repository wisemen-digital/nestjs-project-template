import { after, before, describe, it, mock } from 'node:test'
import type { TestingModule } from '@nestjs/testing'
import { expect } from 'expect'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ImportTypesenseJob } from '../jobs/import-typesense.job.js'
import { setupTest } from '../../../../test/setup/test-setup.js'
import { TypesenseInitializationService } from '../services/typesense-initialization.service.js'

describe('Test import typesense job', () => {
  let app: NestExpressApplication
  let job: ImportTypesenseJob
  let moduleRef: TestingModule

  before(async () => {
    ({ app, moduleRef } = await setupTest())
  })

  after(async () => {
    await app.close()
  })

  describe('Test import typesense job', () => {
    it('should migrate and import typesense', async () => {
      const spyImport = mock.method(TypesenseInitializationService.prototype, 'migrate', async () => { })
      const spyMigrate = mock.method(TypesenseInitializationService.prototype, 'import', async () => { })

      job = ImportTypesenseJob.create()

      await job.execute(moduleRef)

      expect(spyImport.mock.callCount()).toBe(1)
      expect(spyMigrate.mock.callCount()).toBe(1)

      spyImport.mock.restore()
      spyMigrate.mock.restore()
    })
  })
})
