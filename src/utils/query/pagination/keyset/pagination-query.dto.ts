import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDateString, IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator'

export class KeysetPaginationQuery {
  @ApiProperty({ required: true, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @Max(100)
  @Min(1)
  @IsInt()
  limit: number

  @ApiProperty({ required: true })
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  key?: string
}
