import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsInt, IsPositive, Max, Min } from 'class-validator'

export class OffsetPaginationQuery {
  @ApiProperty({ minimum: 1, maximum: 100 })
  @Transform(({ value }) => Number(value))
  @Type(() => Number)
  @Max(100)
  @IsPositive()
  @IsInt()
  limit: number

  @ApiProperty({ minimum: 0 })
  @Transform(({ value }) => Number(value))
  @Type(() => Number)
  @Min(0)
  @IsInt()
  offset: number
}
