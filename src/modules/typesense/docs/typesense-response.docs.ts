import { type ApiResponseOptions } from '@nestjs/swagger'

export const migrateTypesenseResponse: ApiResponseOptions = {
  status: 200,
  description: 'Successfully migrated collections.'
}

export const importTypesenseResponse: ApiResponseOptions = {
  status: 200,
  description: 'Successfully imported collections.'
}

export const getCollectionsTypenseResponse: ApiResponseOptions = {
  status: 200,
  description: 'Successfully retrieved collections.'
}
