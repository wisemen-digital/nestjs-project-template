import type { ObjectLiteral, Repository } from 'typeorm'

export abstract class AbstractSeeder<T extends ObjectLiteral> {
  protected requiredRelations: string[] = []

  protected constructor (
    protected repository: Repository<T>
  ) {}

  protected checkRequiredRelations (entity: T): void {
    for (const relation of this.requiredRelations) {
      if ((entity)[relation] === undefined) {
        throw new Error(`Missing required relation: ${relation}`)
      }
    }
  }

  public async seedOne (entity: T): Promise<T> {
    this.checkRequiredRelations(entity)

    return await this.seed(entity)
  }

  public async seedMany (entities: T[]): Promise<T[]> {
    for (const entity of entities) {
      this.checkRequiredRelations(entity)
    }

    return await this.repository.save(entities)
  }

  protected async seed (entity: T): Promise<T> {
    return await this.repository.save(entity)
  }
}
