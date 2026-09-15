import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import { PrismaClient } from '@/generated/prisma';

/**
 * Neon's driver reaches the database over HTTPS/WebSocket on 443 rather than
 * the Postgres wire protocol on 5432. That is what Neon recommends for
 * serverless deployments, and it also works from networks that block 5432.
 *
 * Node has no global WebSocket before v22, and some runtimes still omit it, so
 * fall back to the `ws` package when it is missing.
 */
if (typeof globalThis.WebSocket === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

/**
 * A single PrismaClient for the process.
 *
 * Next.js hot-reloads modules in development, which would otherwise open a new
 * connection pool on every edit until Postgres refuses more. Stashing the
 * client on globalThis keeps one instance across reloads.
 *
 * Queries go through DATABASE_URL — Neon's pooled endpoint — so serverless
 * invocations share connections instead of each opening their own.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set — copy .env.example to .env and fill it in.');
  }

  return new PrismaClient({
    adapter: new PrismaNeon({ connectionString }),
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

/**
 * Created lazily, on first use, rather than at import.
 *
 * `next build` loads every route module to collect its data, and the Neon
 * integration only injects DATABASE_URL at runtime — so constructing the client
 * (which reads DATABASE_URL) at import time crashes the build with no database
 * present. This proxy defers `createClient()` until the first query, by which
 * point the runtime has the connection string; the real client is cached on
 * globalThis so hot reloads and serverless invocations reuse one instance.
 */
export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new Proxy({} as PrismaClient, {
    get(_target, prop) {
      const client = (globalForPrisma.prisma ??= createClient());
      const value = Reflect.get(client as object, prop);
      return typeof value === 'function' ? value.bind(client) : value;
    },
  });
