import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsOptional
} from 'class-validator'
import { Transform } from 'class-transformer'
import { TypesenseCollection } from '../enums/typesense-collection-index.enum.js'

export class MigrateTypesenseQueryDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ obj, key }) => obj[key] === 'true')
  @IsIn([true, false])
  fresh: boolean

  @IsOptional()
  @IsEnum(TypesenseCollection, { each: true })
  collections: TypesenseCollection[] = Object.values(TypesenseCollection)
}
