import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhotoFieldsToUserCheckIn1761323426190 implements MigrationInterface {
    name = 'AddPhotoFieldsToUserCheckIn1761323426190'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_check_in" ADD "checkInPhoto" character varying`);
        await queryRunner.query(`ALTER TABLE "user_check_in" ADD "checkOutPhoto" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_check_in" DROP COLUMN "checkOutPhoto"`);
        await queryRunner.query(`ALTER TABLE "user_check_in" DROP COLUMN "checkInPhoto"`);
    }

}
