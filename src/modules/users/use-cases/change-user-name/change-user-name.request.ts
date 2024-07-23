import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class ChangeUserNameRequest {
  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  firstName?: string

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  lastName?: string
}
