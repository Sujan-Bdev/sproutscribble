import * as dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenv.config({
    path: '.env.local',
    });
console.log(process.env.POSTGRES_URL)
export default {
  schema: './server/schema.ts',
  out: './server/migrations',
  //   driver: 'pg',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
} satisfies Config;
