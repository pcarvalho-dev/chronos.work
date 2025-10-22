# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chronos.work is a time tracking application built with Node.js, Express, TypeORM, and PostgreSQL. It provides user authentication and check-in/check-out functionality for tracking work hours.

## Technology Stack

- **Runtime**: Node.js with ES Modules (`"type": "module"`)
- **Language**: TypeScript with strict mode and ES2022 target
- **Framework**: Express 5.x
- **Database**: PostgreSQL via TypeORM 0.3.x
- **Authentication**: Passport.js with local strategy and express-session
- **Validation**: Zod for request validation
- **Password Hashing**: bcrypt

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
```

## Environment Setup

Create a `.env` file with these required variables:
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_DATABASE` - Database name
- `PORT` - API server port (default: 8000)
- `SECRET` - Session secret key

The application uses `docker-compose.yml` for PostgreSQL. Start with: `docker-compose up -d`

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
- `User.ts`: TypeORM entity representing users with id, name, email (unique), and password (hashed)
- `UserCheckIn.ts`: TypeORM entity for time log entries with ManyToOne relationship to User, checkIn date, and optional checkOut date
- Models define the data structure and database schema using TypeORM decorators

**Controllers** (`src/controllers/`):
- `UserController.ts`: Handles user authentication logic (login, register)
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
- `auth.ts`: Contains `isAuthenticated` middleware for protecting routes

### Application Flow

**Entry Point**: `src/index.ts`
- Initializes Express app with JSON and URL-encoded parsing
- Configures express-session with secret from environment
- Initializes Passport authentication
- Registers route handlers at `/auth` and `/timelog`
- Initializes TypeORM DataSource before starting server

**Database Layer**: `src/database/data-source.ts`
- Single DataSource export (`AppDataSource`)
- `synchronize: false` - migrations are required for schema changes
- Models are explicitly listed in the entities array
- Must be initialized before database operations

**Authentication Flow** (src/config/passport.ts):
- Uses LocalStrategy with email as username field
- Passwords compared with bcrypt in the User model
- User serialized/deserialized by ID for sessions
- Routes use `passport.authenticate('local')` middleware for login

**Request Flow**:
1. Request hits a route endpoint (`src/routes/`)
2. Middleware validation/authentication runs (`src/middlewares/`)
3. Controller method processes the request (`src/controllers/`)
4. Controller interacts with models via repositories (`src/models/`)
5. Controller returns response to client

### Migration System

- Migrations stored in `src/database/migrations/`
- Custom template at `src/database/migration-template.ts`
- Generate migrations with: `npm run migration:gen --name=DescriptiveName`
- Always run migrations before starting the app in production

## Important Development Notes

1. **File Extensions**: All TypeScript imports must use `.js` extension, not `.ts` (TypeScript+ESM requirement)
2. **Reflect Metadata**: Import "reflect-metadata" at the top of files using TypeORM decorators
3. **Authentication**: Protected routes use the `isAuthenticated` middleware from `src/middlewares/auth.ts`
4. **TypeORM Queries**: Controllers use `AppDataSource.getRepository(Model)` to access repositories
5. **Error Handling**: Controllers return generic 500 errors; consider improving error specificity
6. **Session Type Safety**: User is cast as `req.user as User` in controller methods
7. **MVC Pattern**: Always separate concerns - routes define endpoints, controllers handle logic, models define data
8. **TypeORM Column Types**: Always specify explicit column types (e.g., `@Column('varchar')`) instead of relying on `emitDecoratorMetadata` for better tsx compatibility

## API Documentation

**Interactive Documentation**: Available at `http://localhost:8000/docs`

The API documentation is powered by Scalar (alternative to Swagger UI) and provides:
- Interactive request testing
- Complete endpoint descriptions
- Request/response examples
- Schema definitions
- Authentication testing

**OpenAPI Specification**: Located at `openapi.json` in the project root

## API Endpoints

**Authentication** (prefix: `/auth`):
- POST `/auth/login` - Authenticate user (requires email, password) → `UserController.login`
- POST `/auth/register` - Create new user (requires name, email, password) → `UserController.register`

**Time Logging** (prefix: `/timelog`, all require authentication):
- POST `/timelog/checkin` - Check in to start a work session → `TimeLogController.checkIn`
- POST `/timelog/checkout` - Check out from current session → `TimeLogController.checkOut`
- GET `/timelog` - Get all time logs for authenticated user → `TimeLogController.getTimeLogs`

**Documentation**:
- GET `/docs` - Interactive API documentation (Scalar UI)

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
```
