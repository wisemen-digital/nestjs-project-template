import { Module } from '@nestjs/common'
import { PgBossModule } from '../pgboss/modules/pgboss.module.js'
import { UserRepository } from '../users/repositories/user.repository.js'
import { TypesenseController } from './controllers/typesense.controller.js'
import { TypesenseQueryService } from './services/typesense-query.service.js'
import { TypesenseInitializationService } from './services/typesense-initialization.service.js'
import { TypesenseDocumentService } from './services/typesense-document.service.js'
import { TypesenseCollectionService } from './services/typesense-collection.service.js'
import { TypesenseCollectorFactory } from './services/collectors/typesense-collector.factory.js'
import { UserTypesenseCollector } from './services/collectors/user-typesense.collector.js'
import { TypesenseClient } from './clients/typesense.client.js'
import { ImportTypesenseJob } from './jobs/import-typesense.job.js'

@Module({
  controllers: [TypesenseController],
  imports: [
    PgBossModule.forFeature([ImportTypesenseJob])
  ],
  providers: [
    TypesenseClient,
    TypesenseQueryService,
    TypesenseDocumentService,
    TypesenseInitializationService,
    TypesenseCollectionService,
    TypesenseCollectorFactory,
    UserTypesenseCollector,
    UserRepository
  ],
  exports: [
    TypesenseQueryService,
    TypesenseDocumentService,
    TypesenseInitializationService,
    TypesenseCollectionService,
    TypesenseCollectorFactory,
    UserTypesenseCollector
  ]
})
export class TypesenseModule {}
