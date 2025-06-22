import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import path from 'node:path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as schema from '@/models/Schema';
import { Env } from './Env';

// Stores the db connection in the global scope to prevent multiple instances due to hot reloading with Next.js
const globalForDb = globalThis as unknown as {
  drizzle: NodePgDatabase<typeof schema>;
};

const createDbConnection = () => {
  return drizzle({
    connection: {
      connectionString: Env.DATABASE_URL,
      ssl: !Env.DATABASE_URL.includes('localhost') && !Env.DATABASE_URL.includes('127.0.0.1'),
    },
    schema,
  });
};

const db = globalForDb.drizzle || createDbConnection();

// Only store in global during development to prevent hot reload issues
if (Env.NODE_ENV !== 'production') {
  globalForDb.drizzle = db;
}

try {
  // Check if waitlist table exists first
  const tableExists = await db.execute(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'waitlist'
  `);

  if (tableExists.rows.length === 0) {
    // Create waitlist table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "waitlist" (
        "id" serial PRIMARY KEY NOT NULL,
        "email" varchar(255) NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "waitlist_email_unique" UNIQUE("email")
      );
    `);
  }

  // Run migrations carefully
  await migrate(db, {
    migrationsFolder: path.join(process.cwd(), 'migrations'),
  });
} catch (error) {
  // Migration might fail if tables already exist, which is ok for development
  if (Env.NODE_ENV === 'development' && error instanceof Error && error.message.includes('already exists')) {
    console.log('Tables already exist, skipping migration');
  } else {
    console.error('Migration error:', error instanceof Error ? error.message : 'Unknown error');
    // Don't throw in development to allow the app to continue running
    if (Env.NODE_ENV !== 'development') {
      throw error;
    }
  }
}

export { db };
