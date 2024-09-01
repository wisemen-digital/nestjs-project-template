import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class ChangePasswordCommand {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  oldPassword: string

  @ApiProperty()
  @IsString()
  @MinLength(6)
  newPassword: string
}
