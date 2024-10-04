import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddNatsOutboxEvent1727880945080 implements MigrationInterface {
  name = 'AddNatsOutboxEvent1727880945080'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."nats_outbox_event_state_enum" 
      AS ENUM('pending', 'sending', 'sent')`)

    await queryRunner.query(`
      CREATE TABLE "nats_outbox_event" (
        "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), 
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(), 
        "state" "public"."nats_outbox_event_state_enum" NOT NULL DEFAULT 'pending', 
        "sentAt" TIMESTAMP(3), "topic" character varying NOT NULL, 
        "serializedMessage" character varying NOT NULL, 
        CONSTRAINT "PK_4e28d16f2f7f5114ffc1ce35d4b" PRIMARY KEY ("uuid"))`)

    await queryRunner.query(`
      CREATE INDEX "IDX_77272008652135d7d629c5c9b8" 
      ON "nats_outbox_event" ("state", "createdAt") 
      WHERE "state" = 'pending'`)
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_77272008652135d7d629c5c9b8"`)
    await queryRunner.query(`DROP TABLE "nats_outbox_event"`)
    await queryRunner.query(`DROP TYPE "public"."nats_outbox_event_state_enum"`)
  }
}
