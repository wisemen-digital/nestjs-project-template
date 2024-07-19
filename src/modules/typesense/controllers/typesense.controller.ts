import { Controller, Get, Query } from '@nestjs/common'
import { type CollectionSchema } from 'typesense/lib/Typesense/Collection.js'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { MigrateTypesenseQueryDto } from '../dtos/migrate-typesense-query.dto.js'
import { ImportTypesenseQueryDto } from '../dtos/import-typesense-query.dto.js'
import { Permissions } from '../../permissions/decorators/permissions.decorator.js'
import { Permission } from '../../permissions/enums/permission.enum.js'
import { TypesenseInitializationService } from '../services/typesense-initialization.service.js'
import { getCollectionsTypenseResponse, importTypesenseResponse, migrateTypesenseResponse } from '../docs/typesense-response.docs.js'

@ApiTags('Typesense')
@Controller('typesense')
@ApiBearerAuth()
export class TypesenseController {
  constructor (
    private readonly typesenseImportService: TypesenseInitializationService
  ) {}

  @Get('/migrate')
  @ApiResponse(migrateTypesenseResponse)
  @Permissions(Permission.ADMIN)
  async migrate (
    @Query() query: MigrateTypesenseQueryDto
  ): Promise<void> {
    await this.typesenseImportService.migrate(query.fresh, query.collections)
  }

  @Get('/import')
  @ApiResponse(importTypesenseResponse)
  @Permissions(Permission.ADMIN)
  async import (
    @Query() query: ImportTypesenseQueryDto
  ): Promise<void> {
    await this.typesenseImportService.import(query.collections)
  }

  @Get('/collections')
  @ApiResponse(getCollectionsTypenseResponse)
  @Permissions(Permission.ADMIN)
  async getCollections (): Promise<CollectionSchema[]> {
    return await this.typesenseImportService.retrieveCollections()
  }
}
