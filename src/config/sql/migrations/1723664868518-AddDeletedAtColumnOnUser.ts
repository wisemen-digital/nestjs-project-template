import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeletedAtColumnOnUser1723664868518 implements MigrationInterface {
    name = 'AddDeletedAtColumnOnUser1723664868518'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "deletedAt" TIMESTAMP(3)`);
        await queryRunner.query(`CREATE INDEX "IDX_8ffce172fb81226c738cef01e3" ON "user" ("roleUuid") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_8ffce172fb81226c738cef01e3"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletedAt"`);
    }

}
