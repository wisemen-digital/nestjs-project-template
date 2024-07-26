import { type ApiResponseOptions } from '@nestjs/swagger'

export const MIGRATE_TYPESENSE_RESPONSE: ApiResponseOptions = {
  status: 200,
  description: 'Successfully migrated collections.'
}

export const IMPORT_TYPESESE_RESPONSE: ApiResponseOptions = {
  status: 200,
  description: 'Successfully imported collections.'
}

export const GET_COLLECTIONS_TYPESENSE_RESPONSE: ApiResponseOptions = {
  status: 200,
  description: 'Successfully retrieved collections.'
}
