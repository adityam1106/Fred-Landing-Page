import "dotenv/config";
import { Prisma } from "@prisma/client";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { prisma } from "./prisma.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const fallbackDir = path.resolve(projectRoot, ".data");
const fallbackPath = path.resolve(fallbackDir, "waitlist-local.json");

type WaitlistEntryRecord = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

function canUseLocalFallback() {
  return !process.env.VERCEL && process.env.NODE_ENV !== "production";
}

let schemaReadyPromise: Promise<void> | null = null;

async function ensureDatabaseSchema() {
  if (schemaReadyPromise) {
    return schemaReadyPromise;
  }

  schemaReadyPromise = (async () => {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "WaitlistEntry" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "WaitlistEntry_createdAt_idx"
      ON "WaitlistEntry" ("createdAt");
    `);
  })();

  try {
    await schemaReadyPromise;
  } catch (error) {
    schemaReadyPromise = null;
    throw error;
  }
}

async function ensureFallbackFile() {
  await fs.mkdir(fallbackDir, { recursive: true });

  try {
    await fs.access(fallbackPath);
  } catch {
    await fs.writeFile(fallbackPath, "[]", "utf8");
  }
}

async function readFallbackEntries() {
  await ensureFallbackFile();
  const raw = await fs.readFile(fallbackPath, "utf8");
  const parsed = JSON.parse(raw) as WaitlistEntryRecord[];
  return Array.isArray(parsed) ? parsed : [];
}

async function writeFallbackEntries(entries: WaitlistEntryRecord[]) {
  await ensureFallbackFile();
  await fs.writeFile(fallbackPath, JSON.stringify(entries, null, 2), "utf8");
}

export async function createWaitlistEntry({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  if (hasDatabaseUrl()) {
    await ensureDatabaseSchema();

    return prisma.waitlistEntry.create({
      data: {
        name,
        email,
      },
    });
  }

  if (!canUseLocalFallback()) {
    throw new Error("DATABASE_URL is required in production.");
  }

  const entries = await readFallbackEntries();
  const duplicate = entries.some((entry) => entry.email === email);

  if (duplicate) {
    throw new Prisma.PrismaClientKnownRequestError("Duplicate email", {
      code: "P2002",
      clientVersion: "fallback",
    });
  }

  const createdAt = new Date().toISOString();
  const entry: WaitlistEntryRecord = {
    id: crypto.randomUUID(),
    name,
    email,
    createdAt,
  };

  entries.push(entry);
  await writeFallbackEntries(entries);
  return entry;
}
