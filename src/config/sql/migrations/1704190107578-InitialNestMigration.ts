import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class InitialNestMigration1704190107578 implements MigrationInterface {
  name = 'InitialNestMigration1704190107578'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "public"."IDX_8318df9ecda039deac9868adf1"')
    await queryRunner.query('CREATE TABLE "pkce" ("uuid" uuid NOT NULL, "challengeMethod" character varying NOT NULL, "challenge" character varying NOT NULL, "verifier" character varying NOT NULL, "csrfToken" character varying, "scopes" character varying array NOT NULL, CONSTRAINT "PK_711c6dee26142adc9870805e807" PRIMARY KEY ("uuid"))')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "pkce"')
    await queryRunner.query('CREATE INDEX "IDX_8318df9ecda039deac9868adf1" ON "client" ("secret") ')
  }
}
