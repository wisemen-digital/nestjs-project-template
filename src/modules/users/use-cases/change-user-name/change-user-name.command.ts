import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class ChangeUserNameCommand {
  @ApiProperty({ type: String, required: false, example: 'John' })
  @IsString()
  @IsOptional()
  firstName?: string

  @ApiProperty({ type: String, required: false, example: 'Doe' })
  @IsString()
  @IsOptional()
  lastName?: string
}
