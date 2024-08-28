import { Type } from 'class-transformer'
import { IsOptional, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { SearchQuery } from '../../search-query.dto.js'
import { OffsetPaginationQuery } from './pagination-query.dto.js'

export abstract class OffsetPaginatedSearchQuery extends SearchQuery {
  @ApiProperty({ type: OffsetPaginationQuery, required: false })
  @IsOptional()
  @Type(() => OffsetPaginationQuery)
  @ValidateNested()
  pagination?: OffsetPaginationQuery
}
