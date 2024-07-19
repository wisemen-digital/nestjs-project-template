import { type ApiResponseOptions } from '@nestjs/swagger'
import { CreateFileResponse } from '../transformers/file-created.transformer.js'

export const createFileResponse: ApiResponseOptions = {
  status: 201,
  description: 'The file is successfully created.',
  type: CreateFileResponse
}

export const confirmFileUploadResponse: ApiResponseOptions = {
  status: 200,
  description: 'The file\'s upload is confirmed.'
}

export const downloadFileResponse: ApiResponseOptions = {
  status: 302,
  description: 'The file is succesfully downloaded file.'
}

export const removeFileResponse: ApiResponseOptions = {
  status: 200,
  description: 'The file is succesfully removed.'
}
