# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
- `npm run dev` - Start development server with local database (PGlite)
- `npm run dev:next` - Next.js dev server with Turbopack
- `npm run dev:spotlight` - Sentry Spotlight for local debugging

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
- `npm run test:e2e` - Run E2E tests with Playwright (run `npx playwright install` first time)
- `npm run storybook` - Start Storybook for component development
- `npm run storybook:test` - Run Storybook tests

### Database
- `npm run db:generate` - Generate Drizzle migrations after schema changes
- `npm run db:migrate` - Run migrations in production
- `npm run db:studio` - Open Drizzle Studio GUI for database exploration

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 15.3.4 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS 4.1.10
- **Authentication**: Clerk (complete auth solution)
- **Database**: Drizzle ORM with PostgreSQL (PGlite for local dev)
- **Forms**: React Hook Form with Zod validation
- **Internationalization**: next-intl with Crowdin
- **Monitoring**: Sentry (errors), PostHog (analytics), Checkly (uptime), Better Stack (logging)
- **Security**: Arcjet (bot protection, rate limiting)

### Project Structure
- `/src/app/[locale]` - Next.js App Router with i18n support
  - `(auth)` - Authentication pages (sign-in, sign-up, etc.)
  - `(marketing)` - Public marketing pages
- `/src/components` - Reusable React components
- `/src/libs` - Third-party library configurations (Arcjet, DB, i18n, Logger)
- `/src/models` - Database schemas using Drizzle ORM
- `/src/validations` - Zod validation schemas
- `/src/templates` - Template components with tests and stories
- `/src/utils` - Utilities and app configuration (AppConfig.ts)
- `/tests` - Test suites (e2e with Playwright, integration tests)
- `/migrations` - Database migration files

### Key Configuration Files
- `src/utils/AppConfig.ts` - Main app configuration
- `src/models/Schema.ts` - Database schema definitions
- `src/libs/DB.ts` - Database connection setup
- `src/libs/i18n.ts` - Internationalization configuration
- `src/libs/Arcjet.ts` - Security and bot protection setup

### Environment Variables
Required for production:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk authentication
- `CLERK_SECRET_KEY` - Clerk authentication
- `ARCJET_KEY` - Arcjet security
- `LOGTAIL_SOURCE_TOKEN` - Better Stack logging
- `SENTRY_DSN` - Error monitoring (update in sentry.*.config.ts files)

### Development Workflow
1. Schema changes: Edit `src/models/Schema.ts`, then run `npm run db:generate`
2. Component development: Use Storybook (`npm run storybook`)
3. Testing: Write tests alongside source files, use Vitest for unit tests
4. Commits: Use `npm run commit` for interactive commit following Conventional Commits
5. Code style: ESLint auto-fixes on save with proper VSCode setup
6. Type checking: Run `npm run check-types` before committing

### Important Notes
- Local development uses PGlite (embedded PostgreSQL), no external database needed
- Database migrations run automatically during build process
- Pre-commit hooks via Lefthook ensure code quality
- All authentication flows are handled by Clerk
- Arcjet provides bot detection and rate limiting by default
- Sentry Spotlight enables local error monitoring in development
