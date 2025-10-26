import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddManualTimeLogFields1761485670551 implements MigrationInterface {
    name = 'AddManualTimeLogFields1761485670551'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_check_in" ADD "isManual" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user_check_in" ADD "reason" text`);
        await queryRunner.query(`ALTER TABLE "user_check_in" ADD "status" character varying NOT NULL DEFAULT 'approved'`);
        await queryRunner.query(`ALTER TABLE "user_check_in" ADD "approvalDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user_check_in" ADD "rejectionReason" text`);
        await queryRunner.query(`ALTER TABLE "user_check_in" ADD "approvedBy" integer`);
        await queryRunner.query(`ALTER TABLE "user_check_in" ADD CONSTRAINT "FK_6f7e62b7e030b76d3b8a199eb90" FOREIGN KEY ("approvedBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_check_in" DROP CONSTRAINT "FK_6f7e62b7e030b76d3b8a199eb90"`);
        await queryRunner.query(`ALTER TABLE "user_check_in" DROP COLUMN "approvedBy"`);
        await queryRunner.query(`ALTER TABLE "user_check_in" DROP COLUMN "rejectionReason"`);
        await queryRunner.query(`ALTER TABLE "user_check_in" DROP COLUMN "approvalDate"`);
        await queryRunner.query(`ALTER TABLE "user_check_in" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "user_check_in" DROP COLUMN "reason"`);
        await queryRunner.query(`ALTER TABLE "user_check_in" DROP COLUMN "isManual"`);
    }

}
