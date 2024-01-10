import { DataSource } from 'typeorm'
import { mainMigrations } from '../migrations/index.js'
import { sslHelper } from '../utils/typeorm.js'
import { mainModels } from '../models/models.js'

export const mainDataSource = new DataSource({
  name: 'default',
  type: 'postgres',
  url: process.env.TYPEORM_URI,
  ssl: sslHelper(process.env.TYPEORM_SSL),
  extra: { max: 50 },
  logging: false,
  synchronize: false,
  migrationsRun: false,
  entities: mainModels,
  migrations: mainMigrations
})
