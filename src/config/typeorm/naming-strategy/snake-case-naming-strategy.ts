import { DefaultNamingStrategy, Table } from 'typeorm'
import { snakeCase } from '../../../utils/strings/snake-case.js'

export class SnakeNamingStrategy extends DefaultNamingStrategy {
  tableName (className: string, customName: string | undefined): string {
    return customName ?? snakeCase(className)
  }

  columnName (
    propertyName: string,
    customName: string | undefined,
    embeddedPrefixes: string[]
  ): string {
    return (
      snakeCase(embeddedPrefixes.concat('').join('_'))
      + (customName ?? snakeCase(propertyName))
    )
  }

  relationName (propertyName: string): string {
    return snakeCase(propertyName)
  }

  joinColumnName (relationName: string, referencedColumnName: string): string {
    return snakeCase(relationName + '_' + referencedColumnName)
  }

  joinTableName (
    firstTableName: string,
    secondTableName: string,
    firstPropertyName: string,
    _secondPropertyName: string
  ): string {
    return snakeCase(
      firstTableName
      + '_'
      + firstPropertyName.replace(/\./gi, '_')
      + '_'
      + secondTableName
    )
  }

  joinTableColumnName (
    tableName: string,
    propertyName: string,
    columnName?: string
  ): string {
    return snakeCase(tableName + '_' + (columnName ?? propertyName))
  }

  primaryKeyName (tableOrName: Table | string): string {
    return 'PK_' + this.getSnakeTableName(tableOrName)
  }

  foreignKeyName (
    tableOrName: Table | string,
    columnNames: string[],
    referencedTablePath?: string,
    referencedColumnNames?: string[]
  ): string {
    const snakeTableName = this.getSnakeTableName(tableOrName)
    const referencedTableName = snakeCase(referencedTablePath ?? '')
    const referencingColumns = columnNames.map(snakeCase).join('_')
    const referencedColumns = (referencedColumnNames ?? []).map(snakeCase).join('_')

    return `FK_${snakeTableName}_${referencingColumns}_REFERENCES_${referencedTableName}_${referencedColumns}`
  }

  uniqueConstraintName (
    tableOrName: Table | string,
    columnNames: string[]
  ): string {
    return `UQ_${this.getSnakeTableName(tableOrName)}_${columnNames.map(snakeCase).join('_')}`
  }

  indexName (
    tableOrName: Table | string,
    columnNames: string[],
    where?: string
  ): string {
    const tableName = this.getSnakeTableName(tableOrName)
    let key = `${tableName}_${columnNames.map(snakeCase).join('_')}`

    if (where !== undefined) key += `_${where}}`

    return 'IDX_' + key
  }

  private getSnakeTableName (tableOrName: Table | string): string {
    const tableName = this.getTableName(tableOrName)
    const replacedTableName = tableName.replace('.', '_')

    return snakeCase(replacedTableName)
  }
}
