import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddHRFieldsToUser1761259480278 implements MigrationInterface {
    name = 'AddHRFieldsToUser1761259480278'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "cpf" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "rg" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "birthDate" date`);
        await queryRunner.query(`ALTER TABLE "user" ADD "gender" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "maritalStatus" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "phone" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "mobilePhone" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "address" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "addressNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "addressComplement" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "neighborhood" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "city" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "state" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "zipCode" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "country" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "employeeId" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "department" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "position" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "hireDate" date`);
        await queryRunner.query(`ALTER TABLE "user" ADD "salary" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "user" ADD "workSchedule" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "employmentType" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "directSupervisor" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "bankName" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "bankAccount" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "bankAgency" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "bankAccountType" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "pix" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "emergencyContactName" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "emergencyContactPhone" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "emergencyContactRelationship" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "education" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "notes" text`);
        await queryRunner.query(`ALTER TABLE "user" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "notes"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "education"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emergencyContactRelationship"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emergencyContactPhone"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emergencyContactName"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "pix"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "bankAccountType"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "bankAgency"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "bankAccount"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "bankName"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "directSupervisor"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "employmentType"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "workSchedule"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "salary"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "hireDate"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "position"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "department"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "employeeId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "zipCode"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "neighborhood"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "addressComplement"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "addressNumber"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "mobilePhone"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "maritalStatus"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "gender"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "birthDate"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "rg"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "cpf"`);
    }

}
