import { ApiError } from './api-error.js'

export abstract class CompositeApiError extends Error {
  public readonly errors: ApiError[]

  constructor (...errors: ApiError[]) {
    super()
    this.errors = errors
  }

  add (...errors: ApiError[]) {
    this.errors.push(...errors)
  }
}
