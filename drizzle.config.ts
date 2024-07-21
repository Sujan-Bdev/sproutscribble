import * as dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';
import { defineConfig } from 'drizzle-kit';

dotenv.config({
  path: '.env.local',
});

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/schema.ts',
  out: './server/migrations',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
