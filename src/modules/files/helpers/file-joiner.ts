import { type ObjectLiteral, type SelectQueryBuilder } from 'typeorm'
import { FileLink } from '../entities/file-link.entity.js'

export class FileJoiner<T extends ObjectLiteral> {
  constructor (
    private readonly queryBuilder: SelectQueryBuilder<T>,
    private readonly entityType: T
  ) {}

  public joinFile (
    collectionName: keyof T,
    mapMany: boolean = true
  ): FileJoiner<T> {
    const collectionNameString = collectionName.toString()
    const entityTypeName = this.entityType.constructor.name.toLowerCase()

    const fileEntityAlias = collectionNameString
    const fileAlias = `${collectionNameString}File`

    if (mapMany) {
      this.queryBuilder.leftJoinAndMapMany(
        `${entityTypeName}.${fileEntityAlias}`,
        FileLink,
        fileEntityAlias,
        `${fileEntityAlias}.entityUuid = ${entityTypeName}.uuid
      AND ${fileEntityAlias}.entityType = '${entityTypeName}'
      AND ${fileEntityAlias}.collectionName = '${collectionNameString}'
      `
      )
    } else {
      this.queryBuilder.leftJoinAndMapOne(
        `${entityTypeName}.${fileEntityAlias}`,
        FileLink,
        fileEntityAlias,
        `${fileEntityAlias}.entityUuid = ${entityTypeName}.uuid
      AND ${fileEntityAlias}.entityType = '${entityTypeName}'
      AND ${fileEntityAlias}.collectionName = '${collectionNameString}'
      `
      )
    }

    // Conditionally adding join and where clause for filtering by entityPart
    this.queryBuilder.leftJoinAndSelect(
      `${fileEntityAlias}.file`,
      fileAlias,
      `${fileAlias}.uuid = ${fileEntityAlias}.fileUuid`
    )

    return this
  }
}
