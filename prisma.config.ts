import 'dotenv/config';
import { defineConfig } from 'prisma/config';

/**
 * Prisma 7 reads connection details from here rather than from the schema.
 *
 * Migrations run against DIRECT_URL — Neon's unpooled endpoint — because
 * Prisma Migrate takes advisory locks that a connection pooler will not hold
 * across statements. The app itself queries through the pooled DATABASE_URL
 * via the adapter in src/lib/prisma.ts.
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? '',
  },
});
