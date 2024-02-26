import {
  IsBoolean,
  IsEnum,
  IsOptional
} from 'class-validator'
import { TypesenseAliasName } from '../collections/typesense.collections.js'

export class MigrateTypesenseQueryDto {
  @IsOptional()
  @IsBoolean()
  fresh: boolean = false

  @IsOptional()
  @IsEnum(TypesenseAliasName, { each: true })
  collections: TypesenseAliasName[] = Object.values(TypesenseAliasName)
}
