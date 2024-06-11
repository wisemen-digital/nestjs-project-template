import assert from 'assert'
import { Controller, Get } from '@nestjs/common'
import { ApiStatusType } from '../types/api-status.type.js'
import { Public } from '../../permissions/permissions.decorator.js'

@Controller({
  version: ''
})
export class StatusController {
  @Get()
  @Public()
  getApiStatus (): ApiStatusType {
    assert(process.env.NODE_ENV, 'NODE_ENV is not defined')
    assert(process.env.COMMIT, 'COMMIT is not defined')
    assert(process.env.BUILD_NUMBER, 'BUILD_NUMBER is not defined')

    return {
      environment: process.env.NODE_ENV,
      commit: process.env.COMMIT,
      version: process.env.BUILD_NUMBER
    }
  }
}
