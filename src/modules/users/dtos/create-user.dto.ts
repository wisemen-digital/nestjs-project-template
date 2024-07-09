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
  @ApiProperty({ type: String, format: 'email' })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  @MinLength(6)
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
