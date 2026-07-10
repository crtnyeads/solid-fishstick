import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

interface FormData {
  name: string;
  email: string;
  graduationYear: string;
  gender: string;
  primaryEvent: string;
  bestTimes: string;
  practiceHours: string;
  academicInterest: string[];
  preferredDivisions: string[];
  preferredRegions: string[];
  academicPriority: number;
  swimPriority: number;
  locationPriority: number;
  scholarshipNeeded: string;
  teamSizeMin: string;
  teamSizeMax: string;
}

const GRAD_YEARS = ["2025", "2026", "2027", "2028", "2029"];
const EVENTS = [
  "50 Free",
  "100 Free",
  "200 Free",
  "500 Free",
  "1000 Free",
  "1650 Free",
  "100 Back",
  "200 Back",
  "100 Breast",
  "200 Breast",
  "100 Fly",
  "200 Fly",
  "200 IM",
  "400 IM",
];
const ACADEMIC_AREAS = [
  "Engineering",
  "Business",
  "Pre-Med",
  "Arts",
  "Sciences",
  "Computer Science",
  "Communications",
  "Education",
  "Political Science",
  "Psychology",
  "Economics",
  "Undecided",
];
const DIVISIONS = [
  { value: "NCAA_D1", label: "NCAA Division I" },
  { value: "NCAA_D2", label: "NCAA Division II" },
  { value: "NCAA_D3", label: "NCAA Division III" },
  { value: "NAIA", label: "NAIA" },
  { value: "IvyLeague", label: "Ivy League" },
];
const REGIONS = [
  "Northeast",
  "Southeast",
  "Midwest",
  "Southwest",
  "West",
];

