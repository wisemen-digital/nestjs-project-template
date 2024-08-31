import { type ExceptionFilter, Catch, type ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { captureException } from '@sentry/node'
import { EntityNotFoundError } from 'typeorm'
import { ApiError } from './api-errors/api-error.js'
import { NotFoundError } from './generic/not-found.error.js'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor (private readonly httpAdapterHost: HttpAdapterHost) {}

  catch (exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const { status, response } = this.getResponse(exception)

    this.httpAdapterHost.httpAdapter.reply(ctx.getResponse(), response, status)
  }

  private getResponse (error: Error): { status: number, response: unknown } {
    const exception = this.mapError(error)

    if (exception instanceof ApiError) {
      return {
        status: Number(exception.status),
        response: {
          errors: [{
            code: exception.code,
            detail: exception.detail,
            status: exception.status,
            meta: exception.meta
          }]
        }
      }
    } else if (exception instanceof HttpException) {
      return {
        status: exception.getStatus() ?? HttpStatus.INTERNAL_SERVER_ERROR,
        response: exception.getResponse()
      }
    } else {
      const id = captureException(exception)

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        response: {
          id,
          code: exception?.name,
          detail: exception?.message
        }
      }
    }
  }

  private mapError (exception: Error): Error {
    if (exception instanceof EntityNotFoundError) {
      return new NotFoundError()
    }

    return exception
  }
}
