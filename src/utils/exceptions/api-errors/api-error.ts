import { ApiProperty } from '@nestjs/swagger'

export abstract class ApiError extends Error {
  readonly abstract code: string
  readonly abstract status: string
  readonly abstract meta: unknown

  @ApiProperty({
    required: false,
    description: 'a human-readable explanation specific to this occurrence of the problem'
  })
  readonly detail?: string

  protected constructor (detail: string) {
    super()
    this.detail = detail
  }
}
