import { IsOptional, IsString } from 'class-validator'

export class QueryDto {
  @IsOptional()
  @IsString()
  q?: string
}
