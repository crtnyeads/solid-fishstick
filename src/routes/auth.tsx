import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (tab === "signup") {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            name,
            graduation_year: graduationYear ? parseInt(graduationYear) : undefined,
            gender: gender || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Signup failed");
          return;
        }
        // Store token and redirect to profile
        localStorage.setItem("swimfit_token", data.token);
        navigate({ to: "/profile" });
      } else {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Login failed");
          return;
        }
        localStorage.setItem("swimfit_token", data.token);
        navigate({ to: "/profile" });
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <a href="/" className="inline-flex items-center gap-2">
            <svg
              className="h-8 w-8 text-swim-600"
              viewBox="0 0 32 32"
              fill="none"
            >
              <rect width="32" height="32" rx="8" fill="currentColor" />
              <path
                d="M8 20c2-3 5-5 8-5s6 2 8 5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M10 23c2-2 4-3 6-3s4 1 6 3"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M16 10v5m0-5l-2 2m2-2l2 2"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xl font-bold text-swim-800">SwimFit</span>
          </a>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {/* Tabs */}
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => { setTab("signin"); setError(""); }}
              className={`rounded-lg py-2 text-sm font-semibold transition-all ${
                tab === "signin"
                  ? "bg-white text-swim-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab("signup"); setError(""); }}
              className={`rounded-lg py-2 text-sm font-semibold transition-all ${
                tab === "signup"
                  ? "bg-white text-swim-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "signup" && (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jordan Smith"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-swim-500 focus:ring-2 focus:ring-swim-500/20"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Grad Year
                    </label>
                    <select
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-swim-500 focus:ring-2 focus:ring-swim-500/20"
                    >
                      <option value="">Select</option>
                      {[2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-swim-500 focus:ring-2 focus:ring-swim-500/20"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-swim-500 focus:ring-2 focus:ring-swim-500/20"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={tab === "signup" ? "At least 6 characters" : "Enter your password"}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-swim-500 focus:ring-2 focus:ring-swim-500/20"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-swim-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-swim-600/20 transition-all hover:bg-swim-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Please wait..." : tab === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            {tab === "signin" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => { setTab("signup"); setError(""); }}
                  className="font-medium text-swim-600 underline hover:text-swim-500"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => { setTab("signin"); setError(""); }}
                  className="font-medium text-swim-600 underline hover:text-swim-500"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}