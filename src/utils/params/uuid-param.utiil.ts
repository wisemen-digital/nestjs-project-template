import { Param, ParseUUIDPipe } from '@nestjs/common'

export const UuidParam = (param: string): ParameterDecorator => Param(param, ParseUUIDPipe)
