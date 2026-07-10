import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";

/* ───── Server function: fetch colleges from API ───── */
const fetchColleges = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const base = process.env.URL || `http://localhost:3000`;
    const res = await fetch(`${base}/api/colleges`);
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    const data = (await res.json()) as { colleges: ApiCollege[] };
    return data.colleges;
  } catch {
    // If API fails (e.g. no DB), return empty array
    return [];
  }
});

/* ───── Types ───── */
interface ApiCollege {
  id: string;
  name: string;
  division: string;
  city: string;
  state: string;
  region: string;
  team_size: number;
  academic_rating: number;
  swim_level: number;
  has_scholarships: boolean;
  tuition_range: string;
  description: string;
  website_url: string;
  contact_email: string;
}

interface CollegeDisplay {
  id: string;
  name: string;
  division: string;
  location: string;
  matchScore: number;
  swimRating: number;
  academicRating: number;
  scholarshipAvailable: boolean;
  teamSize: number;
  tuitionRange: string;
  description: string;
  websiteUrl: string;
  contactEmail: string;
}

/* ───── Helpers ───── */
const DIVISION_LABELS: Record<string, string> = {
  NCAA_D1: "NCAA D1",
  NCAA_D2: "NCAA D2",
  NCAA_D3: "NCAA D3",
  NAIA: "NAIA",
  IvyLeague: "Ivy League",
};

const DIVISIONS = ["All Divisions", "NCAA D1", "NCAA D2", "NCAA D3", "NAIA", "Ivy League"];
const REGIONS = ["All Regions", "Northeast", "Southeast", "Midwest", "Southwest", "West"];

function mapCollege(c: ApiCollege): CollegeDisplay {
  const matchScore = Math.round((c.swim_level * 15 + c.academic_rating * 10 + (c.has_scholarships ? 15 : 0)) * 1.3);
  const clampedScore = Math.min(Math.max(matchScore, 20), 98);

  return {
    id: c.id,
    name: c.name,
    division: DIVISION_LABELS[c.division] || c.division,
    location: `${c.city}, ${c.state}`,
    matchScore: clampedScore,
    swimRating: c.swim_level,
    academicRating: c.academic_rating,
    scholarshipAvailable: c.has_scholarships,
    teamSize: c.team_size,
    tuitionRange: c.tuition_range || "—",
    description: c.description || "",
    websiteUrl: c.website_url || "",
    contactEmail: c.contact_email || "",
  };
}

function scoreColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  if (score >= 40) return "bg-orange-500";
  return "bg-red-500";
}

function scoreTextColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  if (score >= 40) return "text-orange-600";
  return "text-red-600";
}

