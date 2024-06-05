import { type ApiResponseOptions } from '@nestjs/swagger'
import { CreateFileResponseTransformerType } from '../transformers/file-created.transformer.js'

export const createFileResponse: ApiResponseOptions = {
  status: 201,
  description: 'Successfully created file',
  type: CreateFileResponseTransformerType
}

export const confirmFileUploadResponse: ApiResponseOptions = {
  status: 200,
  description: 'Successfully confirmed file upload'
}

export const downloadFileResponse: ApiResponseOptions = {
  status: 302,
  description: 'Successfully downloaded file'
}

export const removeFileResponse: ApiResponseOptions = {
  status: 200,
  description: 'Successfully removed file'
}
