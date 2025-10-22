import type { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigrate1760883477569 implements MigrationInterface {
    name = 'InitMigrate1760883477569'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "time_log" ("id" SERIAL NOT NULL, "checkIn" TIMESTAMP NOT NULL, "checkOut" TIMESTAMP, "userId" integer, CONSTRAINT "PK_b74817f73944f78f239601069f2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "time_log" ADD CONSTRAINT "FK_fcc70e3f69cd416396cca582e99" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "time_log" DROP CONSTRAINT "FK_fcc70e3f69cd416396cca582e99"`);
        await queryRunner.query(`DROP TABLE "time_log"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
