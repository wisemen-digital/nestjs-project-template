import { mock } from 'node:test'
import { DataSource } from 'typeorm'
import { type INestApplication, ValidationPipe } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import type { TestingModule } from '@nestjs/testing'
import { expect } from 'expect'
import { NestExpressApplication } from '@nestjs/platform-express'
import { HttpExceptionFilter } from '../exceptions/http-exception.filter.js'
import { uuid } from '../../../test/expect/expectUuid.js'
import { toHaveErrorCode } from '../../../test/expect/expectErrorCode.js'
import { toHaveStatus } from '../../../test/expect/expectStatus.js'
import { isEnumValue } from '../../../test/expect/expectEnum.js'
import { S3Service } from '../../modules/files/services/s3.service.js'
import { compileTestModule } from './compile-test-module.js'

export interface TestSetup {
  app: NestExpressApplication
  moduleRef: TestingModule
  dataSource: DataSource
}

export async function setupTest (): Promise<TestSetup> {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('NODE_ENV must be set to test')
  }

  const moduleRef = await compileTestModule()
  const [app, dataSource] = await Promise.all([
    setupTestApp(moduleRef),
    setupTestDataSource(moduleRef)
  ])

  mockS3()
  extendExpect()

  return { app, moduleRef, dataSource }
}

async function setupTestDataSource (moduleRef: TestingModule): Promise<DataSource> {
  const dataSource = moduleRef.get(DataSource)

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
  mock.method(S3Service.prototype, 'upload', async () => {
    await Promise.resolve()
  })
  mock.method(S3Service.prototype, 'uploadStream', async () => {
    await Promise.resolve()
  })
  mock.method(S3Service.prototype, 'delete', async () => {
    await Promise.resolve()
  })
  mock.method(S3Service.prototype, 'list', async () => {
    await Promise.resolve([])
  })
}

async function setupTestApp (moduleRef: TestingModule): Promise<NestExpressApplication> {
  const app = moduleRef.createNestApplication<NestExpressApplication>()

  configureValidationPipeline(app)
  configureExceptionFilter(app)
  await app.init()

  return app
}

function configureValidationPipeline (app: INestApplication<unknown>): void {
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
}

function configureExceptionFilter (app: INestApplication<unknown>): void {
  const httpAdapterHost = app.get(HttpAdapterHost)

  app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost))
}

function extendExpect (): void {
  expect.extend({
    uuid,
    toHaveErrorCode,
    toHaveStatus,
    isEnumValue
  })
}
