import { Optional } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength
} from 'class-validator'

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string

  @ApiProperty({ type: String, nullable: true })
  @Optional()
  @IsString()
  firstName: string | null

  @ApiProperty({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  lastName: string | null
}
