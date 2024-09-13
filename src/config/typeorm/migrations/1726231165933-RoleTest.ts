import { MigrationInterface, QueryRunner } from "typeorm";

export class RoleTest1726231165933 implements MigrationInterface {
    name = 'RoleTest1726231165933'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_refresh_token_user_uuid_REFERENCES_user_uuid"`);
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_refresh_token_client_uuid_REFERENCES_client_uuid"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_user_role_uuid_REFERENCES_role_uuid"`);
        await queryRunner.query(`ALTER TABLE "client" DROP CONSTRAINT "FK_client_user_uuid_REFERENCES_user_uuid"`);
        await queryRunner.query(`ALTER TABLE "file_link" DROP CONSTRAINT "FK_file_link_file_uuid_REFERENCES_file_uuid"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_user_email"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_user_role_uuid"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_client_user_uuid"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_file_link_file_uuid"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_file_link_entity_uuid"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_file_link_entity_part"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_file_link_entity_type_entity_uuid"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "roleUuid"`);
        await queryRunner.query(`CREATE INDEX "IDX_08c0c899cabd8a9d31b674429c" ON "role" ("uuid", "created_at") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_8d67721f603379fc854963857b" ON "user" ("role_uuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_35c1839bcea8df7fca14e87854" ON "client" ("user_uuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_fd4d9563fa6540cd443f3a6855" ON "file_link" ("file_uuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_c75bfa9854abb1f61362722ebb" ON "file_link" ("entity_uuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_79ce5ff400cb1d853fd6a800d6" ON "file_link" ("entity_part") `);
        await queryRunner.query(`CREATE INDEX "IDX_fe44eb53fd9da12f87f1b11697" ON "file_link" ("entity_type", "entity_uuid") `);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_7bcffdf3e178d0b35c0c50541ee" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_0651fd3bfd6fb40ce15e85a567c" FOREIGN KEY ("clientUuid") REFERENCES "client"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_8d67721f603379fc854963857b8" FOREIGN KEY ("role_uuid") REFERENCES "role"("uuid") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client" ADD CONSTRAINT "FK_2cec877d43f4e1e3552fbe4795f" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "file_link" ADD CONSTRAINT "FK_6d04074d2c5affdbb325f625aef" FOREIGN KEY ("fileUuid") REFERENCES "file"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_link" DROP CONSTRAINT "FK_6d04074d2c5affdbb325f625aef"`);
        await queryRunner.query(`ALTER TABLE "client" DROP CONSTRAINT "FK_2cec877d43f4e1e3552fbe4795f"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_8d67721f603379fc854963857b8"`);
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_0651fd3bfd6fb40ce15e85a567c"`);
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_7bcffdf3e178d0b35c0c50541ee"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fe44eb53fd9da12f87f1b11697"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_79ce5ff400cb1d853fd6a800d6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c75bfa9854abb1f61362722ebb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fd4d9563fa6540cd443f3a6855"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_35c1839bcea8df7fca14e87854"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8d67721f603379fc854963857b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_08c0c899cabd8a9d31b674429c"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "roleUuid" uuid`);
        await queryRunner.query(`CREATE INDEX "IDX_file_link_entity_type_entity_uuid" ON "file_link" ("entity_type", "entity_uuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_file_link_entity_part" ON "file_link" ("entity_part") `);
        await queryRunner.query(`CREATE INDEX "IDX_file_link_entity_uuid" ON "file_link" ("entity_uuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_file_link_file_uuid" ON "file_link" ("file_uuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_client_user_uuid" ON "client" ("user_uuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_user_role_uuid" ON "user" ("role_uuid") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_user_email" ON "user" ("email") `);
        await queryRunner.query(`ALTER TABLE "file_link" ADD CONSTRAINT "FK_file_link_file_uuid_REFERENCES_file_uuid" FOREIGN KEY ("fileUuid") REFERENCES "file"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client" ADD CONSTRAINT "FK_client_user_uuid_REFERENCES_user_uuid" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_user_role_uuid_REFERENCES_role_uuid" FOREIGN KEY ("roleUuid") REFERENCES "role"("uuid") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_refresh_token_client_uuid_REFERENCES_client_uuid" FOREIGN KEY ("clientUuid") REFERENCES "client"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_refresh_token_user_uuid_REFERENCES_user_uuid" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
