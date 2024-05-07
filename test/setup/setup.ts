import { DataSource } from 'typeorm'
import { type INestApplication, ValidationPipe } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { Test, type TestingModule } from '@nestjs/testing'
import { AppModule } from '../../src/app.module.js'
import { HttpExceptionFilter } from '../../src/utils/Exceptions/http-exception.filter.js'

export async function setupTest (dataSource: DataSource): Promise<void> {
  if (process.env.NODE_ENV !== 'test') throw new Error('NODE_ENV must be set to test')

  await setupTransaction(dataSource)
}

export async function setupTransaction (dataSource: DataSource): Promise<void> {
  const qr = dataSource.createQueryRunner()
  await qr.connect()
  await qr.startTransaction()

  Object.defineProperty(dataSource.manager, 'queryRunner', {
    configurable: true,
    value: qr
  })
}

export class SetupTestResponse {
  app: INestApplication
  moduleRef: TestingModule
  dataSource: DataSource
}

export async function globalTestSetup (): Promise<SetupTestResponse> {
  const moduleRef = await Test.createTestingModule({
    imports: [
      AppModule
    ]
  }).compile()

  const app = moduleRef.createNestApplication()

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

  const dataSource = moduleRef.get(DataSource)
  await setupTest(dataSource)

  return { app, moduleRef, dataSource }
}
