import { Param, ParseUUIDPipe } from '@nestjs/common'

export function UuidParam (param: string): ParameterDecorator {
  return Param(param, ParseUUIDPipe)
}
