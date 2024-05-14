import { Module } from '@nestjs/common'
import { UserRepository } from '../../users/repositories/user.repository.js'
import { TypesenseService } from '../services/typesense.service.js'
import { TypesenseImportService } from '../services/typesense-import.service.js'
import { TypesenseClient } from '../clients/typesense.client.js'
import { TypesenseController } from '../controllers/typesense.controller.js'

@Module({
  controllers: [TypesenseController],
  providers: [
    TypesenseClient,
    TypesenseService,
    TypesenseImportService,
    UserRepository
  ],
  exports: [TypesenseService, TypesenseImportService]
})
export class TypesenseModule {}
