import { Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import { Client } from '../../entities/client.entity.js'
import { ClientRepository } from '../../repositories/client.repository.js'

@Injectable()
export class ClientSeeder {
  constructor (
    manager: EntityManager,
    private readonly clientRepository: ClientRepository = new ClientRepository(manager)
  ) {}

  async getTestClient (): Promise<Client> {
    let client = await this.clientRepository.findOneBy({ name: 'test-env' })

    if (client === null) {
      client = new Client()
      client.name = 'test-env'
      client.scopes = ['read', 'write']

      await this.clientRepository.save(client)
    }

    return client
  }
}
