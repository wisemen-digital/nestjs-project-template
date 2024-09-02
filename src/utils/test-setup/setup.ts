import { mock } from 'node:test'
import { DataSource } from 'typeorm'
import type { TestingModule } from '@nestjs/testing'
import { expect } from 'expect'
import { NestExpressApplication } from '@nestjs/platform-express'
import { uuid } from '../../../test/expect/expectUuid.js'
import { toHaveErrorCode } from '../../../test/expect/expectErrorCode.js'
import { toHaveStatus } from '../../../test/expect/expectStatus.js'
import { isEnumValue } from '../../../test/expect/expectEnum.js'
import { S3Service } from '../../modules/files/services/s3.service.js'
import { toHaveApiError } from '../../../test/expect/expect-api-error.js'
import { TestContext } from '../../../test/utils/test-context.js'
import { AuthMiddleware } from '../../modules/auth/middleware/auth.middleware.js'
import { compileTestModule } from './compile-test-module.js'

export interface TestSetup {
  app: NestExpressApplication
  testModule: TestingModule
  dataSource: DataSource
  context: TestContext
}

export async function setupTest (): Promise<TestSetup> {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('NODE_ENV must be set to test')
  }

  const testModule = await compileTestModule()
  const [app, dataSource] = await Promise.all([
    setupTestApp(testModule),
    setupTestDataSource(testModule)
  ])

  const context = new TestContext(dataSource.manager)

  mockS3()
  mockAuth(context)
  extendExpect()

  return { app, testModule, dataSource, context }
}

async function setupTestDataSource (testModule: TestingModule): Promise<DataSource> {
  const dataSource = testModule.get(DataSource)

  const qr = dataSource.createQueryRunner()

  await qr.connect()
  await qr.startTransaction()

  Object.defineProperty(dataSource.manager, 'queryRunner', {
    configurable: true,
    value: qr
  })

  return dataSource
}

function mockS3 (): void {
  mock.method(S3Service.prototype, 'createTemporaryDownloadUrl', () => 'http://localhost:3000')
  mock.method(S3Service.prototype, 'createTemporaryUploadUrl', () => 'http://localhost:3000')
  mock.method(S3Service.prototype, 'upload', () => {})
  mock.method(S3Service.prototype, 'uploadStream', () => {})
  mock.method(S3Service.prototype, 'delete', () => {})
  mock.method(S3Service.prototype, 'list', () => [])
}

function mockAuth (context: TestContext): void {
  mock.method(AuthMiddleware.prototype, 'verify', async (token: string) => {
    const user = context.resolveUser(token)

    return Promise.resolve({ sub: user.uuid })
  })
}

async function setupTestApp (moduleRef: TestingModule): Promise<NestExpressApplication> {
  const app = moduleRef.createNestApplication<NestExpressApplication>()

  await app.init()

  return app
}

function extendExpect (): void {
  expect.extend({
    uuid,
    toHaveErrorCode,
    toHaveStatus,
    isEnumValue,
    toHaveApiError
  })
}
