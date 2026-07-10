import { createFileRoute } from "@tanstack/react-router";
import { sql } from "~/db";

/**
 * PUT /api/swimmers/profile
 *
 * Creates or updates a swimmer's preferences for matching.
 * Expects JSON body:
 * {
 *   swimmer_id?: string,       // omit to create new, include to update
 *   name: string,
 *   email: string,
 *   graduation_year: number,
 *   gender: string,
 *   preferred_regions: string[],
 *   academic_priority: number,
 *   swim_level_priority: number,
 *   location_priority: number,
 *   scholarship_needed: boolean,
 *   preferred_divisions: string[],
 *   min_team_size: number,
 *   max_team_size: number
 * }
 *
 * Returns { swimmer_id, preference_id }
 */
export const Route = createFileRoute("/api/swimmers/profile")({
  server: {
    handlers: {
      PUT: async ({ request }) => {
        try {
          const body: Record<string, unknown> = await request.json();

          const db = sql();

          // Upsert swimmer
          let swimmerId = body.swimmer_id as string | undefined;

          if (swimmerId) {
            // Update existing swimmer
            await db.query(
              `UPDATE swimmers SET name = $1, email = $2, graduation_year = $3, gender = $4 WHERE id = $5`,
              [
                body.name as string,
                body.email as string,
                body.graduation_year as number,
                body.gender as string,
                swimmerId,
              ],
            );
          } else {
            // For now, assume the caller provides email; use a placeholder
            // password hash since auth is out of scope for this version
            const result = await db.query(
              `INSERT INTO swimmers (email, password_hash, name, graduation_year, gender) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
              [
                body.email as string,
                "PLACEHOLDER_HASH",
                body.name as string,
                body.graduation_year as number,
                body.gender as string,
              ],
            );
            swimmerId = (result[0] as { id: string }).id;
          }

          // Upsert preferences (one per swimmer)
          await db.query(
            `DELETE FROM preferences WHERE swimmer_id = $1`,
            [swimmerId],
          );
          const prefResult = await db.query(
            `INSERT INTO preferences (swimmer_id, preferred_regions, academic_priority, swim_level_priority, location_priority, scholarship_needed, preferred_divisions, min_team_size, max_team_size) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
            [
              swimmerId,
              (body.preferred_regions as string[]) || [],
              (body.academic_priority as number) ?? 3,
              (body.swim_level_priority as number) ?? 3,
              (body.location_priority as number) ?? 3,
              (body.scholarship_needed as boolean) ?? false,
              (body.preferred_divisions as string[]) || [],
              (body.min_team_size as number) ?? 10,
              (body.max_team_size as number) ?? 100,
            ],
          );

          return Response.json({
            swimmer_id: swimmerId,
            preference_id: (prefResult[0] as { id: string }).id,
          });
        } catch (err) {
          console.error("Error saving swimmer profile:", err);
          return Response.json(
            { error: "Failed to save profile" },
            { status: 500 },
          );
        }
      },
    },
  },
});