import { type ApiResponseOptions } from '@nestjs/swagger'
import { ApiStatusTransformerType } from '../transformers/api-status.transformer.js'
import { HealthStatusTransformerType } from '../transformers/health-status.transformer.js'

export const GET_API_STATUS_RESPONSE: ApiResponseOptions = {
  status: 200,
  description: 'API status',
  type: ApiStatusTransformerType
}

export const GET_HEALTH_STATUS_RESPONSE: ApiResponseOptions = {
  status: 200,
  description: 'Health status',
  type: HealthStatusTransformerType
}
