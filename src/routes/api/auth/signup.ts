import { createFileRoute } from "@tanstack/react-router";
import { sql } from "~/db";
import bcrypt from "bcrypt";
import { createSession } from "~/lib/auth";

/**
 * POST /api/auth/signup — Create a new account
 */
export const Route = createFileRoute("/api/auth/signup")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body: Record<string, unknown> = await request.json();

          const email = (body.email as string)?.trim().toLowerCase();
          const password = body.password as string;
          const name = (body.name as string)?.trim();
          const graduationYear = body.graduation_year as number;
          const gender = body.gender as string;

          if (!email || !password || !name) {
            return Response.json(
              { error: "Email, password, and name are required" },
              { status: 400 },
            );
          }
          if (password.length < 6) {
            return Response.json(
              { error: "Password must be at least 6 characters" },
              { status: 400 },
            );
          }

          const db = sql();

          const existing = await db.query(
            `SELECT id FROM swimmers WHERE email = $1`,
            [email],
          );
          if (existing.length > 0) {
            return Response.json(
              { error: "An account with this email already exists" },
              { status: 409 },
            );
          }

          const passwordHash = await bcrypt.hash(password, 10);

          const result = await db.query(
            `INSERT INTO swimmers (email, password_hash, name, graduation_year, gender) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [email, passwordHash, name, graduationYear || null, gender || null],
          );
          const swimmerId = (result[0] as { id: string }).id;

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
        } catch (err) {
          console.error("Signup error:", err);
          return Response.json({ error: "Signup failed" }, { status: 500 });
        }
      },
    },
  },
});