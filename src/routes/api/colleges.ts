import { createFileRoute } from "@tanstack/react-router";
import { sql } from "~/db";

/**
 * GET /api/colleges
 *
 * Returns all colleges with optional filter query params:
 *   ?division=NCAA_D1          — filter by division
 *   ?region=Midwest            — filter by region
 *   ?min_swim_level=3          — minimum swim level (1-5)
 *   ?min_academic=4            — minimum academic rating (1-5)
 *   ?scholarships=true         — filter for schools with scholarships
 *   ?search=Texas              — text search on name
 *
 * Returns JSON array of college records.
 */
export const Route = createFileRoute("/api/colleges")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const division = url.searchParams.get("division");
          const region = url.searchParams.get("region");
          const minSwimLevel = url.searchParams.get("min_swim_level");
          const minAcademic = url.searchParams.get("min_academic");
          const scholarships = url.searchParams.get("scholarships");
          const search = url.searchParams.get("search");

          // Build a dynamic query with $1, $2, ... placeholders
          const conditions: string[] = [];
          const params: unknown[] = [];

          if (division) {
            params.push(division);
            conditions.push(`division = $${params.length}`);
          }
          if (region) {
            params.push(region);
            conditions.push(`region = $${params.length}`);
          }
          if (minSwimLevel) {
            params.push(Number(minSwimLevel));
            conditions.push(`swim_level >= $${params.length}`);
          }
          if (minAcademic) {
            params.push(Number(minAcademic));
            conditions.push(`academic_rating >= $${params.length}`);
          }
          if (scholarships === "true") {
            conditions.push("has_scholarships = true");
          } else if (scholarships === "false") {
            conditions.push("has_scholarships = false");
          }
          if (search) {
            params.push(`%${search}%`);
            conditions.push(`name ILIKE $${params.length}`);
          }

          const whereClause =
            conditions.length > 0
              ? "WHERE " + conditions.join(" AND ")
              : "";

          const db = sql();
          const rows = await db.query(
            `SELECT id, name, division, city, state, region, team_size, academic_rating, swim_level, has_scholarships, tuition_range, description, website_url, contact_email FROM colleges ${whereClause} ORDER BY name ASC`,
            params,
          );
          return Response.json({ colleges: rows });
        } catch (err) {
          console.error("Error fetching colleges:", err);
          return Response.json(
            { error: "Failed to fetch colleges" },
            { status: 500 },
          );
        }
      },
    },
  },
});