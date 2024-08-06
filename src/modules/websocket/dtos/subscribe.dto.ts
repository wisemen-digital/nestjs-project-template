import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Matches, IsString } from 'class-validator'

export class SubscribeDto {
  @ApiProperty({ type: String, description: 'The nats topic' })
  @IsNotEmpty()
  @Matches(/^([a-zA-Z0-9-]+|\*|>)(\.([a-zA-Z0-9-]+|\*|>))*$/)
  @IsString()
  topic: string
}
