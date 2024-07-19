import { Transformer } from '@appwise/transformer'
import { ApiProperty } from '@nestjs/swagger'

export class RoleCountTransformerType {
  @ApiProperty({ type: Number, description: 'The count of the roles' })
  count: number
}

export class RoleCountTransformer extends Transformer<number, RoleCountTransformerType> {
  protected transform (count: number): RoleCountTransformerType {
    return { count }
  }
}
