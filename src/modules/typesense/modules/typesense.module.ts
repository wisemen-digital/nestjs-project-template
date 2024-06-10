import { Module } from '@nestjs/common'
import { UserRepository } from '../../users/repositories/user.repository.js'
import { TypesenseService } from '../services/typesense.service.js'
import { TypesenseImportService } from '../services/typesense-import.service.js'
import { TypesenseClient } from '../clients/typesense.client.js'
import { TypesenseController } from '../controllers/typesense.controller.js'
import { PgBossModule } from '../../pgboss/modules/pgboss.module.js'
import { ImportTypesenseJob } from '../jobs/import-typesense.job.js'

@Module({
  controllers: [TypesenseController],
  imports: [
    PgBossModule.forFeature([ImportTypesenseJob])
  ],
  providers: [
    TypesenseClient,
    TypesenseService,
    TypesenseImportService,
    UserRepository
  ],
  exports: [TypesenseService, TypesenseImportService]
})
export class TypesenseModule {}
