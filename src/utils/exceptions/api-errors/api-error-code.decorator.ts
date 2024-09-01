import { ApiProperty } from '@nestjs/swagger'

export function ApiErrorCode (code: string): PropertyDecorator {
  return ApiProperty({
    required: true,
    type: code,
    example: code
  })
}
