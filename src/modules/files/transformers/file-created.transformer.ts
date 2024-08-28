import { Transformer } from '@appwise/transformer'
import { ApiProperty } from '@nestjs/swagger'
import type { File } from '../entities/file.entity.js'
import { MimeType } from '../enums/mime-type.enum.js'

export class CreateFileResponse {
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
  extends Transformer<File, CreateFileResponse> {
  transform (file: File, uploadUrl: string): CreateFileResponse {
    return {
      uuid: file.uuid,
      name: file.name,
      mimeType: file.mimeType,
      uploadUrl
    }
  }
}
