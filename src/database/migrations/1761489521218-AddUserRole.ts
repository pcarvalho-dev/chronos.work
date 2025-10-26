import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRole1761489521218 implements MigrationInterface {
    name = 'AddUserRole1761489521218'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "role" character varying NOT NULL DEFAULT 'employee'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
    }

}
