import { CustomError, defaultErrors, DtoRouter } from '@appwise/express-dto-router'
import { EntityNotFoundError } from 'typeorm'

export const knownErrors = {
  ...defaultErrors,
  example_error: {
    detail: 'This is an example description',
    status: 400
  },
  not_editable: {
    detail: 'This object is not editable',
    status: 400
  }
}

type listTypes = keyof typeof knownErrors

CustomError.errors = knownErrors

export class KnownError extends CustomError<listTypes> {
}

DtoRouter.mapError = (error: Error) => {
  if (error instanceof EntityNotFoundError) return new KnownError('not_found')
  else return error
}
