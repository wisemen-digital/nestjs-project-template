import {
  IsBoolean,
  IsEnum,
  IsOptional
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { TypesenseCollectionName } from '../enums/typesense-collection-index.enum.js'

export class MigrateTypesenseQueryDto {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({ type: Boolean, description: 'Whether to refresh the Typesense collections.' })
  fresh: boolean = false

  @IsOptional()
  @IsEnum(TypesenseCollectionName, { each: true })
  @ApiProperty({ type: String, enum: TypesenseCollectionName, isArray: true, description: 'The collections to migrate.' })
  collections: TypesenseCollectionName[] = Object.values(TypesenseCollectionName)
}
