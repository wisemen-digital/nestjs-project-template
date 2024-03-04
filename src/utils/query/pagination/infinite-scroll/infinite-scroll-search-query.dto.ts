import { Type } from 'class-transformer'
import { IsOptional, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { SearchQuery } from '../../search-query.dto.js'
import { InfiniteScrollQuery } from './infinite-scroll-query.dto.js'

export abstract class InfiniteScrollSearchQuery extends SearchQuery {
  @ApiProperty({ type: InfiniteScrollQuery })
  @IsOptional()
  @Type(() => InfiniteScrollQuery)
  @ValidateNested()
  pagination?: InfiniteScrollQuery
}
