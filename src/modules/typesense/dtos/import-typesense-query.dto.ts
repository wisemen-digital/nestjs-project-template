import {
  IsEnum,
  IsOptional
} from 'class-validator'
import { TypesenseAliasName } from '../collections/typesense.collections.js'

export class ImportTypesenseQueryDto {
  @IsOptional()
  @IsEnum(TypesenseAliasName, { each: true })
  collections: TypesenseAliasName[] = Object.values(TypesenseAliasName)
}
