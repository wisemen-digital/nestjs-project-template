import { mock } from 'node:test'
import { DataSource } from 'typeorm'
import { type INestApplication, ValidationPipe } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { Test, type TestingModule } from '@nestjs/testing'
import { expect } from 'expect'
import { AppModule } from '../../src/app.module.js'
import { HttpExceptionFilter } from '../../src/common/exceptions/http-exception.filter.js'
import { uuid } from '../expect/expectUuid.js'
import { toHaveErrorCode } from '../expect/expectErrorCode.js'
import { toHaveStatus } from '../expect/expectStatus.js'
import { isEnumValue } from '../expect/expectEnum.js'
import { S3Service } from '../../src/modules/files/services/s3.service.js'
import {
  TypesenseInitializationService
} from '../../src/modules/typesense/services/typesense-initialization.service.js'
import {
  TypesenseCollectionName
} from '../../src/modules/typesense/enums/typesense-collection-index.enum.js'
import { toHaveApiError } from '../expect/expectApiError.js'
import { isTestEnv } from '../../src/common/envs/env-checks.js'

export class E2ETestSetup {
  app: INestApplication
  moduleRef: TestingModule
  dataSource: DataSource
}

export async function migrateTypesense (moduleRef: TestingModule): Promise<void> {
  const typesenseImportService = moduleRef.get(TypesenseInitializationService)
  await typesenseImportService.migrate(true, Object.values(TypesenseCollectionName))
}

export async function globalTestSetup (): Promise<E2ETestSetup> {
  mockS3()
  initExpect()

  const testModule = await compileTestModule()
  const dataSource = testModule.get(DataSource)

  const [app, _] = await Promise.all([
    initApp(testModule),
    startTransaction(dataSource)
  ])

  if (!isTestEnv()) {
    throw new Error('NODE_ENV must be set to test')
  }

  return { app, moduleRef: testModule, dataSource }
}

async function startTransaction (dataSource: DataSource): Promise<void> {
  const qr = dataSource.createQueryRunner()
  await qr.connect()
  await qr.startTransaction()

  Object.defineProperty(dataSource.manager, 'queryRunner', {
    configurable: true,
    value: qr
  })
}

function initExpect (): void {
  expect.extend({
    uuid,
    toHaveErrorCode,
    toHaveStatus,
    isEnumValue,
    toHaveApiError
  })
}

function mockS3 (): void {
  mock.method(S3Service.prototype, 'createTemporaryDownloadUrl', () => 'http://localhost:3000')
  mock.method(S3Service.prototype, 'createTemporaryUploadUrl', () => 'http://localhost:3000')
  mock.method(S3Service.prototype, 'upload', async () => { await Promise.resolve() })
  mock.method(S3Service.prototype, 'uploadStream', async () => { await Promise.resolve() })
  mock.method(S3Service.prototype, 'delete', async () => { await Promise.resolve() })
  mock.method(S3Service.prototype, 'list', async () => { await Promise.resolve([]) })
}

async function compileTestModule (): Promise<TestingModule> {
  return await Test.createTestingModule({
    imports: [
      AppModule.forRoot()
    ]
  }).compile()
}

async function initApp (testModule: TestingModule): Promise<INestApplication> {
  const app = testModule.createNestApplication()

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  )

  const httpAdapterHost = app.get(HttpAdapterHost)
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost))

  await app.init()
  return app
}
