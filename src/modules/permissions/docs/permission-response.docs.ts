import { type ApiResponseOptions } from '@nestjs/swagger'
import { Permission } from '../enums/permission.enum.js'

export const GET_PERMISSIONS_RESPONSE: ApiResponseOptions = {
  status: 200,
  description: 'The permissions have been successfully received.',
  schema: {
    type: 'array',
    items: {
      type: 'enum',
      enum: Object.values(Permission)
    },
    example: Object.values(Permission)
  }
}
