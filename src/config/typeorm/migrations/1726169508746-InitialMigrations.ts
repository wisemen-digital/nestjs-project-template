import { MigrationInterface, QueryRunner } from 'typeorm'
import { Client } from '../../../modules/auth/entities/client.entity.js'

export class InitialMigrations1726169508746 implements MigrationInterface {
  name = 'InitialMigrations1726169508746'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "refresh_token" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(3), "expires_at" TIMESTAMP(3) NOT NULL, "user_uuid" uuid NOT NULL, "client_uuid" uuid NOT NULL, "scope" character varying array NOT NULL, "userUuid" uuid, "clientUuid" uuid, CONSTRAINT "PK_refresh_token" PRIMARY KEY ("uuid"))`)
    await queryRunner.query(`CREATE TABLE "role" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(), "name" character varying NOT NULL, "permissions" character varying array NOT NULL DEFAULT '{}', CONSTRAINT "UQ_role_name" UNIQUE ("name"), CONSTRAINT "PK_role" PRIMARY KEY ("uuid"))`)
    await queryRunner.query(`CREATE TABLE "user" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(3), "email" character varying NOT NULL, "password" character varying NOT NULL, "first_name" character varying, "last_name" character varying, "role_uuid" uuid, "roleUuid" uuid, CONSTRAINT "UQ_user_email" UNIQUE ("email"), CONSTRAINT "PK_user" PRIMARY KEY ("uuid"))`)
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_user_email" ON "user" ("email") `)
    await queryRunner.query(`CREATE INDEX "IDX_user_role_uuid" ON "user" ("role_uuid") `)
    await queryRunner.query(`CREATE TABLE "client" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(), "name" character varying NOT NULL, "secret" uuid NOT NULL DEFAULT uuid_generate_v4(), "redirect_uris" character varying array, "scopes" character varying array, "user_uuid" character varying, "userUuid" uuid, CONSTRAINT "PK_client" PRIMARY KEY ("uuid"))`)
    await queryRunner.query(`CREATE INDEX "IDX_client_user_uuid" ON "client" ("user_uuid") `)
    await queryRunner.query(`CREATE TABLE "pkce" ("uuid" uuid NOT NULL, "challenge_method" character varying NOT NULL, "challenge" character varying NOT NULL, "verifier" character varying NOT NULL, "csrf_token" character varying, "scopes" character varying array NOT NULL, CONSTRAINT "PK_pkce" PRIMARY KEY ("uuid"))`)
    await queryRunner.query(`CREATE TABLE "file" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP(3), "name" character varying NOT NULL, "mime_type" character varying, "user_uuid" uuid, "is_upload_confirmed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_file" PRIMARY KEY ("uuid"))`)
    await queryRunner.query(`CREATE TABLE "file_link" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(), "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(), "file_uuid" uuid NOT NULL, "entity_type" character varying NOT NULL, "entity_uuid" uuid NOT NULL, "entity_part" character varying NOT NULL, "order" smallint, "fileUuid" uuid, CONSTRAINT "PK_file_link" PRIMARY KEY ("uuid"))`)
    await queryRunner.query(`CREATE INDEX "IDX_file_link_file_uuid" ON "file_link" ("file_uuid") `)
    await queryRunner.query(`CREATE INDEX "IDX_file_link_entity_uuid" ON "file_link" ("entity_uuid") `)
    await queryRunner.query(`CREATE INDEX "IDX_file_link_entity_part" ON "file_link" ("entity_part") `)
    await queryRunner.query(`CREATE INDEX "IDX_file_link_entity_type_entity_uuid" ON "file_link" ("entity_type", "entity_uuid") `)
    await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_refresh_token_user_uuid_REFERENCES_user_uuid" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_refresh_token_client_uuid_REFERENCES_client_uuid" FOREIGN KEY ("clientUuid") REFERENCES "client"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_user_role_uuid_REFERENCES_role_uuid" FOREIGN KEY ("roleUuid") REFERENCES "role"("uuid") ON DELETE SET NULL ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "client" ADD CONSTRAINT "FK_client_user_uuid_REFERENCES_user_uuid" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "file_link" ADD CONSTRAINT "FK_file_link_file_uuid_REFERENCES_file_uuid" FOREIGN KEY ("fileUuid") REFERENCES "file"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`)
    await queryRunner.manager.insert(Client, {
      name: 'default',
      scopes: ['read', 'write'],
      grants: ['password', 'refresh_token']
    })
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "file_link" DROP CONSTRAINT "FK_file_link_file_uuid_REFERENCES_file_uuid"`)
    await queryRunner.query(`ALTER TABLE "client" DROP CONSTRAINT "FK_client_user_uuid_REFERENCES_user_uuid"`)
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_user_role_uuid_REFERENCES_role_uuid"`)
    await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_refresh_token_client_uuid_REFERENCES_client_uuid"`)
    await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_refresh_token_user_uuid_REFERENCES_user_uuid"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_file_link_entity_type_entity_uuid"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_file_link_entity_part"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_file_link_entity_uuid"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_file_link_file_uuid"`)
    await queryRunner.query(`DROP TABLE "file_link"`)
    await queryRunner.query(`DROP TABLE "file"`)
    await queryRunner.query(`DROP TABLE "pkce"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_client_user_uuid"`)
    await queryRunner.query(`DROP TABLE "client"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_user_role_uuid"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_user_email"`)
    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(`DROP TABLE "role"`)
    await queryRunner.query(`DROP TABLE "refresh_token"`)
  }
}
