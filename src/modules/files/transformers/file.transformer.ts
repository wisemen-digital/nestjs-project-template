import { Transformer } from '@appwise/transformer'
import { ApiProperty } from '@nestjs/swagger'
import { type FileEntity } from '../entities/file-entity.entity.js'

export class FileTransformerType {
  @ApiProperty({ format: 'uuid' })
  uuid: string

  @ApiProperty({ format: 'date-time' })
  createdAt: Date

  @ApiProperty({ format: 'date-time' })
  updatedAt: Date

  @ApiProperty()
  fileName: string

  @ApiProperty({ type: 'string', nullable: true })
  mimeType: string | null

  @ApiProperty()
  collectionName: string

  @ApiProperty({ type: 'integer', nullable: true })
  order: number | null

  @ApiProperty({ format: 'url' })
  url: string
}

export class FileTransformer extends Transformer<FileEntity, FileTransformerType> {
  transform (fileMorph: FileEntity): FileTransformerType {
    if (fileMorph.file == null) throw new Error('File is not loaded on FileEntity')

    return {
      uuid: fileMorph.file.uuid,
      createdAt: fileMorph.createdAt,
      updatedAt: fileMorph.updatedAt,
      fileName: fileMorph.file.fileName,
      mimeType: fileMorph.file.mimeType,
      collectionName: fileMorph.collectionName,
      order: fileMorph.order,
      url: fileMorph.file.url
    }
  }
}
