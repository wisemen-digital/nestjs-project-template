import type { ApiResponseOptions } from '@nestjs/swagger'
import { CreateFileResponse } from '../transformers/file-created.transformer.js'

export const createFileApiResponse: ApiResponseOptions = {
  status: 201,
  description: 'Successfully created file',
  type: CreateFileResponse
}

export const confirmFileUploadApiResponse: ApiResponseOptions = {
  status: 200,
  description: 'Successfully confirmed file upload'
}

export const downloadFileApiResponse: ApiResponseOptions = {
  status: 302,
  description: 'Successfully downloaded file'
}

export const removeFileApiResponse: ApiResponseOptions = {
  status: 200,
  description: 'Successfully removed file'
}
