import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddCompanyAndInvitationSystem1761200000000 implements MigrationInterface {
    name = 'AddCompanyAndInvitationSystem1761200000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create Company table
        await queryRunner.query(`
            CREATE TABLE "company" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "cnpj" character varying NOT NULL,
                "corporateName" character varying,
                "email" character varying,
                "phone" character varying,
                "website" character varying,
                "address" character varying,
                "addressNumber" character varying,
                "addressComplement" character varying,
                "neighborhood" character varying,
                "city" character varying,
                "state" character varying,
                "zipCode" character varying,
                "country" character varying,
                "description" text,
                "logo" character varying,
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_company_cnpj" UNIQUE ("cnpj"),
                CONSTRAINT "PK_company" PRIMARY KEY ("id")
            )
        `);

        // Create Invitation table
        await queryRunner.query(`
            CREATE TABLE "invitation" (
                "id" SERIAL NOT NULL,
                "code" character varying NOT NULL,
                "email" character varying NOT NULL,
                "name" character varying,
                "position" character varying,
                "department" character varying,
                "isUsed" boolean NOT NULL DEFAULT false,
                "usedAt" TIMESTAMP,
                "expiresAt" TIMESTAMP,
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "companyId" integer NOT NULL,
                "createdById" integer NOT NULL,
                "usedById" integer,
                CONSTRAINT "UQ_invitation_code" UNIQUE ("code"),
                CONSTRAINT "PK_invitation" PRIMARY KEY ("id")
            )
        `);

        // Add new columns to User table
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD COLUMN "isApproved" boolean NOT NULL DEFAULT false,
            ADD COLUMN "invitationCode" character varying,
            ADD COLUMN "companyId" integer,
            ADD COLUMN "invitationId" integer,
            ADD COLUMN "role" character varying NOT NULL DEFAULT 'employee'
        `);

        // Add foreign key constraints
        await queryRunner.query(`
            ALTER TABLE "invitation" 
            ADD CONSTRAINT "FK_invitation_company" 
            FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "invitation" 
            ADD CONSTRAINT "FK_invitation_createdBy" 
            FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "invitation" 
            ADD CONSTRAINT "FK_invitation_usedBy" 
            FOREIGN KEY ("usedById") REFERENCES "user"("id") ON DELETE SET NULL
        `);

        await queryRunner.query(`
            ALTER TABLE "user" 
            ADD CONSTRAINT "FK_user_company" 
            FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE SET NULL
        `);

        await queryRunner.query(`
            ALTER TABLE "user" 
            ADD CONSTRAINT "FK_user_invitation" 
            FOREIGN KEY ("invitationId") REFERENCES "invitation"("id") ON DELETE SET NULL
        `);

        // Create indexes
        await queryRunner.query(`
            CREATE INDEX "IDX_invitation_companyId" ON "invitation" ("companyId")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_invitation_createdById" ON "invitation" ("createdById")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_invitation_usedById" ON "invitation" ("usedById")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_invitation_code" ON "invitation" ("code")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_invitation_email" ON "invitation" ("email")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_user_companyId" ON "user" ("companyId")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_user_invitationId" ON "user" ("invitationId")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_user_isApproved" ON "user" ("isApproved")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_user_role" ON "user" ("role")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraints
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_user_invitation"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_user_company"`);
        await queryRunner.query(`ALTER TABLE "invitation" DROP CONSTRAINT "FK_invitation_usedBy"`);
        await queryRunner.query(`ALTER TABLE "invitation" DROP CONSTRAINT "FK_invitation_createdBy"`);
        await queryRunner.query(`ALTER TABLE "invitation" DROP CONSTRAINT "FK_invitation_company"`);

        // Drop indexes
        await queryRunner.query(`DROP INDEX "IDX_user_role"`);
        await queryRunner.query(`DROP INDEX "IDX_user_isApproved"`);
        await queryRunner.query(`DROP INDEX "IDX_user_invitationId"`);
        await queryRunner.query(`DROP INDEX "IDX_user_companyId"`);
        await queryRunner.query(`DROP INDEX "IDX_invitation_email"`);
        await queryRunner.query(`DROP INDEX "IDX_invitation_code"`);
        await queryRunner.query(`DROP INDEX "IDX_invitation_usedById"`);
        await queryRunner.query(`DROP INDEX "IDX_invitation_createdById"`);
        await queryRunner.query(`DROP INDEX "IDX_invitation_companyId"`);

        // Remove new columns from User table
        await queryRunner.query(`
            ALTER TABLE "user" 
            DROP COLUMN "invitationId",
            DROP COLUMN "companyId",
            DROP COLUMN "invitationCode",
            DROP COLUMN "isApproved",
            DROP COLUMN "role"
        `);

        // Drop tables
        await queryRunner.query(`DROP TABLE "invitation"`);
        await queryRunner.query(`DROP TABLE "company"`);
    }
}