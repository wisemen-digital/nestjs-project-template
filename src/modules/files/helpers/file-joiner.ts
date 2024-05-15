import { type ObjectLiteral, type SelectQueryBuilder } from 'typeorm'

export class FileJoiner<T extends ObjectLiteral> {
  private count = 1
  constructor (
    private readonly queryBuilder: SelectQueryBuilder<T>,
    private readonly entityType: string
  ) {}

  private join (
    method: 'leftJoinAndMapOne' | 'leftJoinAndMapMany',
    property: string,
    entityPart: string,
    alias?: string
  ): this {
    const queryAlias = alias ?? entityPart
    const fileAlias = `${queryAlias}Files`

    const condition = `${queryAlias}.entityUuid = ${this.entityType}.uuid
                        AND ${queryAlias}.entityType = '${this.entityType}'
                        AND ${queryAlias}.entityPart = :${entityPart}_${this.count}`
    const parameters = { [`${entityPart}_${this.count}`]: entityPart }

    this.queryBuilder[method](property, File, queryAlias, condition, parameters)

    this.queryBuilder.leftJoinAndMapOne(
      `${queryAlias}.file`,
      fileAlias,
      `${fileAlias}.uuid = ${queryAlias}.fileUuid`
    )

    this.count += 1

    return this
  }

  public joinFile (property: string, entityPart: string, alias?: string): this {
    return this.join('leftJoinAndMapOne', property, entityPart, alias)
  }

  public joinFiles (property: string, entityPart: string, alias?: string): this {
    return this.join('leftJoinAndMapMany', property, entityPart, alias)
  }
}
