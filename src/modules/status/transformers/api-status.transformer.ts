import assert from 'assert'
import { Transformer } from '@appwise/transformer'
import { ApiProperty } from '@nestjs/swagger'

export class ApiStatusTransformerType {
  @ApiProperty({ type: String, example: 'Development', description: 'On which environment the API is running.' })
  environment: string

  @ApiProperty({ type: String, example: '3733aa8', description: 'Commit hash of current running version.' })
  commit: string

  @ApiProperty({ type: String, example: '1.0.1', description: 'Version of the API.' })
  version: string

  @ApiProperty({ type: String, example: new Date().getTime(), description: 'Version timestamp.' })
  timestamp: string
}

export class ApiStatusTransformer extends Transformer<number, ApiStatusTransformerType> {
  protected transform (): ApiStatusTransformerType {
    const environment = process.env.NODE_ENV
    const commit = process.env.BUILD_COMMIT
    const version = process.env.BUILD_NUMBER
    const timestamp = process.env.BUILD_TIMESTAMP

    assert(environment, 'NODE_ENV is not set.')
    assert(commit, 'BUILD_COMMIT is not set.')
    assert(version, 'BUILD_NUMBER is not set.')
    assert(timestamp, 'BUILD_TIMESTAMP is not set.')

    return { environment, commit, version, timestamp }
  }
}
