import { DataSource } from 'typeorm'
import { type TypeOrmModuleOptions } from '@nestjs/typeorm'
import { type DataSourceOptions } from 'typeorm/browser'
import { mainMigrations } from '../migrations/index.js'
import { sslHelper } from '../utils/typeorm.js'
import { mainModels } from '../models/models.js'

export const typeormConfig = (): TypeOrmModuleOptions => ({
  name: 'default',
  type: 'postgres',
  url: process.env.DATABASE_URI,
  ssl: sslHelper(process.env.DATABASE_SSL),
  extra: { max: 50 },
  logging: false,
  synchronize: false,
  migrationsRun: false,
  autoLoadEntities: true,
  entities: mainModels,
  migrations: mainMigrations
})

export const mainDataSource = new DataSource(typeormConfig() as DataSourceOptions)

const typeormTestConfig = (): TypeOrmModuleOptions => ({
  ...typeormConfig(),
  migrationsRun: true
})

export const mainDataSourceTest = new DataSource(typeormTestConfig() as DataSourceOptions)
