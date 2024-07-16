import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID, Max, Min } from 'class-validator'
import { IsNullable } from '../../../common/validators/is-nullable.validator.js'

export class CreateFileLinkDto {
  @ApiProperty({ format: 'uuid' })
  @IsString()
  @IsUUID()
  fileUuid: string

  @ApiProperty({ type: 'integer', nullable: true })
  @IsNullable()
  @Min(0)
  @Max(1000)
  order: number | null
}
