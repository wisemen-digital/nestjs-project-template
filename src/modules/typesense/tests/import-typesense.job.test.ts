import { after, before, describe, it, mock } from 'node:test'
import { type TestingModule } from '@nestjs/testing'
import { type INestApplication } from '@nestjs/common'
import { expect } from 'expect'
import { ImportTypesenseJob } from '../jobs/import-typesense.job.js'
import { globalTestSetup } from '../../../../test/setup/setup.js'
import { TypesenseImportService } from '../services/typesense-import.service.js'

describe('Test import typesense job', () => {
  let app: INestApplication
  let job: ImportTypesenseJob
  let moduleRef: TestingModule

  before(async () => {
    ({ app, moduleRef } = await globalTestSetup())
  })

  after(async () => {
    await app.close()
  })

  describe('Test import typesense job', () => {
    it('should migrate and import typesense', async () => {
      const spyImport = mock.method(TypesenseImportService.prototype, 'migrate', async () => { })
      const spyMigrate = mock.method(TypesenseImportService.prototype, 'import', async () => { })

      job = ImportTypesenseJob.create()

      await job.execute(moduleRef)

      expect(spyImport.mock.callCount()).toBe(1)
      expect(spyMigrate.mock.callCount()).toBe(1)

      spyImport.mock.restore()
      spyMigrate.mock.restore()
    })
  })
})