function ProfilePage() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    graduationYear: "",
    gender: "",
    primaryEvent: "",
    bestTimes: "",
    practiceHours: "",
    academicInterest: [],
    preferredDivisions: [],
    preferredRegions: [],
    academicPriority: 3,
    swimPriority: 3,
    locationPriority: 3,
    scholarshipNeeded: "",
    teamSizeMin: "10",
    teamSizeMax: "100",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleMulti = (key: "academicInterest" | "preferredDivisions" | "preferredRegions", val: string) => {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter((v) => v !== val) : [...f[key], val],
    }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email format";
    if (!form.graduationYear) e.graduationYear = "Graduation year is required";
    if (!form.gender) e.gender = "Gender is required";
    if (!form.primaryEvent) e.primaryEvent = "Select a primary event";
    if (!form.bestTimes.trim()) e.bestTimes = "Enter your best times";
    if (!form.practiceHours.trim()) e.practiceHours = "Enter practice hours";
    if (form.academicInterest.length === 0) e.academicInterest = "Select at least one area";
    if (form.preferredDivisions.length === 0) e.preferredDivisions = "Select at least one division";
    if (form.preferredRegions.length === 0) e.preferredRegions = "Select at least one region";
    if (!form.scholarshipNeeded) e.scholarshipNeeded = "Select yes or no";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      // In production: send form data to API, then redirect
      window.location.href = "/matches";
    }, 1500);
  };

  const inputClass = (key: string) =>
    `w-full rounded-xl border ${errors[key] ? "border-red-400" : "border-slate-200"} bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition-all focus:border-swim-500 focus:outline-none focus:ring-2 focus:ring-swim-500/20`;

  return (
    <div className="min-h-dvh bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2">
            <svg className="h-7 w-7 text-swim-600" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="currentColor" />
              <path d="M8 20c2-3 5-5 8-5s6 2 8 5" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M10 23c2-2 4-3 6-3s4 1 6 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M16 10v5m0-5l-2 2m2-2l2 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-lg font-bold text-swim-800">SwimFit</span>
          </a>
          <a href="/" className="text-sm font-medium text-slate-500 transition-colors hover:text-swim-600">
            &larr; Back to home
          </a>
        </div>
      </header>

      {submitting ? (
        /* Loading state */
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-6">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-swim-200 border-t-swim-600" />
          <p className="mt-6 text-xl font-semibold text-swim-800">Finding your matches...</p>
          <p className="mt-2 text-sm text-slate-500">Analyzing your profile against 3,000+ programs</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mx-auto max-w-4xl px-6 py-12">
          <div className="mb-10 text-center">
            <span className="inline-block rounded-full bg-swim-100 px-4 py-1.5 text-sm font-medium text-swim-700">
              Create Your Profile
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-swim-800 sm:text-4xl">
              Tell us about yourself
            </h1>
            <p className="mt-3 text-slate-600">
              We'll match you with college programs that fit your swimming, academics, and priorities.
            </p>
          </div>

          <div className="space-y-10">
            {/* ───── Section 1: Personal Info ───── */}
            <section className="rounded-2xl bg-white p-8 shadow-sm shadow-slate-200/50">
              <h2 className="mb-6 text-lg font-semibold text-swim-800">Personal Information</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Johnson"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className={inputClass("name")}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="alex@example.com"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className={inputClass("email")}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Graduation Year <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.graduationYear}
                    onChange={(e) => update("graduationYear", e.target.value)}
                    className={inputClass("graduationYear")}
                  >
                    <option value="">Select year</option>
                    {GRAD_YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  {errors.graduationYear && <p className="mt-1 text-xs text-red-500">{errors.graduationYear}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Gender <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.gender}
                    onChange={(e) => update("gender", e.target.value)}
                    className={inputClass("gender")}
                  >
                    <option value="">Select gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="NB">Non-binary</option>
                    <option value="O">Prefer not to say</option>
                  </select>
                  {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender}</p>}
                </div>
              </div>
            </section>

            {/* ───── Section 2: Swimming Info ───── */}
            <section className="rounded-2xl bg-white p-8 shadow-sm shadow-slate-200/50">
              <h2 className="mb-6 text-lg font-semibold text-swim-800">Swimming Information</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Primary Event <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.primaryEvent}
                    onChange={(e) => update("primaryEvent", e.target.value)}
                    className={inputClass("primaryEvent")}
                  >
                    <option value="">Select event</option>
                    {EVENTS.map((ev) => (
                      <option key={ev} value={ev}>{ev}</option>
                    ))}
                  </select>
                  {errors.primaryEvent && <p className="mt-1 text-xs text-red-500">{errors.primaryEvent}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Best Times <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 50 Free: 22.1, 100 Fly: 51.8"
                    value={form.bestTimes}
                    onChange={(e) => update("bestTimes", e.target.value)}
                    className={inputClass("bestTimes")}
                  />
                  {errors.bestTimes && <p className="mt-1 text-xs text-red-500">{errors.bestTimes}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Practice Commitment <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.practiceHours}
                    onChange={(e) => update("practiceHours", e.target.value)}
                    className={inputClass("practiceHours")}
                  >
                    <option value="">Hours per week</option>
                    <option value="<5">Less than 5 hrs/week</option>
                    <option value="5-10">5-10 hrs/week</option>
                    <option value="10-15">10-15 hrs/week</option>
                    <option value="15-20">15-20 hrs/week</option>
                    <option value="20+">20+ hrs/week</option>
                  </select>
                  {errors.practiceHours && <p className="mt-1 text-xs text-red-500">{errors.practiceHours}</p>}
                </div>
              </div>
            </section>

            {/* ───── Section 3: Academic Preferences ───── */}
            <section className="rounded-2xl bg-white p-8 shadow-sm shadow-slate-200/50">
              <h2 className="mb-6 text-lg font-semibold text-swim-800">Academic Preferences</h2>
              <div className="mb-6">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Academic Priority
                </label>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-400">Less important</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={form.academicPriority}
                    onChange={(e) => update("academicPriority", Number(e.target.value))}
                    className="h-2 w-full max-w-xs cursor-pointer appearance-none rounded-full bg-slate-200 accent-swim-600"
                    style={{ accentColor: "#1d4ed8" }}
                  />
                  <span className="text-xs text-slate-400">Very important</span>
                  <span className="ml-2 rounded-full bg-swim-100 px-3 py-0.5 text-xs font-semibold text-swim-700">
                    {form.academicPriority}
                  </span>
                </div>
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium text-slate-700">
                  Areas of Academic Interest <span className="text-red-400">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {ACADEMIC_AREAS.map((area) => {
                    const selected = form.academicInterest.includes(area);
                    return (
                      <button
                        key={area}
                        type="button"
                        onClick={() => toggleMulti("academicInterest", area)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                          selected
                            ? "bg-swim-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-swim-50 hover:text-swim-700"
                        }`}
                      >
                        {area}
                      </button>
                    );
                  })}
                </div>
                {errors.academicInterest && <p className="mt-1 text-xs text-red-500">{errors.academicInterest}</p>}
              </div>
            </section>

            {/* ───── Section 4: College Preferences ───── */}
            <section className="rounded-2xl bg-white p-8 shadow-sm shadow-slate-200/50">
              <h2 className="mb-6 text-lg font-semibold text-swim-800">College Preferences</h2>
              <div className="mb-6">
                <label className="mb-3 block text-sm font-medium text-slate-700">
                  Preferred Divisions <span className="text-red-400">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {DIVISIONS.map((div) => {
                    const selected = form.preferredDivisions.includes(div.value);
                    return (
                      <button
                        key={div.value}
                        type="button"
                        onClick={() => toggleMulti("preferredDivisions", div.value)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                          selected
                            ? "bg-swim-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-swim-50 hover:text-swim-700"
                        }`}
                      >
                        {div.label}
                      </button>
                    );
                  })}
                </div>
                {errors.preferredDivisions && <p className="mt-1 text-xs text-red-500">{errors.preferredDivisions}</p>}
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium text-slate-700">
                  Preferred Regions <span className="text-red-400">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {REGIONS.map((region) => {
                    const selected = form.preferredRegions.includes(region);
                    return (
                      <button
                        key={region}
                        type="button"
                        onClick={() => toggleMulti("preferredRegions", region)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                          selected
                            ? "bg-swim-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-swim-50 hover:text-swim-700"
                        }`}
                      >
                        {region}
                      </button>
                    );
                  })}
                </div>
                {errors.preferredRegions && <p className="mt-1 text-xs text-red-500">{errors.preferredRegions}</p>}
              </div>
            </section>

            {/* ───── Section 5: Priorities & Scholarship ───── */}
            <section className="rounded-2xl bg-white p-8 shadow-sm shadow-slate-200/50">
              <h2 className="mb-6 text-lg font-semibold text-swim-800">Your Priorities</h2>
              <div className="space-y-5">
                {/* Priority sliders */}
                {[
                  { key: "academicPriority" as const, label: "Academics" },
                  { key: "swimPriority" as const, label: "Swim Program Level" },
                  { key: "locationPriority" as const, label: "Location" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700">{label}</label>
                      <span className="rounded-full bg-swim-100 px-3 py-0.5 text-xs font-semibold text-swim-700">
                        {form[key]}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-slate-400">Low</span>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={form[key]}
                        onChange={(e) => update(key, Number(e.target.value))}
                        className="h-2 w-full max-w-md cursor-pointer appearance-none rounded-full bg-slate-200 accent-swim-600"
                        style={{ accentColor: "#1d4ed8" }}
                      />
                      <span className="text-xs text-slate-400">High</span>
                    </div>
                  </div>
                ))}

                {/* Scholarship needed */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-slate-700">
                    Do you need scholarship aid? <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-3">
                    {["Yes", "No", "Maybe"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => update("scholarshipNeeded", opt)}
                        className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                          form.scholarshipNeeded === opt
                            ? "bg-swim-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-swim-50 hover:text-swim-700"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {errors.scholarshipNeeded && <p className="mt-1 text-xs text-red-500">{errors.scholarshipNeeded}</p>}
                </div>

                {/* Team size range */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-slate-700">
                    Preferred Team Size
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <span className="mb-1 block text-xs text-slate-400">Min</span>
                      <input
                        type="number"
                        min="1"
                        max="200"
                        value={form.teamSizeMin}
                        onChange={(e) => update("teamSizeMin", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm transition-all focus:border-swim-500 focus:outline-none focus:ring-2 focus:ring-swim-500/20"
                      />
                    </div>
                    <span className="mt-5 text-slate-300">to</span>
                    <div className="flex-1">
                      <span className="mb-1 block text-xs text-slate-400">Max</span>
                      <input
                        type="number"
                        min="1"
                        max="200"
                        value={form.teamSizeMax}
                        onChange={(e) => update("teamSizeMax", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm transition-all focus:border-swim-500 focus:outline-none focus:ring-2 focus:ring-swim-500/20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ───── Submit ───── */}
            <div className="text-center">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-swim-600 px-10 py-4 text-lg font-semibold text-white shadow-xl shadow-swim-600/30 transition-all hover:bg-swim-500 hover:shadow-swim-500/40"
              >
                Find My Matches
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <p className="mt-4 text-sm text-slate-400">
                Free tier includes unlimited matching. No credit card needed.
              </p>
            </div>
          </div>
        </form>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-400">
        &copy; {new Date().getFullYear()} SwimFit. All rights reserved.
      </footer>
    </div>
  );
}