import { Controller, Get, Query } from '@nestjs/common'
import { type CollectionSchema } from 'typesense/lib/Typesense/Collection.js'
import { ApiOAuth2, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { MigrateTypesenseQueryDto } from '../dtos/migrate-typesense-query.dto.js'
import { ImportTypesenseQueryDto } from '../dtos/import-typesense-query.dto.js'
import { Permissions } from '../../permissions/permissions.decorator.js'
import { Permission } from '../../permissions/permission.enum.js'
import { TypesenseCollectionName } from '../enums/typesense-collection-index.enum.js'
import { TypesenseInitializationService } from '../services/typesense-initialization.service.js'

@ApiTags('Typesense')
@Controller('typesense')
@ApiOAuth2([])
export class TypesenseController {
  constructor (private readonly typesenseImportService: TypesenseInitializationService) {}
  @Get('migrate')
  @ApiQuery({ required: false, name: 'fresh', type: 'boolean' })
  @ApiQuery({ required: false, name: 'collections', enum: TypesenseCollectionName, isArray: true })
  @ApiResponse({
    status: 200,
    description: 'Successfully migrated collections'
  })
  @Permissions(Permission.ADMIN)
  async migrate (
    @Query() query: MigrateTypesenseQueryDto
  ): Promise<void> {
    await this.typesenseImportService.migrate(query.fresh, query.collections)
  }

  @Get('import')
  @ApiQuery({ required: false, name: 'collections', enum: TypesenseCollectionName, isArray: true })
  @ApiResponse({
    status: 200,
    description: 'Successfully imported collections'
  })
  @Permissions(Permission.ADMIN)
  async import (
    @Query() query: ImportTypesenseQueryDto
  ): Promise<void> {
    await this.typesenseImportService.import(query.collections)
  }

  @Get('collections')
  @ApiResponse({
    status: 200,
    description: 'Successfully returned collections'
  })
  @Permissions(Permission.ADMIN)
  async getCollections (): Promise<CollectionSchema[]> {
    return await this.typesenseImportService.retrieveCollections()
  }
}
