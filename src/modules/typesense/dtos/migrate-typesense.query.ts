import {
  IsBoolean,
  IsEnum,
  IsOptional
} from 'class-validator'
import { TypesenseCollectionName } from '../enums/typesense-collection-index.enum.js'

export class MigrateTypesenseQuery {
  @IsBoolean()
  fresh: boolean

  @IsOptional()
  @IsEnum(TypesenseCollectionName, { each: true })
  collections: TypesenseCollectionName[] = Object.values(TypesenseCollectionName)
}
