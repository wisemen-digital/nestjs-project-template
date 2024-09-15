import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateNatsEventOutbox1726302389356 implements MigrationInterface {
  name = 'CreateNatsEventOutbox1726302389356'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "nats_event_outbox" (
        "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), 
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(), 
        "sentAt" TIMESTAMP(3), 
        "serializedEvent" character varying NOT NULL, 
        CONSTRAINT "PK_a4ed7efe3ec1b8cbc67ca8ae6a2" PRIMARY KEY ("uuid"))
    `)

    await queryRunner.query(`
      CREATE INDEX "IDX_0efc3a18b1d8b79cbb0fd02088" 
      ON "nats_event_outbox" ("sentAt", "createdAt")
      WHERE "sentAt" IS NULL
    `)
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_0efc3a18b1d8b79cbb0fd02088"`)
    await queryRunner.query(`DROP TABLE "nats_event_outbox"`)
  }
}
