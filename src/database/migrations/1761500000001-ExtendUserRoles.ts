import type { MigrationInterface, QueryRunner } from "typeorm";

export class ExtendUserRoles1761500000001 implements MigrationInterface {
    name = 'ExtendUserRoles1761500000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Since role is varchar, we just need to allow new values
        // TypeORM will handle the constraint at application level
        // No SQL changes needed as varchar accepts any string

        // Optional: Add a comment to document the allowed values
        await queryRunner.query(`
            COMMENT ON COLUMN "user"."role" IS 'Allowed values: manager, employee, hr, admin'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove the comment
        await queryRunner.query(`
            COMMENT ON COLUMN "user"."role" IS NULL
        `);
    }
}
