import { type ApiResponseOptions } from '@nestjs/swagger'
import { ApiStatusTransformerType } from '../transformers/api-status.transformer.js'
import { HealthStatusTransformerType } from '../transformers/health-status.transformer.js'

export const getApiStatusResponse: ApiResponseOptions = {
  status: 200,
  description: 'API status',
  type: ApiStatusTransformerType
}

export const getHealthStatusResponse: ApiResponseOptions = {
  status: 200,
  description: 'Health status',
  type: HealthStatusTransformerType
}
