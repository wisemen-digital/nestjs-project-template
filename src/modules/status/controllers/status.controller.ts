import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Public } from '../../permissions/decorators/permissions.decorator.js'
import { ApiStatusTransformer, ApiStatusTransformerType } from '../transformers/api-status.transformer.js'
import { HealthStatusTransformer, HealthStatusTransformerType } from '../transformers/health-status.transformer.js'
import { GET_API_STATUS_RESPONSE, GET_HEALTH_STATUS_RESPONSE } from '../docs/status-response.docs.js'

@ApiTags('Default')
@Controller({
  version: ''
})
@Public()
export class StatusController {
  @Get('/')
  @ApiOkResponse(GET_API_STATUS_RESPONSE)
  public getApiStatus (): ApiStatusTransformerType {
    return new ApiStatusTransformer().item(0)
  }

  @Get('/health')
  @ApiOkResponse(GET_HEALTH_STATUS_RESPONSE)
  public getHealthStatus (): HealthStatusTransformerType {
    return new HealthStatusTransformer().item(0)
  }
}
