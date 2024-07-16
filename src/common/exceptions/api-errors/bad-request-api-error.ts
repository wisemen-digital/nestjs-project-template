import { ApiProperty } from '@nestjs/swagger'
import { ApiError } from './api-error.js'

export abstract class BadRequestApiError extends ApiError {
  @ApiProperty({
    required: true,
    type: String,
    example: '400'
  })
  status = '400'
}
