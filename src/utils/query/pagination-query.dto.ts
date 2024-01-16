import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsPositive, Max, Min } from 'class-validator'

export class PaginationQuery {
  @ApiProperty({ required: true })
  @IsOptional()
  @Type(() => Number)
  @Max(100)
  @IsPositive()
  @IsInt()
    limit?: number

  @ApiProperty({ required: true })
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @IsInt()
    page?: number

  get offset (): number | undefined {
    if (this.page == null || this.limit == null) return undefined
    return this.page * this.limit
  }
}
