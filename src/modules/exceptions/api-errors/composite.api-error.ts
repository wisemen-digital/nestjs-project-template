import { applyDecorators } from '@nestjs/common'
import type { ClassConstructor } from 'class-transformer'
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { ApiError } from './api-error.js'

export abstract class CompositeApiError extends Error {
  readonly abstract errors: ApiError[]
}

export function CompositeApiErrors (
  ...errors: Array<ClassConstructor<ApiError>>
): MethodDecorator {
  return applyDecorators(
    ApiExtraModels(...errors),
    createCompositeApiErrorDocs(errors)
  )
}

export function Foo (
  ...errors: ClassConstructor<ApiError>[]
): ClassDecorator {
  return <T extends object>(target: T): T => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const extraErrors = Reflect.getMetadata('COMPOSITE_ERRORS', target) ?? []

    Reflect.defineMetadata(
      'COMPOSITE_ERRORS',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      [...extraErrors, ...errors],
      target
    )

    return target
  }
}

export function Bar (): PropertyDecorator {
  return <T extends object>(target: T, key: string): void => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const errors = Reflect.getMetadata('COMPOSITE_ERRORS', target) ?? []
    const errorDocs = (errors as ClassConstructor<ApiError>[]).map(
      error => ({ $ref: getSchemaPath(error) })
    )

    const foo = ApiProperty({
      type: 'array',
      items: { anyOf: errorDocs }
    })

    return foo(target, key)
  }
}

function createCompositeApiErrorDocs (
  errors: Array<ClassConstructor<ApiError>>
): MethodDecorator {
  const errorDocs = errors.map(error => ({ $ref: getSchemaPath(error) }))

  return ApiProperty({
    type: 'array',
    items: { anyOf: errorDocs }
  })
}
