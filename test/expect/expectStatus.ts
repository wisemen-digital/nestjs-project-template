import type { ExpectationResult, MatcherFunction } from 'expect'

export const toHaveStatus: MatcherFunction<[status: number]> = function (
  response: { status?: unknown, body?: unknown },
  status: number
): ExpectationResult {
  if (response.status === status) {
    return {
      pass: true,
      message: () =>
        `expected status ${this.utils.printReceived(response.status)} not to be `
        + `status ${this.utils.printExpected(status)}.\n`
        + `${JSON.stringify(response.body, undefined, 2)}`
    }
  } else {
    return {
      pass: false,
      message: () =>
        `expected status ${this.utils.printReceived(response.status)} to be `
        + `status ${this.utils.printExpected(status)}.\n`
        + `${JSON.stringify(response.body, undefined, 2)}`
    }
  }
}

declare module 'expect' {
  interface AsymmetricMatchers {
    /**
     * Validate whether the value is a string that
     * represents a uuid.
     */
    toHaveStatus: (status: number) => ExpectationResult
  }
  interface Matchers<R> {
    /**
     * Validate whether the value is a string that
     * represents a uuid.
     */
    toHaveStatus: (status: number) => R
  }
}
