import { ApiProperty } from '@nestjs/swagger'
import { ApiError } from './api-error.js'

export abstract class ConflictApiError extends ApiError {
  @ApiProperty({
    required: true,
    type: String,
    example: '409'
  })
  status = '409'
}
