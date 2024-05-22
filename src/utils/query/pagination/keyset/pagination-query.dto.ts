import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsPositive, Max } from 'class-validator'

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
