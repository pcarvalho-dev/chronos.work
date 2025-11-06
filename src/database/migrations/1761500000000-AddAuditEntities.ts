import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddAuditEntities1761500000000 implements MigrationInterface {
    name = 'AddAuditEntities1761500000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create user_movement_history table
        await queryRunner.query(`
            CREATE TABLE "user_movement_history" (
                "id" SERIAL NOT NULL,
                "userId" integer NOT NULL,
                "fieldName" character varying NOT NULL,
                "oldValue" text,
                "newValue" text,
                "diff" text,
                "changedById" integer NOT NULL,
                "justification" text,
                "ipAddress" character varying,
                "userAgent" text,
                "companyId" integer NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_user_movement_history" PRIMARY KEY ("id")
            )
        `);

        // Create audit_configuration table
        await queryRunner.query(`
            CREATE TABLE "audit_configuration" (
                "id" SERIAL NOT NULL,
                "companyId" integer NOT NULL,
                "trackedFields" text NOT NULL,
                "requireJustification" boolean NOT NULL DEFAULT false,
                "isEnabled" boolean NOT NULL DEFAULT true,
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_audit_configuration_companyId" UNIQUE ("companyId"),
                CONSTRAINT "PK_audit_configuration" PRIMARY KEY ("id")
            )
        `);

        // Add foreign key constraints for user_movement_history
        await queryRunner.query(`
            ALTER TABLE "user_movement_history"
            ADD CONSTRAINT "FK_user_movement_history_user"
            FOREIGN KEY ("userId") REFERENCES "user"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "user_movement_history"
            ADD CONSTRAINT "FK_user_movement_history_changedBy"
            FOREIGN KEY ("changedById") REFERENCES "user"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "user_movement_history"
            ADD CONSTRAINT "FK_user_movement_history_company"
            FOREIGN KEY ("companyId") REFERENCES "company"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        // Add foreign key constraint for audit_configuration
        await queryRunner.query(`
            ALTER TABLE "audit_configuration"
            ADD CONSTRAINT "FK_audit_configuration_company"
            FOREIGN KEY ("companyId") REFERENCES "company"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        // Create indexes for better query performance
        await queryRunner.query(`
            CREATE INDEX "IDX_user_movement_history_userId"
            ON "user_movement_history" ("userId")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_user_movement_history_changedById"
            ON "user_movement_history" ("changedById")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_user_movement_history_companyId"
            ON "user_movement_history" ("companyId")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_user_movement_history_createdAt"
            ON "user_movement_history" ("createdAt")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_user_movement_history_fieldName"
            ON "user_movement_history" ("fieldName")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.query(`DROP INDEX "IDX_user_movement_history_fieldName"`);
        await queryRunner.query(`DROP INDEX "IDX_user_movement_history_createdAt"`);
        await queryRunner.query(`DROP INDEX "IDX_user_movement_history_companyId"`);
        await queryRunner.query(`DROP INDEX "IDX_user_movement_history_changedById"`);
        await queryRunner.query(`DROP INDEX "IDX_user_movement_history_userId"`);

        // Drop foreign key constraints for audit_configuration
        await queryRunner.query(`ALTER TABLE "audit_configuration" DROP CONSTRAINT "FK_audit_configuration_company"`);

        // Drop foreign key constraints for user_movement_history
        await queryRunner.query(`ALTER TABLE "user_movement_history" DROP CONSTRAINT "FK_user_movement_history_company"`);
        await queryRunner.query(`ALTER TABLE "user_movement_history" DROP CONSTRAINT "FK_user_movement_history_changedBy"`);
        await queryRunner.query(`ALTER TABLE "user_movement_history" DROP CONSTRAINT "FK_user_movement_history_user"`);

        // Drop tables
        await queryRunner.query(`DROP TABLE "audit_configuration"`);
        await queryRunner.query(`DROP TABLE "user_movement_history"`);
    }
}
