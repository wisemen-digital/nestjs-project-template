import { Injectable } from '@nestjs/common'
import type { Pkce } from '../entities/pkce.entity.js'
import { PkceRepository } from '../repositories/pkce.repository.js'

@Injectable()
export class PkceService {
  constructor (
    private readonly pkceRepository: PkceRepository
  ) {}

  async find (uuid: string): Promise<Pkce> {
    const pkce = await this.pkceRepository.findOneByOrFail({ uuid })

    return pkce
  }

  async create (body: Pkce): Promise<Pkce> {
    const pkce = this.pkceRepository.create(body)

    await this.pkceRepository.save(pkce)

    return pkce
  }
}
