import { Optional } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength
} from 'class-validator'
import { PASSWORD_MIN_LENGTH } from '../../constants/password.constant.js'

export class RegisterUserCommand {
  @ApiProperty({ format: 'email' })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({ example: 'password', minLength: PASSWORD_MIN_LENGTH })
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  password: string

  @ApiProperty({ type: String, nullable: true, example: 'John' })
  @Optional()
  @IsString()
  firstName: string | null

  @ApiProperty({ type: String, nullable: true, example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName: string | null
}
