import { Controller, Get } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Public } from '../../permissions/decorators/permissions.decorator.js'
import { ApiStatusTransformer, ApiStatusTransformerType } from '../transformers/api-status.transformer.js'
import { HealthStatusTransformer, HealthStatusTransformerType } from '../transformers/health-status.transformer.js'
import { getApiStatusResponse, getHealthStatusResponse } from '../docs/status-response.docs.js'

@ApiTags('Default')
@Controller({
  version: ''
})
@Public()
export class StatusController {
  @Get('/')
  @ApiResponse(getApiStatusResponse)
  public getApiStatus (): ApiStatusTransformerType {
    return new ApiStatusTransformer().item(0)
  }

  @Get('/health')
  @ApiResponse(getHealthStatusResponse)
  public getHealthStatus (): HealthStatusTransformerType {
    return new HealthStatusTransformer().item(0)
  }
}
