import { type HttpStatusCode } from 'axios'
import { ApiProperty } from '@nestjs/swagger'

export function ApiErrorStatus (status: HttpStatusCode): PropertyDecorator {
  return ApiProperty({
    required: true,
    type: String,
    example: status.toString()
  })
}
