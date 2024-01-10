import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateUserDto {
  @ApiProperty({ type: String, nullable: true })
  @IsString()
  @IsOptional()
  firstName: string | null

  @ApiProperty({ type: String, nullable: true })
  @IsString()
  @IsOptional()
  lastName: string | null
}
