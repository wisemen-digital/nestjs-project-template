import { type ApiResponseOptions } from '@nestjs/swagger'

export const createFileResponse: ApiResponseOptions = {
  status: 201,
  description: 'Successfully created file'
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
