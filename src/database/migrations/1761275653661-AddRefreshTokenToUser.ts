import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokenToUser1761275653661 implements MigrationInterface {
    name = 'AddRefreshTokenToUser1761275653661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "refreshToken" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "refreshToken"`);
    }

}
