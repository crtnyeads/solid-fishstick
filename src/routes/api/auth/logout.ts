import { createFileRoute } from "@tanstack/react-router";
import { deleteSession, extractBearerToken } from "~/lib/auth";

/**
 * POST /api/auth/logout — Delete current session
 */
export const Route = createFileRoute("/api/auth/logout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
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
        } catch (err) {
          console.error("Logout error:", err);
          return Response.json({ error: "Logout failed" }, { status: 500 });
        }
      },
    },
  },
});