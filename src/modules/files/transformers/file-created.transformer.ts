import { Transformer } from '@appwise/transformer'
import { ApiProperty, ApiResponse } from '@nestjs/swagger'
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

export function CreateFileResponseDoc (): ReturnType<typeof ApiResponse> {
  return ApiResponse({
    status: 201,
    description: 'Successfully created file',
    type: CreateFileResponse
  })
}
