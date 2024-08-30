import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsPositive, Max, Min, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { SearchQuery } from '../../query/search.query.js'

export class PaginatedOffsetQuery {
  @ApiProperty({ minimum: 1, maximum: 100 })
  @Type(() => Number)
  @Max(100)
  @IsPositive()
  @IsInt()
  limit: number

  @ApiProperty({ minimum: 0 })
  @Type(() => Number)
  @Min(0)
  @IsInt()
  offset: number
}

export abstract class PaginatedOffsetSearchQuery extends SearchQuery {
  @ApiProperty({ type: PaginatedOffsetQuery, required: false })
  @IsOptional()
  @Type(() => PaginatedOffsetQuery)
  @ValidateNested()
  pagination?: PaginatedOffsetQuery
}