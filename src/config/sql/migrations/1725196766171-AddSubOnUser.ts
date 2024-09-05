import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddSubOnUser1725196766171 implements MigrationInterface {
  name = 'AddSubOnUser1725196766171'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "subject" character varying NOT NULL`)
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "subject"`)
  }
}
