import { sql } from "~/db";
import crypto from "node:crypto";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Creates a session for a swimmer. Generates a random token, stores a SHA-256
 * hash in the DB, and returns the raw token (to send to the client).
 */
export async function createSession(
  swimmerId: string,
): Promise<{ token: string; expiresAt: Date }> {
  const token = crypto.randomUUID();
  const hash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  const db = sql();
  await db.query(
    `INSERT INTO sessions (swimmer_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
    [swimmerId, hash, expiresAt.toISOString()],
  );

  return { token, expiresAt };
}

/**
 * Verifies a session token. Returns the swimmer_id if valid, null otherwise.
 * Also cleans up expired sessions.
 */
export async function verifySession(
  token: string | null,
): Promise<string | null> {
  if (!token) return null;

  const hash = hashToken(token);
  const db = sql();

  // Clean expired sessions periodically
  await db.query(`DELETE FROM sessions WHERE expires_at < NOW()`);

  const rows = await db.query(
    `SELECT swimmer_id FROM sessions WHERE token_hash = $1 AND expires_at > NOW()`,
    [hash],
  );

  if (rows.length === 0) return null;
  return (rows[0] as { swimmer_id: string }).swimmer_id;
}

/**
 * Deletes a session (logout).
 */
export async function deleteSession(token: string): Promise<void> {
  const hash = hashToken(token);
  const db = sql();
  await db.query(`DELETE FROM sessions WHERE token_hash = $1`, [hash]);
}

/**
 * Extracts the bearer token from an Authorization header.
 */
export function extractBearerToken(
  request: Request,
): string | null {
  const auth = request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  return auth.slice(7);
}

/**
 * SHA-256 hash of a token string.
 */
function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}