import type { MigrationInterface, QueryRunner } from 'typeorm'

export class InitialMigration1639661527387 implements MigrationInterface {
  name = 'InitialMigration1639661527387'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TYPE "public"."user_role_enum" AS ENUM(\'admin\', \'user\')')
    await queryRunner.query('CREATE TABLE "user" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "role" "public"."user_role_enum" NOT NULL DEFAULT \'user\', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_a95e949168be7b7ece1a2382fed" PRIMARY KEY ("uuid"))')
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") ')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"')
    await queryRunner.query('DROP TABLE "user"')
    await queryRunner.query('DROP TYPE "public"."user_role_enum"')
  }
}
