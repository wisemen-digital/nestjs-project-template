import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { MimeType } from '../enums/mime-type.enum.js'
import { toLowercase } from '../../../utils/transformers/to-lower-case.js'

export class CreateFileDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => toLowercase(value))
  name: string

  @ApiProperty({ type: 'string', enum: MimeType })
  @IsNotEmpty()
  @IsEnum(MimeType)
  mimeType: MimeType
}
