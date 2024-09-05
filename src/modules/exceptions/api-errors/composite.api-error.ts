import { HttpStatus } from '@nestjs/common'
import { ApiError } from './api-error.js'

export abstract class CompositeApiError extends Error {
  public readonly status: HttpStatus
  public readonly errors: ApiError[]

  constructor (status: HttpStatus, ...errors: ApiError[]) {
    super()
    this.status = status
    this.errors = errors
  }

  add (...errors: ApiError[]) {
    this.errors.push(...errors)
  }
}
