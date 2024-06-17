import { Equals, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { OffsetPaginatedSearchQuery } from '../../../utils/query/pagination/offset/paginated-search-query.dto.js'
import { UsersFilterQuery } from './user-filter.query.js'

export class UserQuery extends OffsetPaginatedSearchQuery {
  @Equals(undefined)
  sort?: never

  @ApiProperty({ type: UsersFilterQuery })
  @IsOptional()
  @Type(() => UsersFilterQuery)
  @ValidateNested()
  filter?: UsersFilterQuery

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  search?: string
}
