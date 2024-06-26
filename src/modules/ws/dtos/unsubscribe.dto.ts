import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Matches, IsString } from 'class-validator'

export class UnsubscribeDto {
  @ApiProperty({ type: String, description: 'The nats topic' })
  @IsNotEmpty()
  @Matches(/^([a-z]+|\*|>)(\.([a-z]+|\*|>))*$/)
  @IsString()
  topic: string
}
