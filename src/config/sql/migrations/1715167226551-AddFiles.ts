import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class AddFiles1715167226551 implements MigrationInterface {
  name = 'AddFiles1715167226551'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "file" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP(3), "fileName" character varying NOT NULL, "mimeType" character varying, "userUuid" uuid, "isUploadConfirmed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_d85c96c207a7395158a68ee1265" PRIMARY KEY ("uuid"))')
    await queryRunner.query('CREATE TABLE "file_entity" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(), "fileUuid" uuid NOT NULL, "entityType" character varying NOT NULL, "entityUuid" uuid NOT NULL, "collectionName" character varying NOT NULL, "order" smallint, CONSTRAINT "PK_728a42a0fbdf3fc5f5a42c85e12" PRIMARY KEY ("uuid"))')
    await queryRunner.query('CREATE INDEX "IDX_61f4deb3081fda2f1c90830277" ON "file_entity" ("collectionName") ')
    await queryRunner.query('CREATE INDEX "IDX_5b6f1e3f0bc67a988c6ebf39f9" ON "file_entity" ("entityType", "entityUuid") ')
    await queryRunner.query('ALTER TABLE "file_entity" ADD CONSTRAINT "FK_13b4f64eacfd6a22cdaf42a9a37" FOREIGN KEY ("fileUuid") REFERENCES "file"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "file_entity" DROP CONSTRAINT "FK_13b4f64eacfd6a22cdaf42a9a37"')
    await queryRunner.query('DROP INDEX "public"."IDX_5b6f1e3f0bc67a988c6ebf39f9"')
    await queryRunner.query('DROP INDEX "public"."IDX_61f4deb3081fda2f1c90830277"')
    await queryRunner.query('DROP TABLE "file_entity"')
    await queryRunner.query('DROP TABLE "file"')
  }
}
