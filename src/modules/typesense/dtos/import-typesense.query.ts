import {
  IsEnum,
  IsOptional
} from 'class-validator'
import { TypesenseCollectionName } from '../enums/typesense-collection-index.enum.js'

export class ImportTypesenseQuery {
  @IsOptional()
  @IsEnum(TypesenseCollectionName, { each: true })
  collections: TypesenseCollectionName[] = Object.values(TypesenseCollectionName)
}
