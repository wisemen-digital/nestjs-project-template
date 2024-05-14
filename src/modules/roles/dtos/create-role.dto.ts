import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Matches, IsString } from 'class-validator'

export class CreateRoleDto {
  @ApiProperty({ type: String, description: 'The name of the role' })
  @IsNotEmpty()
  @Matches(/^[a-zA-Z-]+$/)
  @IsString()
  name: string
}
