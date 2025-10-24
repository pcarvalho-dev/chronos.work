import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddProfilePhotoAndResetPasswordFields1761260208489 implements MigrationInterface {
    name = 'AddProfilePhotoAndResetPasswordFields1761260208489'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "profilePhoto" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "resetPasswordToken" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "resetPasswordExpires" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "resetPasswordExpires"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "resetPasswordToken"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profilePhoto"`);
    }

}
