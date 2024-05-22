import {
  IsEnum,
  IsOptional
} from 'class-validator'
import { TypesenseCollection } from '../enums/typesense-collection-index.enum.js'

export class ImportTypesenseQueryDto {
  @IsOptional()
  @IsEnum(TypesenseCollection, { each: true })
  collections: TypesenseCollection[] = Object.values(TypesenseCollection)
}
