import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'
import { PASSWORD_MIN_LENGTH } from '../../constants/password.constant.js'

export class ChangePasswordCommand {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  oldPassword: string

  @ApiProperty({ example: 'password', minLength: PASSWORD_MIN_LENGTH })
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  newPassword: string
}
