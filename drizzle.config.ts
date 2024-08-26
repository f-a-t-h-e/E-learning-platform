import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // schema: './src/modules/drizzle/schema/index.ts',
  schema: './src/modules/drizzle/schema.auto.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    // I'm using bun so it's working for me
    url: process.env.DATABASE_URL,
  },
});
