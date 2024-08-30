import { Type } from 'class-transformer'
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsPositive, Max, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { SearchQuery } from '../../../query/search.query.js'

export class KeysetPaginationQuery {
  @ApiProperty({ required: true })
  @Type(() => Number)
  @Max(100)
  @IsPositive()
  @IsInt()
  limit: number

  @ApiProperty({ required: true })
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  key?: string
}

export abstract class KeysetPaginationSearchQuery extends SearchQuery {
  @ApiProperty({ type: KeysetPaginationQuery })
  @IsOptional()
  @Type(() => KeysetPaginationQuery)
  @ValidateNested()
  pagination?: KeysetPaginationQuery
}
