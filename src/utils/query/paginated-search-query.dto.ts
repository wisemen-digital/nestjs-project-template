import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { PaginationQuery } from './pagination-query.dto.js'
import { SearchQuery } from './search-query.dto.js'

export abstract class PaginatedSearchQuery extends SearchQuery {
  @ApiProperty({ type: PaginationQuery })
  @Type(() => PaginationQuery)
  @ValidateNested()
    pagination: PaginationQuery
}
