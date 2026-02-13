--
-- PostgreSQL database dump
--

\restrict I7SsbMFlaBkevuSCGbURAu6QVLJTRdM0Xyvt4dKXxurBJx6Rj6CLV96Cz9ecfH1

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.user_movement_history DROP CONSTRAINT IF EXISTS "FK_user_movement_history_user";
ALTER TABLE IF EXISTS ONLY public.user_movement_history DROP CONSTRAINT IF EXISTS "FK_user_movement_history_company";
ALTER TABLE IF EXISTS ONLY public.user_movement_history DROP CONSTRAINT IF EXISTS "FK_user_movement_history_changedBy";
ALTER TABLE IF EXISTS ONLY public."user" DROP CONSTRAINT IF EXISTS "FK_user_invitation";
ALTER TABLE IF EXISTS ONLY public."user" DROP CONSTRAINT IF EXISTS "FK_user_company";
ALTER TABLE IF EXISTS ONLY public.invitation DROP CONSTRAINT IF EXISTS "FK_invitation_usedBy";
ALTER TABLE IF EXISTS ONLY public.invitation DROP CONSTRAINT IF EXISTS "FK_invitation_createdBy";
ALTER TABLE IF EXISTS ONLY public.invitation DROP CONSTRAINT IF EXISTS "FK_invitation_company";
ALTER TABLE IF EXISTS ONLY public.user_check_in DROP CONSTRAINT IF EXISTS "FK_e843d6655884ab837468fcb03ae";
ALTER TABLE IF EXISTS ONLY public.audit_configuration DROP CONSTRAINT IF EXISTS "FK_audit_configuration_company";
ALTER TABLE IF EXISTS ONLY public.user_check_in DROP CONSTRAINT IF EXISTS "FK_6f7e62b7e030b76d3b8a199eb90";
DROP INDEX IF EXISTS public."IDX_user_role";
DROP INDEX IF EXISTS public."IDX_user_movement_history_userId";
DROP INDEX IF EXISTS public."IDX_user_movement_history_fieldName";
DROP INDEX IF EXISTS public."IDX_user_movement_history_createdAt";
DROP INDEX IF EXISTS public."IDX_user_movement_history_companyId";
DROP INDEX IF EXISTS public."IDX_user_movement_history_changedById";
DROP INDEX IF EXISTS public."IDX_user_isApproved";
DROP INDEX IF EXISTS public."IDX_user_invitationId";
DROP INDEX IF EXISTS public."IDX_user_companyId";
DROP INDEX IF EXISTS public."IDX_invitation_usedById";
DROP INDEX IF EXISTS public."IDX_invitation_email";
DROP INDEX IF EXISTS public."IDX_invitation_createdById";
DROP INDEX IF EXISTS public."IDX_invitation_companyId";
DROP INDEX IF EXISTS public."IDX_invitation_code";
ALTER TABLE IF EXISTS ONLY public.invitation DROP CONSTRAINT IF EXISTS "UQ_invitation_code";
ALTER TABLE IF EXISTS ONLY public."user" DROP CONSTRAINT IF EXISTS "UQ_e12875dfb3b1d92d7d7c5377e22";
ALTER TABLE IF EXISTS ONLY public.company DROP CONSTRAINT IF EXISTS "UQ_company_cnpj";
ALTER TABLE IF EXISTS ONLY public.audit_configuration DROP CONSTRAINT IF EXISTS "UQ_audit_configuration_companyId";
ALTER TABLE IF EXISTS ONLY public.user_movement_history DROP CONSTRAINT IF EXISTS "PK_user_movement_history";
ALTER TABLE IF EXISTS ONLY public.invitation DROP CONSTRAINT IF EXISTS "PK_invitation";
ALTER TABLE IF EXISTS ONLY public.user_check_in DROP CONSTRAINT IF EXISTS "PK_ef4e4dbfef7108171430b39957a";
ALTER TABLE IF EXISTS ONLY public.company DROP CONSTRAINT IF EXISTS "PK_company";
ALTER TABLE IF EXISTS ONLY public."user" DROP CONSTRAINT IF EXISTS "PK_cace4a159ff9f2512dd42373760";
ALTER TABLE IF EXISTS ONLY public.audit_configuration DROP CONSTRAINT IF EXISTS "PK_audit_configuration";
ALTER TABLE IF EXISTS ONLY public.migrations DROP CONSTRAINT IF EXISTS "PK_8c82d7f526340ab734260ea46be";
ALTER TABLE IF EXISTS public.user_movement_history ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.user_check_in ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."user" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.migrations ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.invitation ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.company ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.audit_configuration ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.user_movement_history_id_seq;
DROP TABLE IF EXISTS public.user_movement_history;
DROP SEQUENCE IF EXISTS public.user_id_seq;
DROP SEQUENCE IF EXISTS public.user_check_in_id_seq;
DROP TABLE IF EXISTS public.user_check_in;
DROP TABLE IF EXISTS public."user";
DROP SEQUENCE IF EXISTS public.migrations_id_seq;
DROP TABLE IF EXISTS public.migrations;
DROP SEQUENCE IF EXISTS public.invitation_id_seq;
DROP TABLE IF EXISTS public.invitation;
DROP SEQUENCE IF EXISTS public.company_id_seq;
DROP TABLE IF EXISTS public.company;
DROP SEQUENCE IF EXISTS public.audit_configuration_id_seq;
DROP TABLE IF EXISTS public.audit_configuration;
DROP EXTENSION IF EXISTS "uuid-ossp";
--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_configuration; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_configuration (
    id integer NOT NULL,
    "companyId" integer NOT NULL,
    "trackedFields" text NOT NULL,
    "requireJustification" boolean DEFAULT false NOT NULL,
    "isEnabled" boolean DEFAULT true NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: audit_configuration_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.audit_configuration_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: audit_configuration_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.audit_configuration_id_seq OWNED BY public.audit_configuration.id;


--
-- Name: company; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.company (
    id integer NOT NULL,
    name character varying NOT NULL,
    cnpj character varying NOT NULL,
    "corporateName" character varying,
    email character varying,
    phone character varying,
    website character varying,
    address character varying,
    "addressNumber" character varying,
    "addressComplement" character varying,
    neighborhood character varying,
    city character varying,
    state character varying,
    "zipCode" character varying,
    country character varying,
    description text,
    logo character varying,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: company_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.company_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: company_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.company_id_seq OWNED BY public.company.id;


--
-- Name: invitation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invitation (
    id integer NOT NULL,
    code character varying NOT NULL,
    email character varying NOT NULL,
    name character varying,
    "position" character varying,
    department character varying,
    "isUsed" boolean DEFAULT false NOT NULL,
    "usedAt" timestamp without time zone,
    "expiresAt" timestamp without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "companyId" integer NOT NULL,
    "createdById" integer NOT NULL,
    "usedById" integer
);


--
-- Name: invitation_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.invitation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: invitation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.invitation_id_seq OWNED BY public.invitation.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    "isApproved" boolean DEFAULT false NOT NULL,
    "invitationCode" character varying,
    "companyId" integer,
    "invitationId" integer,
    role character varying DEFAULT 'employee'::character varying NOT NULL,
    cpf character varying,
    rg character varying,
    "birthDate" date,
    gender character varying,
    "maritalStatus" character varying,
    phone character varying,
    "mobilePhone" character varying,
    address character varying,
    "addressNumber" character varying,
    "addressComplement" character varying,
    neighborhood character varying,
    city character varying,
    state character varying,
    "zipCode" character varying,
    country character varying,
    "employeeId" character varying,
    department character varying,
    "position" character varying,
    "hireDate" date,
    salary numeric(10,2),
    "workSchedule" character varying,
    "employmentType" character varying,
    "directSupervisor" character varying,
    "bankName" character varying,
    "bankAccount" character varying,
    "bankAgency" character varying,
    "bankAccountType" character varying,
    pix character varying,
    "emergencyContactName" character varying,
    "emergencyContactPhone" character varying,
    "emergencyContactRelationship" character varying,
    education character varying,
    notes text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "profilePhoto" character varying,
    "resetPasswordToken" character varying,
    "resetPasswordExpires" timestamp without time zone,
    "refreshToken" text
);


--
-- Name: COLUMN "user".role; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public."user".role IS 'Allowed values: manager, employee, hr, admin';


--
-- Name: user_check_in; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_check_in (
    id integer NOT NULL,
    "checkIn" timestamp without time zone NOT NULL,
    "checkOut" timestamp without time zone,
    "userId" integer,
    "checkInPhoto" character varying,
    "checkOutPhoto" character varying,
    latitude numeric(10,7),
    longitude numeric(10,7),
    "checkInLocation" text,
    "outLatitude" numeric(10,7),
    "outLongitude" numeric(10,7),
    "checkOutLocation" text,
    "isManual" boolean DEFAULT false NOT NULL,
    reason text,
    status character varying DEFAULT 'approved'::character varying NOT NULL,
    "approvalDate" timestamp without time zone,
    "rejectionReason" text,
    "approvedBy" integer
);


--
-- Name: user_check_in_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_check_in_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_check_in_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_check_in_id_seq OWNED BY public.user_check_in.id;


--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: user_movement_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_movement_history (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "fieldName" character varying NOT NULL,
    "oldValue" text,
    "newValue" text,
    diff text,
    "changedById" integer NOT NULL,
    justification text,
    "ipAddress" character varying,
    "userAgent" text,
    "companyId" integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: user_movement_history_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_movement_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_movement_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_movement_history_id_seq OWNED BY public.user_movement_history.id;


--
-- Name: audit_configuration id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_configuration ALTER COLUMN id SET DEFAULT nextval('public.audit_configuration_id_seq'::regclass);


--
-- Name: company id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company ALTER COLUMN id SET DEFAULT nextval('public.company_id_seq'::regclass);


--
-- Name: invitation id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitation ALTER COLUMN id SET DEFAULT nextval('public.invitation_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Name: user_check_in id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_check_in ALTER COLUMN id SET DEFAULT nextval('public.user_check_in_id_seq'::regclass);


--
-- Name: user_movement_history id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_movement_history ALTER COLUMN id SET DEFAULT nextval('public.user_movement_history_id_seq'::regclass);


--
-- Data for Name: audit_configuration; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.audit_configuration (id, "companyId", "trackedFields", "requireJustification", "isEnabled", "updatedAt") FROM stdin;
\.


--
-- Data for Name: company; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.company (id, name, cnpj, "corporateName", email, phone, website, address, "addressNumber", "addressComplement", neighborhood, city, state, "zipCode", country, description, logo, "isActive", "createdAt", "updatedAt") FROM stdin;
1	Chronos Tech	12345678000190	Chronos Tecnologia Ltda	contato@chronostech.com.br	1133334444	https://chronoswork.com.br	Rua Augusta	1500	\N	Consola��o	S�o Paulo	SP	01304001	Brasil	Empresa de tecnologia especializada em solu��es de ponto eletr�nico.	\N	t	2026-02-12 22:44:20.817966	2026-02-13 02:58:59.196352
\.


--
-- Data for Name: invitation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.invitation (id, code, email, name, "position", department, "isUsed", "usedAt", "expiresAt", "isActive", "createdAt", "updatedAt", "companyId", "createdById", "usedById") FROM stdin;
1	INV-ABC123	ana.silva@email.com	Ana Silva	Desenvolvedora Frontend	Desenvolvimento	t	2025-04-18 22:45:45.953523	2026-03-14 22:45:45.953523	t	2025-04-13 22:45:45.953523	2025-04-18 22:45:45.953523	1	1	2
2	INV-DEF456	carlos.oliveira@email.com	Carlos Oliveira	Desenvolvedor Backend	Desenvolvimento	t	2025-06-07 22:45:45.953523	2026-03-14 22:45:45.953523	t	2025-06-02 22:45:45.953523	2025-06-07 22:45:45.953523	1	1	3
3	INV-GHI789	mariana.costa@email.com	Mariana Costa	UI/UX Designer	Design	t	2025-08-16 22:45:45.953523	2026-03-14 22:45:45.953523	t	2025-08-11 22:45:45.953523	2025-08-16 22:45:45.953523	1	1	4
4	INV-JKL012	novo.dev@email.com	Novo Desenvolvedor	Desenvolvedor Full Stack	Desenvolvimento	f	\N	2026-03-09 22:45:45.953523	t	2026-02-07 22:45:45.953523	2026-02-07 22:45:45.953523	1	1	\N
5	INV-MNO345	designer.jr@email.com	Designer Junior	Designer Gráfico	Design	f	\N	2026-03-04 22:45:45.953523	t	2026-02-02 22:45:45.953523	2026-02-02 22:45:45.953523	1	1	\N
6	INV-PQR678	analista.dados@email.com	Analista de Dados	Data Analyst	Dados	f	\N	2026-02-27 22:45:45.953523	t	2026-01-28 22:45:45.953523	2026-01-28 22:45:45.953523	1	1	\N
7	INV-STU901	cancelado@email.com	Usuário Cancelado	Testador	QA	f	\N	2026-02-22 22:45:45.953523	f	2026-01-23 22:45:45.953523	2026-01-25 22:45:45.953523	1	1	\N
8	INV-VWX234	expirado@email.com	Usuário Expirado	DevOps	Infraestrutura	f	\N	2026-02-07 22:45:45.953523	t	2026-01-03 22:45:45.953523	2026-01-03 22:45:45.953523	1	1	\N
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
1	1761191116875	CreateTables1761191116875
2	1761200000000	AddCompanyAndInvitationSystem1761200000000
3	1761259480278	AddHRFieldsToUser1761259480278
4	1761260208489	AddProfilePhotoAndResetPasswordFields1761260208489
5	1761275653661	AddRefreshTokenToUser1761275653661
6	1761323426190	AddPhotoFieldsToUserCheckIn1761323426190
7	1761325666199	AddLocationFieldsToUserCheckIn1761325666199
8	1761400000000	RenameGPSFieldsInUserCheckIn1761400000000
9	1761485670551	AddManualTimeLogFields1761485670551
10	1761500000000	AddAuditEntities1761500000000
11	1761500000001	ExtendUserRoles1761500000001
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."user" (id, name, email, password, "isApproved", "invitationCode", "companyId", "invitationId", role, cpf, rg, "birthDate", gender, "maritalStatus", phone, "mobilePhone", address, "addressNumber", "addressComplement", neighborhood, city, state, "zipCode", country, "employeeId", department, "position", "hireDate", salary, "workSchedule", "employmentType", "directSupervisor", "bankName", "bankAccount", "bankAgency", "bankAccountType", pix, "emergencyContactName", "emergencyContactPhone", "emergencyContactRelationship", education, notes, "isActive", "createdAt", "updatedAt", "profilePhoto", "resetPasswordToken", "resetPasswordExpires", "refreshToken") FROM stdin;
2	Ana Silva	ana.silva@email.com	$2b$10$IzDL7oo5LRKEwzumKipuMuFskFe.3BsNwHML.Mzn420wrbvs686Qm	t	\N	1	\N	employee	98765432100	\N	\N	\N	\N	11988887777	\N	Rua Paulista	1000	\N	Bela Vista	São Paulo	SP	01310100	Brasil	\N	Desenvolvimento	Desenvolvedora Frontend	2025-03-15	8500.00	09:00-18:00	CLT	\N	Nubank	123456-7	0001	Corrente	ana.silva@email.com	Maria Silva	11977776666	Mãe	Superior	\N	t	2025-04-18 22:45:28.504846	2026-02-12 22:45:28.504846	\N	\N	\N	\N
3	Carlos Oliveira	carlos.oliveira@email.com	$2b$10$IzDL7oo5LRKEwzumKipuMuFskFe.3BsNwHML.Mzn420wrbvs686Qm	t	\N	1	\N	employee	11122233344	\N	\N	\N	\N	11977776666	\N	Av Brigadeiro Faria Lima	2000	\N	Pinheiros	São Paulo	SP	05426200	Brasil	\N	Desenvolvimento	Desenvolvedor Backend	2025-01-10	9200.00	09:00-18:00	CLT	\N	Itaú	789012-3	1234	Corrente	11977776666	Rosa Oliveira	11966665555	Mãe	Superior	\N	t	2025-06-07 22:45:28.504846	2026-02-12 22:45:28.504846	\N	\N	\N	\N
4	Mariana Costa	mariana.costa@email.com	$2b$10$IzDL7oo5LRKEwzumKipuMuFskFe.3BsNwHML.Mzn420wrbvs686Qm	t	\N	1	\N	employee	55566677788	\N	\N	\N	\N	11966665555	\N	Rua Oscar Freire	500	\N	Jardins	São Paulo	SP	01426001	Brasil	\N	Design	UI/UX Designer	2025-06-01	7800.00	10:00-19:00	CLT	\N	Bradesco	345678-9	0567	Poupança	mariana.costa@email.com	José Costa	11955554444	Pai	Pós-graduação	\N	t	2025-08-16 22:45:28.504846	2026-02-12 22:45:28.504846	\N	\N	\N	\N
5	Rafael Santos	rafael.santos@email.com	$2b$10$IzDL7oo5LRKEwzumKipuMuFskFe.3BsNwHML.Mzn420wrbvs686Qm	t	\N	1	\N	employee	99988877766	\N	\N	\N	\N	11955554444	\N	Rua Vergueiro	3000	\N	Vila Mariana	São Paulo	SP	04101300	Brasil	\N	QA	Analista de Qualidade	2025-08-20	6500.00	08:00-17:00	CLT	\N	Banco do Brasil	567890-1	2345	Corrente	99988877766	Lucia Santos	11944443333	Esposa	Superior	\N	t	2025-10-15 22:45:28.504846	2026-02-12 22:45:28.504846	\N	\N	\N	\N
6	Juliana Pereira	juliana.pereira@email.com	$2b$10$IzDL7oo5LRKEwzumKipuMuFskFe.3BsNwHML.Mzn420wrbvs686Qm	t	\N	1	\N	employee	44455566677	\N	\N	\N	\N	11944443333	\N	Rua Haddock Lobo	800	\N	Cerqueira César	São Paulo	SP	01414001	Brasil	\N	Produto	Product Owner	2025-04-01	11000.00	09:00-18:00	PJ	\N	Inter	901234-5	0001	Corrente	juliana.pereira@email.com	Pedro Pereira	11933332222	Marido	Mestrado	\N	t	2025-07-27 22:45:28.504846	2026-02-12 22:45:28.504846	\N	\N	\N	\N
7	Lucas Mendes	lucas.mendes@email.com	$2b$10$IzDL7oo5LRKEwzumKipuMuFskFe.3BsNwHML.Mzn420wrbvs686Qm	f	\N	1	\N	employee	77788899900	\N	\N	\N	\N	11933332222	\N	Rua da Consolação	1200	\N	Consolação	São Paulo	SP	01302000	Brasil	\N	Desenvolvimento	Estagiário	2026-02-01	2000.00	09:00-15:00	Estagiário	\N	\N	\N	\N	\N	\N	Teresa Mendes	11922221111	Mãe	Superior	\N	f	2026-02-07 22:45:28.504846	2026-02-12 22:45:28.504846	\N	\N	\N	\N
8	Fernanda Lima	fernanda.lima@email.com	$2b$10$IzDL7oo5LRKEwzumKipuMuFskFe.3BsNwHML.Mzn420wrbvs686Qm	f	\N	1	\N	employee	33344455566	\N	\N	\N	\N	11922221111	\N	Av Paulista	900	\N	Bela Vista	São Paulo	SP	01310100	Brasil	\N	Marketing	Analista de Marketing	2026-02-10	5500.00	09:00-18:00	CLT	\N	Nubank	112233-4	0001	Corrente	fernanda.lima@email.com	Roberto Lima	11911110000	Pai	Superior	\N	f	2026-02-10 22:45:28.504846	2026-02-12 22:45:28.504846	\N	\N	\N	\N
1	Pablo Carvalho	pablocarvalho.dev@gmail.com	$2b$10$aGP2W9IhhfvIPRmGmlXuwedSpn5A6pEPqORf7AhqJW4wjG/c7UolC	t	\N	1	\N	manager	12345678901	\N	\N	\N	\N	11999999999	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	2026-02-12 22:44:20.817966	2026-02-13 04:00:45.907222	\N	\N	\N	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoicGFibG9jYXJ2YWxoby5kZXZAZ21haWwuY29tIiwiaWF0IjoxNzcwOTU1MjQ1LCJleHAiOjE3NzE1NjAwNDV9.F0MmFrq91uyoZPrfpXGaahH4lOEmbIKIIVsWqyGlBIY
\.


--
-- Data for Name: user_check_in; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_check_in (id, "checkIn", "checkOut", "userId", "checkInPhoto", "checkOutPhoto", latitude, longitude, "checkInLocation", "outLatitude", "outLongitude", "checkOutLocation", "isManual", reason, status, "approvalDate", "rejectionReason", "approvedBy") FROM stdin;
1	2026-02-12 07:46:10.357492	2026-02-12 17:01:10.357492	2	\N	\N	-23.5505000	-46.6333000	Rua Paulista, São Paulo	-23.5505000	-46.6333000	Rua Paulista, São Paulo	f	\N	approved	\N	\N	\N
2	2026-02-11 07:41:10.357492	2026-02-11 16:51:10.357492	2	\N	\N	-23.5505000	-46.6333000	Rua Paulista, São Paulo	-23.5505000	-46.6333000	Rua Paulista, São Paulo	f	\N	approved	\N	\N	\N
3	2026-02-10 07:56:10.357492	2026-02-10 17:16:10.357492	2	\N	\N	-23.5505000	-46.6333000	Rua Paulista, São Paulo	-23.5505000	-46.6333000	Rua Paulista, São Paulo	f	\N	approved	\N	\N	\N
4	2026-02-09 07:51:10.357492	2026-02-09 16:36:10.357492	2	\N	\N	-23.5505000	-46.6333000	Rua Paulista, São Paulo	-23.5505000	-46.6333000	Rua Paulista, São Paulo	f	\N	approved	\N	\N	\N
5	2026-02-08 07:36:10.357492	2026-02-08 16:56:10.357492	2	\N	\N	-23.5505000	-46.6333000	Rua Paulista, São Paulo	-23.5505000	-46.6333000	Rua Paulista, São Paulo	f	\N	approved	\N	\N	\N
6	2026-02-12 08:01:10.357492	2026-02-12 17:16:10.357492	3	\N	\N	-23.5667000	-46.6928000	Av Faria Lima, São Paulo	-23.5667000	-46.6928000	Av Faria Lima, São Paulo	f	\N	approved	\N	\N	\N
7	2026-02-11 07:31:10.357492	2026-02-11 16:46:10.357492	3	\N	\N	-23.5667000	-46.6928000	Av Faria Lima, São Paulo	-23.5667000	-46.6928000	Av Faria Lima, São Paulo	f	\N	approved	\N	\N	\N
8	2026-02-10 07:46:10.357492	2026-02-10 17:31:10.357492	3	\N	\N	-23.5667000	-46.6928000	Av Faria Lima, São Paulo	-23.5667000	-46.6928000	Av Faria Lima, São Paulo	f	\N	approved	\N	\N	\N
9	2026-02-09 08:16:10.357492	2026-02-09 17:01:10.357492	3	\N	\N	-23.5667000	-46.6928000	Av Faria Lima, São Paulo	-23.5667000	-46.6928000	Av Faria Lima, São Paulo	f	\N	approved	\N	\N	\N
10	2026-02-08 07:46:10.357492	2026-02-08 16:31:10.357492	3	\N	\N	-23.5667000	-46.6928000	Av Faria Lima, São Paulo	-23.5667000	-46.6928000	Av Faria Lima, São Paulo	f	\N	approved	\N	\N	\N
11	2026-02-12 08:46:10.357492	2026-02-12 17:46:10.357492	4	\N	\N	-23.5629000	-46.6698000	Rua Oscar Freire, São Paulo	-23.5629000	-46.6698000	Rua Oscar Freire, São Paulo	f	\N	approved	\N	\N	\N
12	2026-02-11 09:01:10.357492	2026-02-11 17:56:10.357492	4	\N	\N	-23.5629000	-46.6698000	Rua Oscar Freire, São Paulo	-23.5629000	-46.6698000	Rua Oscar Freire, São Paulo	f	\N	approved	\N	\N	\N
13	2026-02-10 08:36:10.357492	2026-02-10 17:51:10.357492	4	\N	\N	-23.5629000	-46.6698000	Rua Oscar Freire, São Paulo	-23.5629000	-46.6698000	Rua Oscar Freire, São Paulo	f	\N	approved	\N	\N	\N
14	2026-02-12 06:46:10.357492	2026-02-12 15:46:10.357492	5	\N	\N	-23.5874000	-46.6355000	Rua Vergueiro, São Paulo	-23.5874000	-46.6355000	Rua Vergueiro, São Paulo	f	\N	approved	\N	\N	\N
15	2026-02-11 06:56:10.357492	2026-02-11 16:06:10.357492	5	\N	\N	-23.5874000	-46.6355000	Rua Vergueiro, São Paulo	-23.5874000	-46.6355000	Rua Vergueiro, São Paulo	f	\N	approved	\N	\N	\N
16	2026-02-10 06:41:10.357492	2026-02-10 15:51:10.357492	5	\N	\N	-23.5874000	-46.6355000	Rua Vergueiro, São Paulo	-23.5874000	-46.6355000	Rua Vergueiro, São Paulo	f	\N	approved	\N	\N	\N
17	2026-02-09 06:51:10.357492	\N	5	\N	\N	-23.5874000	-46.6355000	Rua Vergueiro, São Paulo	\N	\N	\N	f	\N	approved	\N	\N	\N
18	2026-02-12 07:46:10.357492	2026-02-12 16:46:10.357492	6	\N	\N	-23.5601000	-46.6685000	Rua Haddock Lobo, São Paulo	-23.5601000	-46.6685000	Rua Haddock Lobo, São Paulo	f	\N	approved	\N	\N	\N
19	2026-02-11 08:06:10.357492	2026-02-11 17:26:10.357492	6	\N	\N	-23.5601000	-46.6685000	Rua Haddock Lobo, São Paulo	-23.5601000	-46.6685000	Rua Haddock Lobo, São Paulo	f	\N	approved	\N	\N	\N
20	2026-02-07 07:46:10.357492	2026-02-07 16:46:10.357492	2	\N	\N	-23.5505000	-46.6333000	Rua Paulista, São Paulo	-23.5505000	-46.6333000	Rua Paulista, São Paulo	t	\N	pending	\N	\N	\N
21	2026-02-06 07:16:10.357492	2026-02-06 16:16:10.357492	3	\N	\N	-23.5667000	-46.6928000	Av Faria Lima, São Paulo	-23.5667000	-46.6928000	Av Faria Lima, São Paulo	t	\N	pending	\N	\N	\N
22	2026-02-03 07:46:10.357492	2026-02-03 20:46:10.357492	5	\N	\N	-23.5874000	-46.6355000	Rua Vergueiro, São Paulo	-23.5874000	-46.6355000	Rua Vergueiro, São Paulo	t	\N	rejected	\N	\N	\N
\.


--
-- Data for Name: user_movement_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_movement_history (id, "userId", "fieldName", "oldValue", "newValue", diff, "changedById", justification, "ipAddress", "userAgent", "companyId", "createdAt") FROM stdin;
\.


--
-- Name: audit_configuration_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.audit_configuration_id_seq', 1, false);


--
-- Name: company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.company_id_seq', 1, true);


--
-- Name: invitation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.invitation_id_seq', 8, true);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.migrations_id_seq', 11, true);


--
-- Name: user_check_in_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_check_in_id_seq', 22, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_id_seq', 8, true);


--
-- Name: user_movement_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_movement_history_id_seq', 1, false);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: audit_configuration PK_audit_configuration; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_configuration
    ADD CONSTRAINT "PK_audit_configuration" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: company PK_company; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "PK_company" PRIMARY KEY (id);


--
-- Name: user_check_in PK_ef4e4dbfef7108171430b39957a; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_check_in
    ADD CONSTRAINT "PK_ef4e4dbfef7108171430b39957a" PRIMARY KEY (id);


--
-- Name: invitation PK_invitation; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitation
    ADD CONSTRAINT "PK_invitation" PRIMARY KEY (id);


--
-- Name: user_movement_history PK_user_movement_history; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_movement_history
    ADD CONSTRAINT "PK_user_movement_history" PRIMARY KEY (id);


--
-- Name: audit_configuration UQ_audit_configuration_companyId; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_configuration
    ADD CONSTRAINT "UQ_audit_configuration_companyId" UNIQUE ("companyId");


--
-- Name: company UQ_company_cnpj; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "UQ_company_cnpj" UNIQUE (cnpj);


--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: invitation UQ_invitation_code; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitation
    ADD CONSTRAINT "UQ_invitation_code" UNIQUE (code);


--
-- Name: IDX_invitation_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_invitation_code" ON public.invitation USING btree (code);


--
-- Name: IDX_invitation_companyId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_invitation_companyId" ON public.invitation USING btree ("companyId");


--
-- Name: IDX_invitation_createdById; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_invitation_createdById" ON public.invitation USING btree ("createdById");


--
-- Name: IDX_invitation_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_invitation_email" ON public.invitation USING btree (email);


--
-- Name: IDX_invitation_usedById; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_invitation_usedById" ON public.invitation USING btree ("usedById");


--
-- Name: IDX_user_companyId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_user_companyId" ON public."user" USING btree ("companyId");


--
-- Name: IDX_user_invitationId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_user_invitationId" ON public."user" USING btree ("invitationId");


--
-- Name: IDX_user_isApproved; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_user_isApproved" ON public."user" USING btree ("isApproved");


--
-- Name: IDX_user_movement_history_changedById; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_user_movement_history_changedById" ON public.user_movement_history USING btree ("changedById");


--
-- Name: IDX_user_movement_history_companyId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_user_movement_history_companyId" ON public.user_movement_history USING btree ("companyId");


--
-- Name: IDX_user_movement_history_createdAt; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_user_movement_history_createdAt" ON public.user_movement_history USING btree ("createdAt");


--
-- Name: IDX_user_movement_history_fieldName; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_user_movement_history_fieldName" ON public.user_movement_history USING btree ("fieldName");


--
-- Name: IDX_user_movement_history_userId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_user_movement_history_userId" ON public.user_movement_history USING btree ("userId");


--
-- Name: IDX_user_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_user_role" ON public."user" USING btree (role);


--
-- Name: user_check_in FK_6f7e62b7e030b76d3b8a199eb90; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_check_in
    ADD CONSTRAINT "FK_6f7e62b7e030b76d3b8a199eb90" FOREIGN KEY ("approvedBy") REFERENCES public."user"(id);


--
-- Name: audit_configuration FK_audit_configuration_company; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_configuration
    ADD CONSTRAINT "FK_audit_configuration_company" FOREIGN KEY ("companyId") REFERENCES public.company(id);


--
-- Name: user_check_in FK_e843d6655884ab837468fcb03ae; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_check_in
    ADD CONSTRAINT "FK_e843d6655884ab837468fcb03ae" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: invitation FK_invitation_company; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitation
    ADD CONSTRAINT "FK_invitation_company" FOREIGN KEY ("companyId") REFERENCES public.company(id) ON DELETE CASCADE;


--
-- Name: invitation FK_invitation_createdBy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitation
    ADD CONSTRAINT "FK_invitation_createdBy" FOREIGN KEY ("createdById") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: invitation FK_invitation_usedBy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitation
    ADD CONSTRAINT "FK_invitation_usedBy" FOREIGN KEY ("usedById") REFERENCES public."user"(id) ON DELETE SET NULL;


--
-- Name: user FK_user_company; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "FK_user_company" FOREIGN KEY ("companyId") REFERENCES public.company(id) ON DELETE SET NULL;


--
-- Name: user FK_user_invitation; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "FK_user_invitation" FOREIGN KEY ("invitationId") REFERENCES public.invitation(id) ON DELETE SET NULL;


--
-- Name: user_movement_history FK_user_movement_history_changedBy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_movement_history
    ADD CONSTRAINT "FK_user_movement_history_changedBy" FOREIGN KEY ("changedById") REFERENCES public."user"(id);


--
-- Name: user_movement_history FK_user_movement_history_company; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_movement_history
    ADD CONSTRAINT "FK_user_movement_history_company" FOREIGN KEY ("companyId") REFERENCES public.company(id);


--
-- Name: user_movement_history FK_user_movement_history_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_movement_history
    ADD CONSTRAINT "FK_user_movement_history_user" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict I7SsbMFlaBkevuSCGbURAu6QVLJTRdM0Xyvt4dKXxurBJx6Rj6CLV96Cz9ecfH1

