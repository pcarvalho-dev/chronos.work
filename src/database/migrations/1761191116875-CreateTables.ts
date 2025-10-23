import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1761191116875 implements MigrationInterface {
    name = 'CreateTables1761191116875'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_check_in" ("id" SERIAL NOT NULL, "checkIn" TIMESTAMP NOT NULL, "checkOut" TIMESTAMP, "userId" integer, CONSTRAINT "PK_ef4e4dbfef7108171430b39957a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_check_in" ADD CONSTRAINT "FK_e843d6655884ab837468fcb03ae" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_check_in" DROP CONSTRAINT "FK_e843d6655884ab837468fcb03ae"`);
        await queryRunner.query(`DROP TABLE "user_check_in"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
