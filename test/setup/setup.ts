import { DataSource } from 'typeorm'
import { type INestApplication, ValidationPipe } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { Test, type TestingModule } from '@nestjs/testing'
import { expect } from 'expect'
import { AppModule } from '../../src/app.module.js'
import { UserSeederModule } from '../../src/modules/users/tests/user-seeder.module.js'
import { RoleSeederModule } from '../../src/modules/roles/tests/role-seeder.module.js'
import { HttpExceptionFilter } from '../../src/utils/Exceptions/http-exception.filter.js'
import { uuid } from '../expect/expectUuid.js'
import { toHaveErrorCode } from '../expect/expectErrorCode.js'
import { toHaveStatus } from '../expect/expectStatus.js'
import { isEnumValue } from '../expect/expectEnum.js'

export class SetupTestResponse {
  app: INestApplication
  moduleRef: TestingModule
}

export async function setupTest (): Promise<SetupTestResponse> {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('NODE_ENV must be set to test')
  }
  const testModule = await setupNestModules()

  const app = await setupApp(testModule)
  const dataSource = testModule.get(DataSource)
  await setupTransaction(dataSource)
  setupExpect()

  return { app, moduleRef: testModule }
}

async function setupNestModules (): Promise<TestingModule> {
  return await Test.createTestingModule({
    imports: [
      AppModule,
      UserSeederModule,
      RoleSeederModule
    ]
  }).compile()
}

async function setupApp (moduleRef: TestingModule): Promise<INestApplication> {
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
  return app
}

async function setupTransaction (dataSource: DataSource): Promise<void> {
  const qr = dataSource.createQueryRunner()
  await qr.connect()
  await qr.startTransaction()

  Object.defineProperty(dataSource.manager, 'queryRunner', {
    configurable: true,
    value: qr
  })
}

function setupExpect (): void {
  expect.extend({
    uuid,
    toHaveErrorCode,
    toHaveStatus,
    isEnumValue
  })
}
