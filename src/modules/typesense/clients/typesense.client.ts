import { Injectable } from '@nestjs/common'
import Typesense from 'typesense'

@Injectable()
export class TypesenseClient {
  private _client: Typesense.Client

  constructor () {
    this.initialize()
  }

  private initialize (): void {
    if (
      process.env.TYPESENSE_HOST == null
      || process.env.TYPESENSE_KEY == null
    ) {
      return
    }

    this._client = new Typesense.Client({
      nodes: [{
        host: process.env.TYPESENSE_HOST,
        port: 8108,
        protocol: 'http'
      }],
      apiKey: process.env.TYPESENSE_KEY
    })
  }

  public get client (): Typesense.Client {
    if (this._client == null) {
      throw new Error('Typesense is not initialized')
    }

    return this._client
  }
}
