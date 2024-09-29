import { type ExceptionFilter, Catch, type ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { captureException } from '@sentry/node'
import { plainToInstance } from 'class-transformer'
import { EntityNotFoundError } from 'typeorm'
import { JsonApiError } from './types/json-api-error.type.js'
import { NotFoundError } from './generic/not-found.error.js'
import { ApiError } from './api-errors/api-error.js'
import { CompositeApiError } from './api-errors/composite.api-error.js'

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor (
    private readonly httpAdapterHost: HttpAdapterHost
  ) {}

  public catch (exception: Error, host: ArgumentsHost): void {
    const { status, errors } = this.handleException(exception)

    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()

    httpAdapter.reply(
      ctx.getResponse(),
      { errors },
      status
    )
  }

  private handleException (exception: Error): JsonApiError {
    if (exception instanceof JsonApiError) {
      return exception
    }

    if (exception instanceof CompositeApiError) {
      return this.mapCompositeApiErrorToJsonApiError(exception)
    }

    if (exception instanceof ApiError) {
      return this.mapApiErrorToJsonApiError(exception)
    }

    if (exception instanceof HttpException) {
      return this.mapHttpExceptionToJsonApiError(exception)
    }

    if (exception instanceof EntityNotFoundError) {
      return this.mapApiErrorToJsonApiError(
        new NotFoundError()
      )
    }

    return this.mapUnknownErrorToJsonApiError(exception)
  }

  private mapCompositeApiErrorToJsonApiError (error: CompositeApiError) {
    return plainToInstance(JsonApiError, {
      status: error.status,
      errors: error.errors
    })
  }

  private mapApiErrorToJsonApiError (exception: ApiError): JsonApiError {
    return plainToInstance(JsonApiError, {
      status: Number(exception.status),
      errors: [{
        code: exception.code,
        detail: exception.detail,
        status: exception.status,
        meta: exception.meta
      }]
    })
  }

  private mapHttpExceptionToJsonApiError (exception: HttpException): JsonApiError {
    return plainToInstance(JsonApiError, {
      status: exception.getStatus(),
      errors: [{
        status: exception.getStatus().toString(),
        code: exception.name,
        detail: exception.message
      }]
    })
  }

  private mapUnknownErrorToJsonApiError (exception: Error): JsonApiError {
    const id = captureException(exception)

    return plainToInstance(JsonApiError, {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      errors: [{
        id,
        code: exception?.name,
        detail: exception?.message
      }]
    })
  }
}
