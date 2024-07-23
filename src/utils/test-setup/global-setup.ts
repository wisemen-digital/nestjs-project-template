import { DataSource } from 'typeorm'
import { TypesenseInitializationService } from '../../modules/typesense/services/typesense-initialization.service.js'
import { TypesenseCollectionName } from '../../modules/typesense/enums/typesense-collection-index.enum.js'
import { testingModule } from './setup.js'

async function globalTestSetup (): Promise<void> {
  const moduleRef = await testingModule()
  const dataSource = moduleRef.get(DataSource)

  const typesenseInitService = moduleRef.get(TypesenseInitializationService)
  await typesenseInitService.migrate(true, Object.values(TypesenseCollectionName))

  await dataSource.initialize()
  await dataSource.runMigrations({ transaction: 'each' })

  // eslint-disable-next-line no-console
  console.log('Global setup completed')
}

void globalTestSetup()
