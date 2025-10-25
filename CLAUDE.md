# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chronos.work is a time tracking application built with Node.js, Express, TypeORM, and PostgreSQL. It provides user authentication and check-in/check-out functionality for tracking work hours.

## Technology Stack

- **Runtime**: Node.js with ES Modules (`"type": "module"`)
- **Language**: TypeScript with strict mode and ES2022 target
- **Framework**: Express 5.x
- **Database**: PostgreSQL via TypeORM 0.3.x
- **Authentication**: JWT (JSON Web Tokens) with access and refresh tokens
- **Validation**: Zod for request validation
- **Password Hashing**: bcrypt
- **Email**: nodemailer for transactional emails
- **File Upload**: multer for profile photo uploads
- **Documentation**: Scalar UI with auto-generated OpenAPI from Zod schemas

## Development Commands

```bash
# Start server (clean, no warnings)
npm start

# Development mode with auto-reload on file changes
npm run dev

# Build for production
npm run build

# Run production build
npm run start:prod

# Database migrations
npm run migration:run           # Run pending migrations
npm run migration:revert        # Revert last migration
npm run migration:gen --name=MigrationName  # Generate migration

# Direct TypeORM CLI access
npm run typeorm -- [command]

# Generate OpenAPI documentation
npm run docs:gen
```

## Environment Setup

Create a `.env` file with these required variables:

