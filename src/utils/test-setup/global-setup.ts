import { Test } from '@nestjs/testing'
import { AppModule } from '../../app.module.js'
import { TypesenseInitializationService } from '../../modules/typesense/services/typesense-initialization.service.js'
import { TypesenseCollectionName } from '../../modules/typesense/enums/typesense-collection-index.enum.js'
import { mainDataSourceTest } from '../../config/sql/sources/main.js'

export async function globalTestSetup (): Promise<void> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule]
  }).compile()

  const typesenseInitService = moduleRef.get(TypesenseInitializationService)
  await typesenseInitService.migrate(true, Object.values(TypesenseCollectionName))

  await mainDataSourceTest.initialize()
  await mainDataSourceTest.runMigrations({ transaction: 'each' })

  // eslint-disable-next-line no-console
  console.log('Global setup completed')
}

void globalTestSetup()
