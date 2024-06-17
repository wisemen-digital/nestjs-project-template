import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsOptional
} from 'class-validator'
import { Transform } from 'class-transformer'
import { TypesenseCollectionName } from '../enums/typesense-collection-index.enum.js'

export class MigrateTypesenseQueryDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ obj, key }) => obj[key] === 'true')
  @IsIn([true, false])
  fresh: boolean

  @IsOptional()
  @IsEnum(TypesenseCollectionName, { each: true })
  collections: TypesenseCollectionName[] = Object.values(TypesenseCollectionName)
}
