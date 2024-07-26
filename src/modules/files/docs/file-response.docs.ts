import { type ApiResponseOptions } from '@nestjs/swagger'
import { CreateFileResponse } from '../transformers/file-created.transformer.js'

export const CREATE_FILE_RESPONSE: ApiResponseOptions = {
  status: 201,
  description: 'The file is successfully created.',
  type: CreateFileResponse
}

export const CONFIRM_FILE_UPLOAD_RESPONSE: ApiResponseOptions = {
  status: 200,
  description: 'The file\'s upload is confirmed.'
}

export const DOWNLOAD_FILE_RESPONSE: ApiResponseOptions = {
  status: 302,
  description: 'The file is succesfully downloaded file.'
}

export const REMOVE_FILE_RESPONSE: ApiResponseOptions = {
  status: 200,
  description: 'The file is succesfully removed.'
}
