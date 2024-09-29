import {
  IsBoolean,
  IsEnum,
  IsOptional
} from 'class-validator'
import { Transform } from 'class-transformer'
import { TypesenseCollectionName } from '../enums/typesense-collection-index.enum.js'
import { toBoolean } from '../../../utils/transformers/to-boolean.js'

export class MigrateTypesenseQuery {
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  fresh: boolean

  @IsOptional()
  @IsEnum(TypesenseCollectionName, { each: true })
  collections: TypesenseCollectionName[] = Object.values(TypesenseCollectionName)
}