**Database Configuration:**
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_DATABASE` - Database name

**Server Configuration:**
- `PORT` - API server port (default: 8000)

**JWT Configuration:**
- `JWT_ACCESS_SECRET` - Secret for signing access tokens (15 min expiry)
- `JWT_REFRESH_SECRET` - Secret for signing refresh tokens (7 day expiry)

**Email Configuration (SMTP):**
- `SMTP_HOST` - SMTP server host (e.g., smtp.gmail.com)
- `SMTP_PORT` - SMTP port (usually 587)
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password
- `SMTP_FROM` - From address for emails

**Frontend Configuration:**
- `FRONTEND_URL` - Frontend URL for email links (e.g., http://localhost:3000)

**Cloudinary Configuration (File Uploads):**
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret

The application uses `docker-compose.yml` for PostgreSQL. Start with: `docker-compose up -d`

**First-time setup checklist**:
1. Install dependencies: `npm install`
2. Start PostgreSQL: `docker-compose up -d`
3. **Run migrations**: `npm run migration:run` (⚠️ Required before first use!)
4. Start the server: `npm start` or `npm run dev`

## Architecture

This project follows the **MVC (Model-View-Controller)** pattern:

### TypeScript Configuration
- Uses ES Modules with `"module": "nodenext"`
- **Decorators enabled**: `experimentalDecorators` and `emitDecoratorMetadata` are required for TypeORM entities
- Strict type checking with additional safety options:
  - `noUncheckedIndexedAccess: true`
  - `exactOptionalPropertyTypes: true`
- All imports must use `.js` extension in TypeScript files (ES module requirement)

### MVC Structure

**Models** (`src/models/`):
- `User.ts`: TypeORM entity with comprehensive user information including:
  - Basic: id, name, email, password, profilePhoto
  - Personal: cpf, rg, birthDate, gender, maritalStatus, phone
  - Address: full address fields
  - Professional: employeeId, department, position, hireDate, salary, workSchedule
  - Banking: bankName, bankAccount, pix
  - Emergency: contact information
  - Password reset: resetPasswordToken, resetPasswordExpires
  - JWT: refreshToken field for token rotation
- `UserCheckIn.ts`: TypeORM entity for time log entries with ManyToOne relationship to User, checkIn date, and optional checkOut date
- Models define the data structure and database schema using TypeORM decorators

**Controllers** (`src/controllers/`):
- `UserController.ts`: Handles authentication and user management:
  - Authentication: login, register, refreshToken, logout
  - Profile: getProfile, getProfilePhoto, uploadPhoto
  - Password: forgotPassword, resetPassword
- `TimeLogController.ts`: Manages time tracking operations (checkIn, checkOut, getTimeLogs)
- Controllers contain static methods that process requests and return responses
- Controllers use repositories from AppDataSource to interact with models

**Routes** (`src/routes/`):
- `auth.ts`: Maps authentication endpoints to UserController methods
- `timeLog.ts`: Maps time logging endpoints to TimeLogController methods
- Routes define URL patterns and apply middleware (validation, authentication)
- Routes delegate business logic to controllers

**Middlewares** (`src/middlewares/`):
- `validate.ts`: Generic Zod schema validation middleware
- `auth.ts`: Contains `isAuthenticated` middleware that verifies JWT Bearer tokens

**Services** (`src/services/`):
- `jwtService.ts`: JWT token generation and verification (access and refresh tokens)
- `emailService.ts`: Email sending with nodemailer (welcome, password reset)

### Application Flow

**Entry Point**: `src/index.ts`
- Initializes Express app with JSON and URL-encoded parsing
- Configures CORS for frontend communication (localhost:3000-3002)
- Sets up Morgan for HTTP request logging
- Serves static files from `/uploads` directory for profile photos
- Registers route handlers at `/auth` and `/timelog`
- Serves OpenAPI spec at `/openapi.json` and interactive docs at `/docs`
- Initializes TypeORM DataSource before starting server

**Database Layer**: `src/database/data-source.ts`
- Single DataSource export (`AppDataSource`)
- `synchronize: false` - migrations are required for schema changes
- Models are explicitly listed in the entities array
- Must be initialized before database operations
- Validates required environment variables on startup

**Authentication Flow**:
- JWT-based authentication with Bearer tokens
- Login/Register generate both access token (15 min) and refresh token (7 days)
- Access tokens sent in Authorization header: `Bearer <token>`
- Refresh tokens used to obtain new access tokens via `/auth/refresh-token`
- Passwords hashed with bcrypt (10 rounds)
- User attached to `req.user` by `isAuthenticated` middleware after token verification
- Refresh tokens stored in database User.refreshToken field and rotated on use
- Logout invalidates refresh token by clearing it from database

**Request Flow**:
1. Request hits a route endpoint (`src/routes/`)
2. Middleware validation/authentication runs (`src/middlewares/`)
3. Controller method processes the request (`src/controllers/`)
4. Controller interacts with models via repositories (`src/models/`)
5. Controller returns response to client

**Email Flow**:
- Welcome emails sent asynchronously after registration (non-blocking)
- Password reset emails contain token link to frontend reset page
- Uses nodemailer with SMTP configuration from environment
- Emails sent from `SMTP_FROM` address

### Migration System

- Migrations stored in `src/database/migrations/`
- Custom template at `src/database/migration-template.ts`
- Generate migrations with: `npm run migration:gen --name=DescriptiveName`
- Always run migrations before starting the app in production

## Important Development Notes

1. **File Extensions**: All TypeScript imports must use `.js` extension, not `.ts` (TypeScript+ESM requirement)
2. **Reflect Metadata**: Import "reflect-metadata" at the top of files using TypeORM decorators
3. **Authentication**:
   - Protected routes use the `isAuthenticated` middleware from `src/middlewares/auth.ts`
   - Requires `Authorization: Bearer <access_token>` header
   - Middleware attaches full User object to `req.user`
4. **TypeORM Queries**: Controllers use `AppDataSource.getRepository(Model)` to access repositories
5. **Error Handling**: Controllers return generic 500 errors; consider improving error specificity
6. **Type Safety**: User is cast as `req.user as User` in controller methods
7. **MVC Pattern**: Always separate concerns - routes define endpoints, controllers handle logic, models define data
8. **TypeORM Column Types**: Always specify explicit column types (e.g., `@Column('varchar')`) instead of relying on `emitDecoratorMetadata` for better tsx compatibility
9. **File Uploads**:
   - Uses multer with Cloudinary storage configured in `src/config/multer.ts`
   - Profile photos uploaded to Cloudinary folder `chronos-work/profiles`
   - Check-in photos uploaded to Cloudinary folder `chronos-work/checkins`
   - Photos automatically optimized with size limits (500x500 for profiles, 1000x1000 for check-ins)
   - URLs returned are full Cloudinary URLs accessible from anywhere
10. **Email Service**:
    - Asynchronous, non-blocking email sending
    - Uses `.catch()` to handle errors without failing requests
    - For development, use Ethereal Email (https://ethereal.email/) for testing

## API Documentation

**Interactive Documentation**: Available at `http://localhost:8000/docs`

