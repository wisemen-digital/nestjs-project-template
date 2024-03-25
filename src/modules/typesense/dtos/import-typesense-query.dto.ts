import {
  IsEnum,
  IsOptional
} from 'class-validator'
import { TypesenseAliasName } from '../enums/typesense-collection.index.enum.js'

export class ImportTypesenseQueryDto {
  @IsOptional()
  @IsEnum(TypesenseAliasName, { each: true })
  collections: TypesenseAliasName[] = Object.values(TypesenseAliasName)
}
