import { Transformer } from '@appwise/transformer'
import { ApiProperty } from '@nestjs/swagger'

export class HealthStatusTransformerType {
  @ApiProperty({ type: String, example: 'OK', description: 'The status of the API.' })
  status: string
}

export class HealthStatusTransformer extends Transformer<number, HealthStatusTransformerType> {
  protected transform (): HealthStatusTransformerType {
    return { status: 'OK' }
  }
}
