-- Create Company table
CREATE TABLE IF NOT EXISTS "company" (
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
);

-- Create Invitation table
CREATE TABLE IF NOT EXISTS "invitation" (
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
);

-- Add new columns to User table
ALTER TABLE "user" 
ADD COLUMN IF NOT EXISTS "isApproved" boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "invitationCode" character varying,
ADD COLUMN IF NOT EXISTS "companyId" integer,
ADD COLUMN IF NOT EXISTS "invitationId" integer;

-- Update existing users to be approved and active
UPDATE "user" 
SET "isActive" = true, "isApproved" = true 
WHERE "isActive" = true;

-- Add foreign key constraints
ALTER TABLE "invitation" 
ADD CONSTRAINT "FK_invitation_company" 
FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE;

ALTER TABLE "invitation" 
ADD CONSTRAINT "FK_invitation_createdBy" 
FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE;

ALTER TABLE "invitation" 
ADD CONSTRAINT "FK_invitation_usedBy" 
FOREIGN KEY ("usedById") REFERENCES "user"("id") ON DELETE SET NULL;

ALTER TABLE "user" 
ADD CONSTRAINT "FK_user_company" 
FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE SET NULL;

ALTER TABLE "user" 
ADD CONSTRAINT "FK_user_invitation" 
FOREIGN KEY ("invitationId") REFERENCES "invitation"("id") ON DELETE SET NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS "IDX_invitation_companyId" ON "invitation" ("companyId");
CREATE INDEX IF NOT EXISTS "IDX_invitation_createdById" ON "invitation" ("createdById");
CREATE INDEX IF NOT EXISTS "IDX_invitation_usedById" ON "invitation" ("usedById");
CREATE INDEX IF NOT EXISTS "IDX_invitation_code" ON "invitation" ("code");
CREATE INDEX IF NOT EXISTS "IDX_invitation_email" ON "invitation" ("email");
CREATE INDEX IF NOT EXISTS "IDX_user_companyId" ON "user" ("companyId");
CREATE INDEX IF NOT EXISTS "IDX_user_invitationId" ON "user" ("invitationId");
CREATE INDEX IF NOT EXISTS "IDX_user_isApproved" ON "user" ("isApproved");
CREATE INDEX IF NOT EXISTS "IDX_user_role" ON "user" ("role");