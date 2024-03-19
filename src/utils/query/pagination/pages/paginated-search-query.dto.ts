import { Type } from 'class-transformer'
import { IsOptional, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { SearchQuery } from '../../search-query.dto.js'
import { PaginationQuery } from './pagination-query.dto.js'

export abstract class PaginatedSearchQuery extends SearchQuery {
  @ApiProperty({ type: PaginationQuery })
  @IsOptional()
  @Type(() => PaginationQuery)
  @ValidateNested()
    pagination?: PaginationQuery
}
