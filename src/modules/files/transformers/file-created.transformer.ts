import { Transformer } from '@appwise/transformer'
import { ApiProperty } from '@nestjs/swagger'
import { plainToInstance } from 'class-transformer'
import { type File } from '../entities/file.entity.js'
import { MimeType } from '../enums/mime-type.enum.js'

export class CreateFileResponse {
  @ApiProperty()
  uuid: string

  @ApiProperty()
  name: string

  @ApiProperty({ type: 'enum', enum: MimeType, nullable: true })
  mimeType: MimeType | null

  @ApiProperty()
  uploadUrl: string
}

export class CreateFileResponseTransformer extends Transformer<File, CreateFileResponse> {
  transform (file: File, uploadUrl: string): CreateFileResponse {
    return plainToInstance(CreateFileResponse, {
      uuid: file.uuid,
      name: file.name,
      mimeType: file.mimeType,
      uploadUrl
    })
  }
}
