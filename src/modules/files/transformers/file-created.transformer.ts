import { Transformer } from '@appwise/transformer'
import { ApiProperty } from '@nestjs/swagger'
import { plainToInstance } from 'class-transformer'
import { type File } from '../entities/file.entity.js'
import { MimeType } from '../enums/mime-type.enum.js'

export class CreateFileResponseTransformerType {
  @ApiProperty({ type: 'string', format: 'uuid' })
  uuid: string

  @ApiProperty({ type: 'string' })
  name: string

  @ApiProperty({ type: 'enum', enum: MimeType, nullable: true })
  mimeType: MimeType | null

  @ApiProperty({ type: 'string' })
  uploadUrl: string
}

export class CreateFileResponseTransformer
  extends Transformer<File, CreateFileResponseTransformerType> {
  transform (file: File, uploadUrl: string): CreateFileResponseTransformerType {
    return plainToInstance(CreateFileResponseTransformerType, {
      uuid: file.uuid,
      name: file.name,
      mimeType: file.mimeType,
      uploadUrl
    })
  }
}
