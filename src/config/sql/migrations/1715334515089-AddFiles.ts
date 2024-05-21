import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class AddFiles1715334515089 implements MigrationInterface {
  name = 'AddFiles1715334515089'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "file" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP(3), "name" character varying NOT NULL, "mimeType" character varying, "userUuid" uuid, "isUploadConfirmed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_d85c96c207a7395158a68ee1265" PRIMARY KEY ("uuid"))')
    await queryRunner.query('CREATE TABLE "file_link" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(), "fileUuid" uuid NOT NULL, "entityType" character varying NOT NULL, "entityUuid" uuid NOT NULL, "entityPart" character varying NOT NULL, "order" smallint, CONSTRAINT "PK_b6d7dfcebc6f25ae6e0ac6050cc" PRIMARY KEY ("uuid"))')
    await queryRunner.query('CREATE INDEX "IDX_6d04074d2c5affdbb325f625ae" ON "file_link" ("fileUuid") ')
    await queryRunner.query('CREATE INDEX "IDX_110e3d9b0c760d75304b1d966a" ON "file_link" ("entityUuid") ')
    await queryRunner.query('CREATE INDEX "IDX_dfea84acdfe32e67cf5de7a7ec" ON "file_link" ("entityPart") ')
    await queryRunner.query('CREATE INDEX "IDX_43c2ca34f905b6e2ac1bfc01f6" ON "file_link" ("entityType", "entityUuid") ')
    await queryRunner.query('ALTER TABLE "file_link" ADD CONSTRAINT "FK_6d04074d2c5affdbb325f625aef" FOREIGN KEY ("fileUuid") REFERENCES "file"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "file_link" DROP CONSTRAINT "FK_6d04074d2c5affdbb325f625aef"')
    await queryRunner.query('DROP INDEX "public"."IDX_43c2ca34f905b6e2ac1bfc01f6"')
    await queryRunner.query('DROP INDEX "public"."IDX_dfea84acdfe32e67cf5de7a7ec"')
    await queryRunner.query('DROP INDEX "public"."IDX_110e3d9b0c760d75304b1d966a"')
    await queryRunner.query('DROP INDEX "public"."IDX_6d04074d2c5affdbb325f625ae"')
    await queryRunner.query('DROP TABLE "file_link"')
    await queryRunner.query('DROP TABLE "file"')
  }
}