The API documentation is powered by Scalar (alternative to Swagger UI) and provides:
- Interactive request testing
- Complete endpoint descriptions
- Request/response examples
- Schema definitions
- Authentication testing

**OpenAPI Specification**: Located at `openapi.json` in the project root

**Auto-generated Documentation**:
- Documentation is generated from Zod schemas in `src/utils/openapi-generator.ts`
- Runs automatically before `npm start` and `npm run dev`
- Generate manually with `npm run docs:gen`
- See `OPENAPI_README.md` for details on adding new endpoints to documentation

## API Endpoints

**Authentication** (prefix: `/auth`):
- POST `/auth/login` - Authenticate user, returns access + refresh tokens → `UserController.login`
- POST `/auth/register` - Create new user, returns access + refresh tokens → `UserController.register`
- POST `/auth/refresh-token` - Get new access token using refresh token → `UserController.refreshToken`
- POST `/auth/logout` - Invalidate refresh token (requires auth) → `UserController.logout`
- GET `/auth/profile` - Get authenticated user profile (requires auth) → `UserController.getProfile`
- GET `/auth/profile-photo` - Get user's profile photo URL (requires auth) → `UserController.getProfilePhoto`
- POST `/auth/upload-photo` - Upload profile photo (requires auth, multipart/form-data) → `UserController.uploadPhoto`
- POST `/auth/forgot-password` - Request password reset email → `UserController.forgotPassword`
- POST `/auth/reset-password` - Reset password with token → `UserController.resetPassword`

**Time Logging** (prefix: `/timelog`, all require authentication):
- POST `/timelog/checkin` - Check in to start a work session → `TimeLogController.checkIn`
- POST `/timelog/checkout` - Check out from current session → `TimeLogController.checkOut`
- GET `/timelog` - Get all time logs for authenticated user → `TimeLogController.getTimeLogs`

**Other**:
- GET `/health` - Health check endpoint
- GET `/docs` - Interactive API documentation (Scalar UI)
- GET `/openapi.json` - OpenAPI specification
- GET `/uploads/profiles/:filename` - Serve profile photos (static)

## Code Patterns

**Creating new models**:
1. Define entity class with TypeORM decorators in `src/models/`
2. Add to `entities` array in `src/database/data-source.ts`
3. Generate migration: `npm run migration:gen --name=AddEntityName`
4. Run migration: `npm run migration:run`

**Adding new features (MVC pattern)**:
1. **Model**: Create or update TypeORM entity in `src/models/`
2. **Controller**: Create controller class with static methods in `src/controllers/`
   - Methods should follow the pattern: `static async methodName(req: Request, res: Response)`
   - Use `AppDataSource.getRepository(Model)` to access database
3. **Routes**: Create or update router in `src/routes/`
   - Import controller methods
   - Define routes: `router.method('/path', middleware, ControllerName.methodName)`
   - Apply `isAuthenticated` middleware for protected routes
   - Apply `validate(schema)` middleware for request validation
4. **Register**: Import router in `src/index.ts` and register with `app.use()`

**Request validation**:
1. Define Zod schema in `src/schemas/`
2. Apply `validate(schema)` middleware in route definition

**Adding to OpenAPI documentation**:
1. Register schema in `src/utils/openapi-generator.ts` using `registry.register()`
2. Register path with `registry.registerPath()` including request/response schemas
3. Run `npm run docs:gen` to regenerate `openapi.json`
4. View at http://localhost:8000/docs

**Example: Adding a new endpoint**:
```typescript
// 1. Create schema (src/schemas/mySchema.ts)
export const mySchema = z.object({ ... });

// 2. Add controller method (src/controllers/MyController.ts)
export class MyController {
  static async myMethod(req: Request, res: Response) { ... }
}

// 3. Add route (src/routes/myRoutes.ts)
router.post('/path', validate(mySchema), isAuthenticated, MyController.myMethod);

// 4. Register in src/index.ts
app.use('/my-prefix', myRouter);

// 5. Add to OpenAPI docs (src/utils/openapi-generator.ts)
registry.registerPath({
  method: 'post',
  path: '/my-prefix/path',
  tags: ['My Tag'],
  summary: 'My endpoint',
  request: { body: { content: { 'application/json': { schema: mySchema } } } },
  responses: { 200: { description: 'Success' } },
  security: [{ bearerAuth: [] }] // if authenticated
});
```
