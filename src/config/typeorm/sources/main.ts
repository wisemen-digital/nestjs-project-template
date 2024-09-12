import { DataSource } from 'typeorm'
import { mainMigrations } from '../migrations/migrations.js'
import { sslHelper } from '../utils/typeorm.js'
import { mainModels } from '../models/models.js'
import { SnakeNamingStrategy } from '../naming-strategy/snake-case-naming-strategy.js'

export const mainDataSource = new DataSource({
  name: 'default',
  type: 'postgres',
  url: process.env.DATABASE_URI,
  ssl: sslHelper(process.env.DATABASE_SSL),
  extra: { max: 50 },
  logging: false,
  synchronize: false,
  migrationsRun: false,
  entities: mainModels,
  migrations: mainMigrations,
  namingStrategy: new SnakeNamingStrategy()
})
