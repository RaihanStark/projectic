# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
- `npm run dev` - Start development server with local database (PGlite)
- `npm run dev:next` - Next.js dev server with Turbopack

### Build & Production
- `npm run build` - Production build with in-memory database
- `npm run start` - Start production server

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Auto-fix linting issues
- `npm run check-types` - TypeScript type checking
- `npm run commit` - Interactive commit with Commitizen (follows Conventional Commits)

### Testing
- `npm run test` - Run unit tests with Vitest

### Database
- `npm run db:generate` - Generate Drizzle migrations after schema changes
- `npm run db:migrate` - Run migrations in production
- `npm run db:studio` - Open Drizzle Studio GUI for database exploration

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 15.3.4 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS 4.1.10
- **Authentication**: JWT-based authentication (custom implementation)
- **Database**: Drizzle ORM with PostgreSQL (PGlite for local dev)
- **Forms**: React Hook Form with Zod validation

### Project Structure
- `/src/app` - Next.js App Router
  - `(auth)` - Authentication pages (sign-in, sign-up, etc.)
  - `(marketing)` - Public marketing pages
- `/src/components` - Reusable React components
- `/src/libs` - Third-party library configurations (DB)
- `/src/models` - Database schemas using Drizzle ORM
- `/src/validations` - Zod validation schemas
- `/src/templates` - Template components with tests
- `/src/utils` - Utilities and app configuration (AppConfig.ts)
- `/tests` - Test suites (unit tests only)
- `/migrations` - Database migration files

### Key Configuration Files
- `src/utils/AppConfig.ts` - Main app configuration
- `src/models/Schema.ts` - Database schema definitions
- `src/libs/DB.ts` - Database connection setup
- `src/libs/Env.ts` - Environment variable validation

### Environment Variables
Required for production:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `NEXT_PUBLIC_APP_URL` - Application URL (optional)

### Development Workflow
1. Schema changes: Edit `src/models/Schema.ts`, then run `npm run db:generate`
2. Testing: Write tests alongside source files, use Vitest for unit tests
3. Commits: Use `npm run commit` for interactive commit following Conventional Commits
4. Code style: ESLint auto-fixes on save with proper VSCode setup
5. Type checking: Run `npm run check-types` before committing

### Important Notes
- Local development uses PGlite (embedded PostgreSQL), no external database needed
- Database migrations run automatically during build process
- Pre-commit hooks via Lefthook ensure code quality
- Simple JWT-based authentication for user sessions
- All task management features preserved: urgency levels, labels, status, deadlines
- Waitlist system maintained for pre-launch email collection

## Development Guidelines
- Prioritize use of Headless UI before custom build