function scoreBgColor(score: number): string {
  if (score >= 80) return "bg-green-50 border-green-200";
  if (score >= 60) return "bg-yellow-50 border-yellow-200";
  if (score >= 40) return "bg-orange-50 border-orange-200";
  return "bg-red-50 border-red-200";
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i <= rating ? "text-yellow-400" : "text-slate-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

export const Route = createFileRoute("/matches")({
  loader: () => fetchColleges(),
  component: MatchesPage,
});

function MatchesPage() {
  const apiColleges = Route.useLoaderData();
  const colleges = apiColleges.map(mapCollege);

  const [filterDivision, setFilterDivision] = useState("All Divisions");
  const [filterRegion, setFilterRegion] = useState("All Regions");
  const [filterScholarship, setFilterScholarship] = useState(false);
  const [minScore, setMinScore] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const regionMap: Record<string, string> = {
    Northeast: "Northeast",
    Southeast: "Southeast",
    Midwest: "Midwest",
    Southwest: "Southwest",
    West: "West",
  };
  const reverseRegionMap: Record<string, string> = {
    Northeast: "Northeast",
    Southeast: "Southeast",
    Midwest: "Midwest",
    Southwest: "Southwest",
    West: "West",
  };

  const filtered = colleges.filter((c) => {
    if (filterDivision !== "All Divisions" && c.division !== filterDivision) return false;
    const stateRegion = Object.entries(regionMap).find(([, v]) =>
      c.location.includes(v)
    );
    if (filterRegion !== "All Regions") {
      if (reverseRegionMap[filterRegion] && !c.location.includes(reverseRegionMap[filterRegion]))
        return false;
    }
    if (filterScholarship && !c.scholarshipAvailable) return false;
    if (c.matchScore < minScore) return false;
    return true;
  }).sort((a, b) => b.matchScore - a.matchScore);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 5 ? [...prev, id] : prev
    );
  };

  const selectedColleges = colleges.filter((c) => selectedIds.includes(c.id));
  const topDivision = filtered.length > 0 ? filtered[0].division : "—";
  const topRegion = filtered.length > 0 ? filtered[0].location.split(", ")[1] || "—" : "—";

  if (colleges.length === 0) {
    return (
      <div className="min-h-dvh bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <a href="/" className="flex items-center gap-2">
              <svg className="h-7 w-7 text-swim-600" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="currentColor" />
                <path d="M8 20c2-3 5-5 8-5s6 2 8 5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M10 23c2-2 4-3 6-3s4 1 6 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M16 10v5m0-5l-2 2m2-2l2 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-lg font-bold text-swim-800">SwimFit</span>
            </a>
          </div>
        </header>
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
          <svg className="mb-4 h-16 w-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-slate-700">Connect a database to see matches</h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            The college database hasn't been connected yet. Once it's set up, your matches will appear here.
          </p>
          <a href="/profile" className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-swim-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-swim-500">
            Back to Profile
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2">
            <svg className="h-7 w-7 text-swim-600" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="currentColor" />
              <path d="M8 20c2-3 5-5 8-5s6 2 8 5" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M10 23c2-2 4-3 6-3s4 1 6 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M16 10v5m0-5l-2 2m2-2l2 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-lg font-bold text-swim-800">SwimFit</span>
          </a>
          <a href="/profile" className="text-sm font-medium text-slate-500 transition-colors hover:text-swim-600">
            &larr; Edit profile
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* ─── Premium upsell banner ─── */}
        <div className="mb-8 rounded-xl border border-swim-200 bg-gradient-to-r from-swim-50 to-teal-50 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <svg className="h-6 w-6 flex-shrink-0 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-swim-800">Unlock full profiles &amp; coach contact info</p>
                <p className="text-xs text-slate-500">Upgrade to see detailed program profiles, coach emails, and recruiting contacts.</p>
              </div>
            </div>
            <a
              href="/pricing"
              className="inline-flex items-center gap-1.5 rounded-full bg-swim-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-swim-500"
            >
              Upgrade Now
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>

        {/* ─── Header + Stats ─── */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-swim-800 sm:text-4xl">Your College Matches</h1>
          <p className="mt-2 text-slate-600">Ranked by how well each program fits your profile.</p>
          <div className="mt-5 flex flex-wrap gap-4">
            <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
              <p className="text-2xl font-bold text-swim-600">{filtered.length}</p>
              <p className="text-xs text-slate-500">Matches found</p>
            </div>
            <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
              <p className="text-lg font-semibold text-swim-600">{topDivision}</p>
              <p className="text-xs text-slate-500">Top division</p>
            </div>
            <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
              <p className="text-lg font-semibold text-swim-600">{topRegion}</p>
              <p className="text-xs text-slate-500">Top region</p>
            </div>
          </div>
        </div>

        {/* ─── Filter bar ─── */}
        <div className="mb-8 flex flex-wrap items-end gap-4 rounded-2xl bg-white p-5 shadow-sm">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">Division</label>
            <select
              value={filterDivision}
              onChange={(e) => setFilterDivision(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-swim-500 focus:outline-none focus:ring-2 focus:ring-swim-500/20"
            >
              {DIVISIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">Region</label>
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-swim-500 focus:outline-none focus:ring-2 focus:ring-swim-500/20"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 pb-1">
            <input
              type="checkbox"
              id="scholarshipFilter"
              checked={filterScholarship}
              onChange={(e) => setFilterScholarship(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-swim-600 focus:ring-swim-500"
            />
            <label htmlFor="scholarshipFilter" className="text-sm text-slate-700">
              Scholarship only
            </label>
          </div>
          <div className="min-w-[160px] flex-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-500">Min score: {minScore}%</label>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-swim-600"
              style={{ accentColor: "#1d4ed8" }}
            />
          </div>
          {selectedIds.length > 0 && (
            <button
              onClick={() => setShowCompare(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-swim-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-swim-500"
            >
              Compare Selected ({selectedIds.length})
            </button>
          )}
        </div>

        {/* ─── Empty state (filters) ─── */}
        {filtered.length === 0 && (
          <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl bg-white p-12 text-center shadow-sm">
            <svg className="mb-4 h-16 w-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-slate-700">No matches found</h3>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              Try adjusting your filters or updating your profile to include more preferences.
            </p>
            <a
              href="/profile"
              className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-swim-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-swim-500"
            >
              Edit Profile
            </a>
          </div>
        )}

        {/* ─── Match grid ─── */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((college) => {
            const selected = selectedIds.includes(college.id);
            return (
              <div
                key={college.id}
                className={`group relative rounded-2xl border-2 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${
                  selected ? "border-swim-500" : "border-transparent"
                }`}
              >
                {/* Compare checkbox */}
                <button
                  type="button"
                  onClick={() => toggleSelect(college.id)}
                  className={`absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-md border-2 text-xs font-bold transition-all ${
                    selected
                      ? "border-swim-600 bg-swim-600 text-white"
                      : "border-slate-300 bg-white text-transparent hover:border-swim-400"
                  }`}
                >
                  {selected ? selectedIds.indexOf(college.id) + 1 : ""}
                </button>

                {/* Division badge */}
                <span className="mb-3 inline-block rounded-full bg-swim-100 px-3 py-0.5 text-xs font-medium text-swim-700">
                  {college.division}
                </span>

                {/* College name + location */}
                <h3 className="text-lg font-bold text-swim-800">{college.name}</h3>
                <p className="text-sm text-slate-500">{college.location}</p>

                {/* Score bar */}
                <div className={`mt-4 rounded-xl border p-4 ${scoreBgColor(college.matchScore)}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">Match Score</span>
                    <span className={`text-2xl font-extrabold ${scoreTextColor(college.matchScore)}`}>
                      {college.matchScore}%
                    </span>
                  </div>
                  <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/70">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${scoreColor(college.matchScore)}`}
                      style={{ width: `${college.matchScore}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-xs text-slate-400">Swim Level</span>
                    <div className="mt-0.5"><Stars rating={college.swimRating} /></div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">Academics</span>
                    <div className="mt-0.5"><Stars rating={college.academicRating} /></div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400">Scholarship:</span>
                    {college.scholarshipAvailable ? (
                      <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">Team: {college.teamSize}</span>
                  </div>
                </div>

                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
                  {college.description}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs text-slate-400">{college.tuitionRange}</span>
                  <button
                    type="button"
                    className="rounded-lg bg-swim-50 px-4 py-1.5 text-sm font-medium text-swim-700 transition-all hover:bg-swim-100"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Compare Modal ─── */}
      {showCompare && selectedColleges.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-12">
          <div className="relative w-full max-w-5xl rounded-2xl bg-white p-8 shadow-2xl">
            <button
              onClick={() => setShowCompare(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all hover:bg-slate-200"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="mb-6 text-2xl font-bold text-swim-800">Compare Colleges</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pr-4 pb-3 text-left font-medium text-slate-500">Feature</th>
                    {selectedColleges.map((c) => (
                      <th key={c.id} className="px-3 pb-3 text-left font-semibold text-swim-800">{c.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { label: "Division", render: (c: CollegeDisplay) => c.division },
                    { label: "Location", render: (c: CollegeDisplay) => c.location },
                    {
                      label: "Match Score",
                      render: (c: CollegeDisplay) => (
                        <span className={`font-bold ${scoreTextColor(c.matchScore)}`}>{c.matchScore}%</span>
                      ),
                    },
                    { label: "Swim Level", render: (c: CollegeDisplay) => <Stars rating={c.swimRating} /> },
                    { label: "Academics", render: (c: CollegeDisplay) => <Stars rating={c.academicRating} /> },
                    {
                      label: "Scholarship",
                      render: (c: CollegeDisplay) =>
                        c.scholarshipAvailable ? (
                          <span className="font-medium text-green-600">Available</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        ),
                    },
                    { label: "Team Size", render: (c: CollegeDisplay) => c.teamSize.toString() },
                    { label: "Tuition", render: (c: CollegeDisplay) => c.tuitionRange },
                    {
                      label: "Description",
                      render: (c: CollegeDisplay) => (
                        <p className="max-w-[200px] text-xs leading-relaxed text-slate-600">{c.description}</p>
                      ),
                    },
                  ].map((row) => (
                    <tr key={row.label}>
                      <td className="pr-4 py-3 text-xs font-medium text-slate-500">{row.label}</td>
                      {selectedColleges.map((c) => (
                        <td key={c.id} className="px-3 py-3">
                          {row.render(c)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowCompare(false)}
                className="rounded-full border border-slate-200 px-6 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                className="rounded-full bg-swim-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-swim-500"
              >
                Request Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-400">
        &copy; {new Date().getFullYear()} SwimFit. All rights reserved.
      </footer>
    </div>
  );
}