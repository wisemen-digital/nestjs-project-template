import {
  IsBoolean,
  IsEnum,
  IsOptional
} from 'class-validator'
import { TypesenseAliasName } from '../enums/typesense-collection.index.enum.js'

export class MigrateTypesenseQueryDto {
  @IsOptional()
  @IsBoolean()
  fresh: boolean = false

  @IsOptional()
  @IsEnum(TypesenseAliasName, { each: true })
  collections: TypesenseAliasName[] = Object.values(TypesenseAliasName)
}
