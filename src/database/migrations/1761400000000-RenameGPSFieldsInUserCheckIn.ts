import type { MigrationInterface, QueryRunner } from "typeorm";

export class RenameGPSFieldsInUserCheckIn1761400000000 implements MigrationInterface {
    name = 'RenameGPSFieldsInUserCheckIn1761400000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Rename check-in GPS fields
        await queryRunner.query(`ALTER TABLE "user_check_in" RENAME COLUMN "checkInLatitude" TO "latitude"`);
        await queryRunner.query(`ALTER TABLE "user_check_in" RENAME COLUMN "checkInLongitude" TO "longitude"`);

        // Rename check-out GPS fields
        await queryRunner.query(`ALTER TABLE "user_check_in" RENAME COLUMN "checkOutLatitude" TO "outLatitude"`);
        await queryRunner.query(`ALTER TABLE "user_check_in" RENAME COLUMN "checkOutLongitude" TO "outLongitude"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert check-out GPS fields
        await queryRunner.query(`ALTER TABLE "user_check_in" RENAME COLUMN "outLongitude" TO "checkOutLongitude"`);
        await queryRunner.query(`ALTER TABLE "user_check_in" RENAME COLUMN "outLatitude" TO "checkOutLatitude"`);

        // Revert check-in GPS fields
        await queryRunner.query(`ALTER TABLE "user_check_in" RENAME COLUMN "longitude" TO "checkInLongitude"`);
        await queryRunner.query(`ALTER TABLE "user_check_in" RENAME COLUMN "latitude" TO "checkInLatitude"`);
    }

}
