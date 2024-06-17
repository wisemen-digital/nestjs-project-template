import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsPositive, Max, Min } from 'class-validator'

export class OffsetPaginationQuery {
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
