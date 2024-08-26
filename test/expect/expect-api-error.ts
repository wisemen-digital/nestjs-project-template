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
      const stringifiedExpected = this.utils.printReceived(actualError)
      const stringifiedActual = this.utils.printReceived(expectedError)
      return {
        pass: true,
        message: () => `expected ${stringifiedExpected} not to be ${stringifiedActual}`
      }
    } else {
      return {
        pass: false,
        message: () => '\n' +
          this.utils.printDiffOrStringify(expectedError, actualError, 'Expected', 'Received', false)
      }
    }
  }

declare module 'expect' {
  interface AsymmetricMatchers {
    toHaveApiError: (error: ApiError) => ExpectationResult
  }
  interface Matchers<R> {
    toHaveApiError: (error: ApiError) => R
  }
}
