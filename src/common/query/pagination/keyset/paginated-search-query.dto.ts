import { Type } from 'class-transformer'
import { IsOptional, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { SearchQuery } from '../../search-query.dto.js'
import { KeysetPaginationQuery } from './pagination-query.dto.js'

export abstract class KeysetPaginationSearchQuery extends SearchQuery {
  @ApiProperty({ type: KeysetPaginationQuery })
  @IsOptional()
  @Type(() => KeysetPaginationQuery)
  @ValidateNested()
  pagination?: KeysetPaginationQuery
}
