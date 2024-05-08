import { Transformer } from '@appwise/transformer'
import { type File } from '../entities/file.entity.js'

export class FileCreatedTransformerType {
  uuid: string
  fileName: string
  mimeType: string | null
  uploadUrl: string
}

export class FileCreatedTransformer extends Transformer<File, FileCreatedTransformerType> {
  transform (file: File, uploadUrl: string): FileCreatedTransformerType {
    return {
      uuid: file.uuid,
      fileName: file.fileName,
      mimeType: file.mimeType,
      uploadUrl
    }
  }
}
