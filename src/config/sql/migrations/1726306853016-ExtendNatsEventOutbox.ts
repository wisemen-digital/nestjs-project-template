import { MigrationInterface, QueryRunner } from 'typeorm'

export class ExtendNatsEventOutbox1726306853016 implements MigrationInterface {
  name = 'ExtendNatsEventOutbox1726306853016'
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_0efc3a18b1d8b79cbb0fd02088"`)
    await queryRunner.query(`ALTER TABLE "nats_event_outbox" DROP COLUMN "serializedEvent"`)
    await queryRunner.query(`ALTER TABLE "nats_event_outbox" ADD "state" character varying NOT NULL DEFAULT 'pending'`)
    await queryRunner.query(`ALTER TABLE "nats_event_outbox" ADD "topic" character varying NOT NULL`)
    await queryRunner.query(`ALTER TABLE "nats_event_outbox" ADD "serializedMessage" character varying NOT NULL`)
    await queryRunner.query(`CREATE INDEX "IDX_87a3f57ed0dc8060c1b40ffacd" ON "nats_event_outbox" ("state", "createdAt") WHERE "state" = 'pending'`)
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_87a3f57ed0dc8060c1b40ffacd"`)
    await queryRunner.query(`ALTER TABLE "nats_event_outbox" DROP COLUMN "serializedMessage"`)
    await queryRunner.query(`ALTER TABLE "nats_event_outbox" DROP COLUMN "topic"`)
    await queryRunner.query(`ALTER TABLE "nats_event_outbox" DROP COLUMN "state"`)
    await queryRunner.query(`ALTER TABLE "nats_event_outbox" ADD "serializedEvent" character varying NOT NULL`)
    await queryRunner.query(`CREATE INDEX "IDX_0efc3a18b1d8b79cbb0fd02088" ON "nats_event_outbox" ("createdAt", "sentAt") WHERE ("sentAt" IS NULL)`)
  }
}
