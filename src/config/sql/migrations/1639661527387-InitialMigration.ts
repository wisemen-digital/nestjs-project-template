import type { MigrationInterface, QueryRunner } from 'typeorm'

export class InitialMigration1639661527387 implements MigrationInterface {
  name = 'InitialMigration1639661527387'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "client" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(), "name" character varying NOT NULL, "secret" uuid NOT NULL DEFAULT uuid_generate_v4(), "redirectUris" character varying array, "scopes" character varying array, "userUuid" uuid, CONSTRAINT "PK_1877f4f250c9271781a8eb70f95" PRIMARY KEY ("uuid"))')
    await queryRunner.query('CREATE INDEX "IDX_8318df9ecda039deac9868adf1" ON "client" ("secret") ')
    await queryRunner.query('CREATE INDEX "IDX_2cec877d43f4e1e3552fbe4795" ON "client" ("userUuid") ')
    await queryRunner.query('CREATE TABLE "refresh_token" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP(3), "expiresAt" TIMESTAMP(3) NOT NULL, "userUuid" uuid NOT NULL, "clientUuid" uuid NOT NULL, "scope" character varying array NOT NULL, CONSTRAINT "PK_aad39563a6e8926ed904bde2878" PRIMARY KEY ("uuid"))')
    await queryRunner.query('CREATE TYPE "public"."user_role_enum" AS ENUM(\'admin\', \'user\')')
    await queryRunner.query('CREATE TABLE "user" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "role" "public"."user_role_enum" NOT NULL DEFAULT \'user\', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_a95e949168be7b7ece1a2382fed" PRIMARY KEY ("uuid"))')
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") ')
    await queryRunner.query('ALTER TABLE "client" ADD CONSTRAINT "FK_2cec877d43f4e1e3552fbe4795f" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_7bcffdf3e178d0b35c0c50541ee" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_0651fd3bfd6fb40ce15e85a567c" FOREIGN KEY ("clientUuid") REFERENCES "client"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_0651fd3bfd6fb40ce15e85a567c"')
    await queryRunner.query('ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_7bcffdf3e178d0b35c0c50541ee"')
    await queryRunner.query('ALTER TABLE "client" DROP CONSTRAINT "FK_2cec877d43f4e1e3552fbe4795f"')
    await queryRunner.query('DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"')
    await queryRunner.query('DROP TABLE "user"')
    await queryRunner.query('DROP TYPE "public"."user_role_enum"')
    await queryRunner.query('DROP TABLE "refresh_token"')
    await queryRunner.query('DROP INDEX "public"."IDX_2cec877d43f4e1e3552fbe4795"')
    await queryRunner.query('DROP INDEX "public"."IDX_8318df9ecda039deac9868adf1"')
    await queryRunner.query('DROP TABLE "client"')
  }
}
