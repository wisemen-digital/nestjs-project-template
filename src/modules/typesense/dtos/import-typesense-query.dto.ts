import {
  IsEnum,
  IsOptional
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { TypesenseCollectionName } from '../enums/typesense-collection-index.enum.js'

export class ImportTypesenseQueryDto {
  @IsOptional()
  @IsEnum(TypesenseCollectionName, { each: true })
  @ApiProperty({ type: String, enum: TypesenseCollectionName, isArray: true, description: 'The collections to migrate.' })
  collections: TypesenseCollectionName[] = Object.values(TypesenseCollectionName)
}
