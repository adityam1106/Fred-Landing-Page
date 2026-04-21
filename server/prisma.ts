import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const databaseUrl =
  process.env.DATABASE_URL ?? "postgresql://fred:fred_local_password@localhost:5433/fred_waitlist?schema=public";

declare global {
  // eslint-disable-next-line no-var
  var __fredPrisma__: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var __fredPool__: Pool | undefined;
}

const pool =
  globalThis.__fredPool__ ??
  new Pool({
    connectionString: databaseUrl,
  });

const adapter = new PrismaPg(pool);

export const prisma =
  globalThis.__fredPrisma__ ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__fredPrisma__ = prisma;
  globalThis.__fredPool__ = pool;
}
