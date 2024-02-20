import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class UpdateUserRoles1707828496634 implements MigrationInterface {
  name = 'UpdateUserRoles1707828496634'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" DROP COLUMN "role"')
    await queryRunner.query('ALTER TABLE "user" ADD "roleUuid" uuid')
    await queryRunner.query('DROP TYPE "public"."user_role_enum"')
    await queryRunner.query('CREATE TABLE "role" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(), "name" character varying NOT NULL, "permissions" character varying array NOT NULL DEFAULT \'{}\', CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_16fc336b9576146aa1f03fdc7c5" PRIMARY KEY ("uuid"))')
    await queryRunner.query('ALTER TABLE "user" ADD CONSTRAINT "FK_8ffce172fb81226c738cef01e31" FOREIGN KEY ("roleUuid") REFERENCES "role"("uuid") ON DELETE SET NULL ON UPDATE NO ACTION')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" DROP CONSTRAINT "FK_8ffce172fb81226c738cef01e31"')
    await queryRunner.query('DROP TABLE "role"')
    await queryRunner.query('ALTER TABLE "user" DROP COLUMN "roleUuid"')
    await queryRunner.query('CREATE TYPE "public"."user_role_enum" AS ENUM(\'admin\', \'user\')')
    await queryRunner.query('ALTER TABLE "user" ADD "role" "public"."user_role_enum" NOT NULL DEFAULT \'user\'')
  }
}
