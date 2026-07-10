import { createFileRoute } from "@tanstack/react-router";
import { sql } from "~/db";
import bcrypt from "bcrypt";
import { createSession, verifySession, deleteSession, extractBearerToken } from "~/lib/auth";

/**
 * POST /api/auth/signup — Create a new account
 * Body: { email, password, name, graduation_year, gender }
 * Returns: { swimmer_id, token }
 */
async function handleSignup(request: Request) {
  const body: Record<string, unknown> = await request.json();

  const email = (body.email as string)?.trim().toLowerCase();
  const password = body.password as string;
  const name = (body.name as string)?.trim();
  const graduationYear = body.graduation_year as number;
  const gender = body.gender as string;

  // Validation
  if (!email || !password || !name) {
    return Response.json({ error: "Email, password, and name are required" }, { status: 400 });
  }
  if (password.length < 6) {
    return Response.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const db = sql();

  // Check for existing user
  const existing = await db.query(`SELECT id FROM swimmers WHERE email = $1`, [email]);
  if (existing.length > 0) {
    return Response.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create swimmer
  const result = await db.query(
    `INSERT INTO swimmers (email, password_hash, name, graduation_year, gender) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [email, passwordHash, name, graduationYear || null, gender || null],
  );
  const swimmerId = (result[0] as { id: string }).id;

  // Create session
  const { token, expiresAt } = await createSession(swimmerId);

  const response = Response.json({
    swimmer_id: swimmerId,
    token,
    expires_at: expiresAt.toISOString(),
  });
  response.headers.append(
    "Set-Cookie",
    `swimfit_token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`,
  );
  return response;
}

/**
 * POST /api/auth/login — Authenticate and get session token
 * Body: { email, password }
 * Returns: { swimmer_id, token }
 */
async function handleLogin(request: Request) {
  const body: Record<string, unknown> = await request.json();

  const email = (body.email as string)?.trim().toLowerCase();
  const password = body.password as string;

  if (!email || !password) {
    return Response.json({ error: "Email and password are required" }, { status: 400 });
  }

  const db = sql();

  const rows = await db.query(
    `SELECT id, password_hash, name FROM swimmers WHERE email = $1`,
    [email],
  );

  if (rows.length === 0) {
    return Response.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const swimmer = rows[0] as { id: string; password_hash: string; name: string };

  const valid = await bcrypt.compare(password, swimmer.password_hash);
  if (!valid) {
    return Response.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const { token, expiresAt } = await createSession(swimmer.id);

  const response = Response.json({
    swimmer_id: swimmer.id,
    name: swimmer.name,
    token,
    expires_at: expiresAt.toISOString(),
  });
  response.headers.append(
    "Set-Cookie",
    `swimfit_token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`,
  );
  return response;
}

/**
 * GET /api/auth/me — Get current user from Authorization header or cookie
 * Headers: Authorization: Bearer <token>
 * Returns: { swimmer: { id, email, name, graduation_year, gender, tier, created_at } }
 */
async function handleMe(request: Request) {
  // Try Authorization header first, then cookie
  let token = extractBearerToken(request);
  if (!token) {
    const cookieHeader = request.headers.get("Cookie") || "";
    const match = cookieHeader.match(/swimfit_token=([^;]+)/);
    if (match) token = match[1];
  }

  const swimmerId = await verifySession(token);
  if (!swimmerId) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const db = sql();
  const rows = await db.query(
    `SELECT id, email, name, graduation_year, gender, tier, created_at FROM swimmers WHERE id = $1`,
    [swimmerId],
  );

  if (rows.length === 0) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const swimmer = rows[0] as Record<string, unknown>;
  return Response.json({
    swimmer: {
      ...swimmer,
      created_at: String(swimmer.created_at),
    },
  });
}

/**
 * POST /api/auth/logout — Delete current session
 * Headers: Authorization: Bearer <token>
 */
async function handleLogout(request: Request) {
  let token = extractBearerToken(request);
  if (!token) {
    const cookieHeader = request.headers.get("Cookie") || "";
    const match = cookieHeader.match(/swimfit_token=([^;]+)/);
    if (match) token = match[1];
  }

  if (token) {
    await deleteSession(token);
  }

  const response = Response.json({ ok: true });
  response.headers.append(
    "Set-Cookie",
    "swimfit_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax",
  );
  return response;
}

// Single file with multiple auth handlers
export const Route = createFileRoute("/api/auth")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        // Route internally based on a ?action= param, or we can use pathname
        // Since this is a single route file, we check the path
        // Actually, since this handles /api/auth, we can use a different approach:
        // The request URL will have the full path. Let's use next() and dispatch.
        
        // We'll look at the URL path to determine the action
        // But since this file handles /api/auth, all requests come here.
        // We'll check for a simple pattern: the body or we can split into separate route files.
        
        // Better approach: check if the URL contains "signup" or "login" or "logout"
        // Actually, the cleaner approach is separate files. Let me just redirect based on
        // the request URL path, since this route handles /api/auth but the actual endpoints
        // are at /api/auth/signup, /api/auth/login, /api/auth/me, /api/auth/logout.
        // With TanStack Start, separate files under api/auth/ would work better.
        
        // For now, let's route by checking the request URL path directly
        const path = new URL(request.url).pathname;
        
        if (path.endsWith("/signup")) {
          return handleSignup(request);
        } else if (path.endsWith("/login")) {
          return handleLogin(request);
        } else if (path.endsWith("/logout")) {
          return handleLogout(request);
        }
        
        return Response.json({ error: "Not found" }, { status: 404 });
      },
      GET: async ({ request }) => {
        const path = new URL(request.url).pathname;
        if (path.endsWith("/me")) {
          return handleMe(request);
        }
        return Response.json({ error: "Not found" }, { status: 404 });
      },
    },
  },
});