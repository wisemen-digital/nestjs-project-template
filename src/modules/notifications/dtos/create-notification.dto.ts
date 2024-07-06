import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class CreateNotificationDto {
  @IsUUID()
  @IsNotEmpty()
  userUuid: string

  @IsString()
  @IsNotEmpty()
  message: string
}
