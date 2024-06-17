import { IsArray, IsEnum, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { FilterQuery } from '../../../utils/query/search-query.dto.js'
import { Permission } from '../../permissions/permission.enum.js'

export class UsersFilterQuery extends FilterQuery {
  @ApiProperty({ enum: Permission, required: false, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(Permission, { each: true })
  permissions?: Permission[]
}
