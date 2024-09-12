import type { MigrationInterface, QueryRunner } from 'typeorm'
import { Client } from '../../../modules/auth/entities/client.entity.js'

export class ClientSeeder1643710646293 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.insert(Client, {
      name: 'default',
      scopes: ['read', 'write'],
      grants: ['password', 'refresh_token']
    })
  }

  public async down (_queryRunner: QueryRunner): Promise<void> {
    // Empty
  }
}
