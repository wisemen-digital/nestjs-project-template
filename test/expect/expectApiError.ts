/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { type ExpectationResult, type MatcherFunction } from 'expect'
import { type ApiError } from '../../src/utils/exceptions/api-errors/api-error.js'

export const toHaveApiError: MatcherFunction<[ApiError]> =
function (received: { body?: unknown }, error: ApiError): ExpectationResult {
  const expectedError = {
    code: error.code,
    status: error.status,
    detail: error.detail,
    meta: error.meta
  }

  const actualError = received.body

  if (this.equals(actualError, expectedError)) {
    return {
      pass: true,
      message: () => `expected ${this.utils.printReceived(actualError)} not to be ${this.utils.printReceived(expectedError)}`
    }
  } else {
    return {
      pass: false,
      // message: () => `expected ${this.utils.printReceived(actualError)} to be ${this.utils.printReceived(expectedError)}`
      message: () => '\n' + this.utils.printDiffOrStringify(expectedError, actualError, 'Expected', 'Received', false)
    }
  }
}

declare module 'expect' {
  interface AsymmetricMatchers {
    /**
     * Validate whether the value is of given type.
     */
    toHaveApiError: (error: ApiError) => ExpectationResult
  }
  interface Matchers<R> {
    /**
     * Validate whether the value is of given type.
     */
    toHaveApiError: (error: ApiError) => R
  }
}
