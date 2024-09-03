import { InvalidPasswordError } from '../../../utils/helpers/hash.helper.js'
import {
  InvalidOldPasswordError
} from '../../users/use-cases/change-password/invalid-old-password.error.js'
import { ApiError } from './api-error.js'
import { Bar, CompositeApiError, Foo } from './composite.api-error.js'

@Foo(InvalidPasswordError, InvalidOldPasswordError)
export class ExampleCompositeApiError extends CompositeApiError {
  @Bar()
  errors: ApiError[]

  constructor (errors: ApiError[]) {
    super()
    this.errors = errors
  }
}
