import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddLocationFieldsToUserCheckIn1761325666199 implements MigrationInterface {
    name = 'AddLocationFieldsToUserCheckIn1761325666199'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_check_in" ADD "checkInLatitude" numeric(10,7)`);
        await queryRunner.query(`ALTER TABLE "user_check_in" ADD "checkInLongitude" numeric(10,7)`);
        await queryRunner.query(`ALTER TABLE "user_check_in" ADD "checkInLocation" text`);
        await queryRunner.query(`ALTER TABLE "user_check_in" ADD "checkOutLatitude" numeric(10,7)`);
        await queryRunner.query(`ALTER TABLE "user_check_in" ADD "checkOutLongitude" numeric(10,7)`);
        await queryRunner.query(`ALTER TABLE "user_check_in" ADD "checkOutLocation" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_check_in" DROP COLUMN "checkOutLocation"`);
        await queryRunner.query(`ALTER TABLE "user_check_in" DROP COLUMN "checkOutLongitude"`);
        await queryRunner.query(`ALTER TABLE "user_check_in" DROP COLUMN "checkOutLatitude"`);
        await queryRunner.query(`ALTER TABLE "user_check_in" DROP COLUMN "checkInLocation"`);
        await queryRunner.query(`ALTER TABLE "user_check_in" DROP COLUMN "checkInLongitude"`);
        await queryRunner.query(`ALTER TABLE "user_check_in" DROP COLUMN "checkInLatitude"`);
    }

}
