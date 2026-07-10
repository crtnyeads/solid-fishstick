import { createFileRoute } from "@tanstack/react-router";
import { sql } from "~/db";
import bcrypt from "bcrypt";
import { createSession } from "~/lib/auth";

/**
 * POST /api/auth/login — Authenticate and get session token
 */
export const Route = createFileRoute("/api/auth/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body: Record<string, unknown> = await request.json();

          const email = (body.email as string)?.trim().toLowerCase();
          const password = body.password as string;

          if (!email || !password) {
            return Response.json(
              { error: "Email and password are required" },
              { status: 400 },
            );
          }

          const db = sql();

          const rows = await db.query(
            `SELECT id, password_hash, name, tier FROM swimmers WHERE email = $1`,
            [email],
          );

          if (rows.length === 0) {
            return Response.json(
              { error: "Invalid email or password" },
              { status: 401 },
            );
          }

          const swimmer = rows[0] as {
            id: string;
            password_hash: string;
            name: string;
            tier: string;
          };

          const valid = await bcrypt.compare(password, swimmer.password_hash);
          if (!valid) {
            return Response.json(
              { error: "Invalid email or password" },
              { status: 401 },
            );
          }

          const { token, expiresAt } = await createSession(swimmer.id);

          const response = Response.json({
            swimmer_id: swimmer.id,
            name: swimmer.name,
            tier: swimmer.tier,
            token,
            expires_at: expiresAt.toISOString(),
          });
          response.headers.append(
            "Set-Cookie",
            `swimfit_token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`,
          );
          return response;
        } catch (err) {
          console.error("Login error:", err);
          return Response.json({ error: "Login failed" }, { status: 500 });
        }
      },
    },
  },
});