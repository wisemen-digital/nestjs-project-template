import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, ValidateNested } from 'class-validator'
import { SortQuery, MatchQuery, LikeQuery } from '../../../utils/query/search-query.dto.js'
import { PaginatedSearchQuery } from '../../../utils/query/paginated-search-query.dto.js'

export class UserQuery extends PaginatedSearchQuery {
  @ApiProperty({ type: SortQuery })
  @IsOptional()
  @ValidateNested()
  sort?: SortQuery

  @ApiProperty({ type: MatchQuery })
  @IsOptional()
  @ValidateNested()
  match?: MatchQuery

  @ApiProperty({ type: LikeQuery })
  @IsOptional()
  @ValidateNested()
  like?: LikeQuery
}
