import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateUser1725126923838 implements MigrationInterface {
  name = 'UpdateUser1725126923838'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`)
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying NOT NULL`)
  }
}
