import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsPositive, Max } from 'class-validator'

export class InfiniteScrollQuery {
  @ApiProperty({ required: true })
  @IsOptional()
  @Type(() => Number)
  @Max(100)
  @IsPositive()
  @IsInt()
  limit?: number

  @ApiProperty({ required: true })
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  timestamp?: string

  get date (): Date | undefined {
    if (this.timestamp === undefined) return undefined

    return new Date(this.timestamp)
  }
}
