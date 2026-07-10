import { neon } from "@neondatabase/serverless";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function getDatabaseUrl(): string {
  // Check env var first
  const fromEnv = process.env.DATABASE_URL;
  if (fromEnv && fromEnv.startsWith("postgresql://")) {
    return fromEnv;
  }

  // Fallback: read from .env file in the site root
  if (typeof process !== "undefined") {
    const envPath = resolve(process.cwd(), ".env");
    if (existsSync(envPath)) {
      const content = readFileSync(envPath, "utf8");
      const match = content.match(/^DATABASE_URL=(.+)$/m);
      if (match) {
        const fromFile = match[1].trim();
        if (fromFile.startsWith("postgresql://")) {
          return fromFile;
        }
      }
    }
  }

  throw new Error(
    "DATABASE_URL is not set to a valid connection string. " +
    "Connect a database (via the database card) before running queries.",
  );
}

/**
 * Server-only handle to the team's database (Neon serverless Postgres over HTTP).
 * Reads DATABASE_URL from the environment (or .env file as fallback).
 * Returns the neon() function that supports both tagged-template and .query()
 * calling conventions.
 */
export const sql = () => {
  const url = getDatabaseUrl();
  return neon(url);
};
