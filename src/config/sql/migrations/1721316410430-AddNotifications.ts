import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class AddNotifications1721316410430 implements MigrationInterface {
  name = 'AddNotifications1721316410430'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "notification" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "userUuid" uuid NOT NULL, "deviceUuid" uuid NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(), "config" integer NOT NULL DEFAULT \'2147483647\', CONSTRAINT "PK_b9fa421f94f7707ba109bf73b82" PRIMARY KEY ("uuid"))')
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_1fb9ef82ba3872ad878a6cb985" ON "notification" ("userUuid", "deviceUuid") ')
    await queryRunner.query('ALTER TABLE "notification" ADD CONSTRAINT "FK_51bfefbe8aebf4c0663956301bc" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "notification" DROP CONSTRAINT "FK_51bfefbe8aebf4c0663956301bc"')
    await queryRunner.query('DROP INDEX "public"."IDX_1fb9ef82ba3872ad878a6cb985"')
    await queryRunner.query('DROP TABLE "notification"')
  }
}
