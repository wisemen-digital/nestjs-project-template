import type { AbstractCronjob } from '../abstract-cronjob/abstract-cronjob.js'
import { ImportTypesenseCronjob } from '../import-typesense.cronjob.js'

export enum CronJobType {
  IMPORT_TYPESENSE = 'import-typesense'
}

export class CronjobFactory {
  static create (type: CronJobType): AbstractCronjob {
    switch (type) {
      case CronJobType.IMPORT_TYPESENSE:
        return new ImportTypesenseCronjob()

      default:
        throw new Error(`Unknown cronjob type`)
    }
  }
}
