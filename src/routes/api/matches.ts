import { createFileRoute } from "@tanstack/react-router";
import { sql } from "~/db";

/**
 * GET /api/matches?swimmer_id=X
 *
 * Returns match results for a given swimmer, combining the match_score
 * with the full college details. Colleges are ranked by match_score descending.
 *
 * If no matches exist yet for this swimmer, runs the matching algorithm
 * on the fly based on the swimmer's preferences, stores the results,
 * and returns them.
 */
export const Route = createFileRoute("/api/matches")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const swimmerId = url.searchParams.get("swimmer_id");

          if (!swimmerId) {
            return Response.json(
              { error: "swimmer_id query parameter is required" },
              { status: 400 },
            );
          }

          const db = sql();

          // Check if swimmer exists
          const swimmerRows = await db.query(
            `SELECT id FROM swimmers WHERE id = $1`,
            [swimmerId],
          );
          if (swimmerRows.length === 0) {
            return Response.json(
              { error: "Swimmer not found" },
              { status: 404 },
            );
          }

          // Check if matches already exist
          const existingMatches = await db.query(
            `SELECT COUNT(*) AS cnt FROM matches WHERE swimmer_id = $1`,
            [swimmerId],
          );
          const count = Number((existingMatches[0] as { cnt: string }).cnt);

          if (count === 0) {
            // Run the matching algorithm
            await computeAndStoreMatches(db, swimmerId);
          }

          // Fetch and return matches with college details
          const matches = await db.query(
            `SELECT
               m.id AS match_id,
               m.match_score,
               c.id AS college_id,
               c.name,
               c.division,
               c.city,
               c.state,
               c.region,
               c.team_size,
               c.academic_rating,
               c.swim_level,
               c.has_scholarships,
               c.tuition_range,
               c.description,
               c.website_url,
               c.contact_email
             FROM matches m
             JOIN colleges c ON c.id = m.college_id
             WHERE m.swimmer_id = $1
             ORDER BY m.match_score DESC`,
            [swimmerId],
          );

          return Response.json({
            swimmer_id: swimmerId,
            matches,
          });
        } catch (err) {
          console.error("Error fetching matches:", err);
          return Response.json(
            { error: "Failed to fetch matches" },
            { status: 500 },
          );
        }
      },
    },
  },
});

/**
 * Computes match scores for a swimmer against all colleges and stores them.
 *
 * The algorithm scores on four dimensions (each 0-25 points for 100 total):
 * - Division fit (25 pts): exact division match = 25, same broad level = 15, else 5
 * - Region fit (25 pts): region match = 25, else scaled by distance tiers
 * - Academic fit (25 pts): inversely weighted by priority; college rating × 5
 * - Swim level fit (25 pts): inversely weighted by priority; proximity to college level × 5
 * - Scholarship bonus: +10 if scholarship_needed matches has_scholarships
 * - Team size fit: penalty if outside preferred range
 */
async function computeAndStoreMatches(
  db: ReturnType<typeof sql>,
  swimmerId: string,
) {
  // Fetch swimmer preferences
  const prefRows = await db.query(
    `SELECT
       preferred_regions,
       academic_priority,
       swim_level_priority,
       location_priority,
       scholarship_needed,
       preferred_divisions,
       min_team_size,
       max_team_size
     FROM preferences WHERE swimmer_id = $1`,
    [swimmerId],
  );

  if (prefRows.length === 0) {
    // No preferences set, match all colleges with a neutral score
    await db.query(
      `INSERT INTO matches (swimmer_id, college_id, match_score)
       SELECT $1, id, 50.0 FROM colleges`,
      [swimmerId],
    );
    return;
  }

  const prefs = prefRows[0] as {
    preferred_regions: string[];
    academic_priority: number;
    swim_level_priority: number;
    location_priority: number;
    scholarship_needed: boolean;
    preferred_divisions: string[];
    min_team_size: number;
    max_team_size: number;
  };

  // Fetch all colleges
  const allColleges = await db.query(`SELECT * FROM colleges`);

  // Calculate scores
  const acadWeight = prefs.academic_priority; // 1-5
  const swimWeight = prefs.swim_level_priority;
  const locWeight = prefs.location_priority;

  // Normalize weights so they sum to useful proportions
  const totalWeight = acadWeight + swimWeight + locWeight || 1;

  const scores: Array<{ college_id: string; score: number }> = [];

  for (const college of allColleges) {
    const c = college as {
      id: string;
      division: string;
      region: string;
      academic_rating: number;
      swim_level: number;
      has_scholarships: boolean;
      team_size: number;
    };
    let score = 0;

    // 1. Division fit (max 15 pts)
    if (prefs.preferred_divisions.length > 0) {
      if (prefs.preferred_divisions.includes(c.division)) {
        score += 15;
      }
    } else {
      score += 10; // neutral if no preference
    }

    // 2. Region fit (max 15 pts) weighted by location_priority
    if (prefs.preferred_regions.length > 0) {
      if (prefs.preferred_regions.includes(c.region)) {
        score += 15 * (locWeight / 5);
      }
    } else {
      score += 7; // neutral
    }

    // 3. Academic fit (max 25 pts) weighted by academic_priority
    const acadScore = (c.academic_rating / 5) * 25 * (acadWeight / 5);
    score += acadScore;

    // 4. Swim level fit (max 25 pts) weighted by swim_level_priority
    const swimScore = (c.swim_level / 5) * 25 * (swimWeight / 5);
    score += swimScore;

    // 5. Scholarship bonus (max 10 pts)
    if (prefs.scholarship_needed && c.has_scholarships) {
      score += 10;
    } else if (!prefs.scholarship_needed) {
      score += 5; // neutral
    }

    // 6. Team size fit (max 10 pts)
    if (c.team_size >= prefs.min_team_size && c.team_size <= prefs.max_team_size) {
      score += 10;
    } else {
      // Partial credit based on proximity
      const mid = (prefs.min_team_size + prefs.max_team_size) / 2;
      const dist = Math.abs(c.team_size - mid);
      const range = (prefs.max_team_size - prefs.min_team_size) || 1;
      const proximity = Math.max(0, 1 - dist / (range * 2));
      score += proximity * 5;
    }

    // Clamp to 0-100
    scores.push({ college_id: c.id, score: Math.min(100, Math.max(0, score)) });
  }

  // Delete any stale matches
  await db.query(`DELETE FROM matches WHERE swimmer_id = $1`, [swimmerId]);

  // Batch insert scores
  const insertPromises = scores.map((s) =>
    db.query(
      `INSERT INTO matches (swimmer_id, college_id, match_score) VALUES ($1, $2, $3)`,
      [swimmerId, s.college_id, s.score],
    ),
  );
  await Promise.all(insertPromises);
}