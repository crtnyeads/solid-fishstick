import { createFileRoute } from "@tanstack/react-router";
import { sql } from "~/db";
import { verifySession, extractBearerToken } from "~/lib/auth";

/**
 * GET /api/auth/me — Get current user from session token
 */
export const Route = createFileRoute("/api/auth/me")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          // Try Authorization header first, then cookie
          let token = extractBearerToken(request);
          if (!token) {
            const cookieHeader = request.headers.get("Cookie") || "";
            const match = cookieHeader.match(/swimfit_token=([^;]+)/);
            if (match) token = match[1];
          }

          const swimmerId = await verifySession(token);
          if (!swimmerId) {
            return Response.json(
              { error: "Not authenticated" },
              { status: 401 },
            );
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
        } catch (err) {
          console.error("Auth me error:", err);
          return Response.json({ error: "Auth check failed" }, { status: 500 });
        }
      },
    },
  },
});