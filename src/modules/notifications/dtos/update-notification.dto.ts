import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber, IsNotEmpty, IsBoolean } from 'class-validator'

export class UpdateNotificationDto {
  @ApiProperty({ type: 'number', description: 'Bit value representing notification' })
  @IsNumber()
  @IsNotEmpty()
  bit: number

  @ApiProperty({ type: 'boolean', description: 'Enable or disable' })
  @IsBoolean()
  @Type(() => Boolean)
  state: boolean
}
