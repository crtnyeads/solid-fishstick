import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-dvh">
      {/* ──────── Navigation ──────── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-white/80 backdrop-blur-lg">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2">
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

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-swim-600"
            >
              How It Works
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-swim-600"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-swim-600"
            >
              Testimonials
            </a>
            <a
              href="/auth"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-swim-600"
            >
              Sign In
            </a>
            <a
              href="/profile"
              className="rounded-full bg-swim-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-swim-600/20 transition-all hover:bg-swim-500"
            >
              Get Started
            </a>
          </div>

          {/* Mobile menu button */}
          <button className="flex items-center gap-2 md:hidden">
            <svg
              className="h-6 w-6 text-slate-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </nav>
      </header>

      {/* ──────── Hero Section ──────── */}
      <section className="relative overflow-hidden pt-24">
        <div className="gradient-swim absolute inset-0 opacity-5" />
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 md:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: Text */}
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-swim-100 px-4 py-1.5 text-sm font-medium text-swim-700">
                <span className="h-2 w-2 rounded-full bg-swim-500" />
                College recruiting made simple
              </div>

              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-swim-800 sm:text-5xl lg:text-6xl">
                Find your best-fit{" "}
                <span className="gradient-swim-text">college</span> as a
                competitive swimmer
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-slate-600">
                No more hours of manual research or relying on word-of-mouth.
                SwimFit matches you with NCAA, NAIA, and Ivy League programs
                that align with your academics, swim level, team culture, and
                personal priorities.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/profile"
                  className="inline-flex items-center gap-2 rounded-full bg-swim-600 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-swim-600/30 transition-all hover:bg-swim-500 hover:shadow-swim-500/40"
                >
                  Find Your Fit
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-swim-200 px-8 py-3.5 text-base font-semibold text-swim-700 transition-all hover:border-swim-300 hover:bg-swim-50"
                >
                  See How It Works
                </a>
              </div>

              <div className="mt-10 flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-teal-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Free matching</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-teal-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>3,000+ programs</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-teal-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Trusted by coaches</span>
                </div>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-swim-50 to-teal-50 shadow-2xl shadow-swim-200/50">
                <div className="flex flex-col items-center px-8 py-12 text-center">
                  {/* Abstract swim lanes visual */}
                  <svg
                    className="mb-6 h-48 w-full"
                    viewBox="0 0 400 200"
                    fill="none"
                  >
                    {/* Lanes */}
                    <rect
                      x="20"
                      y="20"
                      width="360"
                      height="160"
                      rx="12"
                      fill="url(#laneGrad)"
                    />
                    {/* Lane lines */}
                    {[55, 95, 135].map((y) => (
                      <line
                        key={y}
                        x1="20"
                        y1={y}
                        x2="380"
                        y2={y}
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="1"
                        strokeDasharray="8 4"
                      />
                    ))}
                    {/* Lane dividers */}
                    {[110, 200, 290].map((x) => (
                      <line
                        key={x}
                        x1={x}
                        y1="20"
                        x2={x}
                        y2="180"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="2"
                      />
                    ))}
                    {/* Swimmer */}
                    <g className="animate-pulse">
                      <circle cx="80" cy="75" r="6" fill="white" />
                      <ellipse
                        cx="80"
                        cy="82"
                        rx="8"
                        ry="4"
                        fill="white"
                        opacity="0.6"
                      />
                    </g>
                    {/* Second swimmer */}
                    <g className="animate-pulse" style={{ animationDelay: "1s" }}>
                      <circle cx="160" cy="115" r="6" fill="white" />
                      <ellipse
                        cx="160"
                        cy="122"
                        rx="8"
                        ry="4"
                        fill="white"
                        opacity="0.6"
                      />
                    </g>
                    {/* Goal/checkpoint */}
                    <circle cx="350" cy="97" r="20" fill="rgba(255,255,255,0.2)" />
                    <path
                      d="M342 97l5 5 10-10"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <defs>
                      <linearGradient id="laneGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#0d9488" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <p className="text-sm font-medium text-slate-500">
                    Matching athletes with their perfect college programs
                  </p>
                </div>
              </div>
              {/* Decorative blob */}
              <div className="-z-10 absolute -bottom-6 -right-6 h-72 w-72 rounded-full bg-swim-200/30 blur-3xl" />
              <div className="-z-10 absolute -top-6 -left-6 h-48 w-48 rounded-full bg-teal-200/30 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ──────── How It Works ──────── */}
      <section id="how-it-works" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-swim-100 px-4 py-1.5 text-sm font-medium text-swim-700">
              How It Works
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-swim-800 sm:text-4xl">
              From pool to podium — matching made simple
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Four simple steps to discover your best-fit college program.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="group relative rounded-2xl bg-white p-8 shadow-md shadow-slate-200/50 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-swim-100 text-2xl font-bold text-swim-600 transition-colors group-hover:bg-swim-600 group-hover:text-white">
                1
              </div>
              <h3 className="text-lg font-semibold text-swim-800">
                Tell us about you
              </h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                Share your academic interests, swim times, event specialities,
                and what you value in a team culture.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group relative rounded-2xl bg-white p-8 shadow-md shadow-slate-200/50 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-swim-100 text-2xl font-bold text-swim-600 transition-colors group-hover:bg-swim-600 group-hover:text-white">
                2
              </div>
              <h3 className="text-lg font-semibold text-swim-800">
                Get matched
              </h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                Our algorithm finds NCAA, NAIA, and Ivy League programs that
                align with your swim level, academics, and preferences.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group relative rounded-2xl bg-white p-8 shadow-md shadow-slate-200/50 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-swim-100 text-2xl font-bold text-swim-600 transition-colors group-hover:bg-swim-600 group-hover:text-white">
                3
              </div>
              <h3 className="text-lg font-semibold text-swim-800">
                Compare colleges
              </h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                Side-by-side comparisons of programs, scholarships, team
                culture, location, and academic fit.
              </p>
            </div>

            {/* Step 4 */}
            <div className="group relative rounded-2xl bg-white p-8 shadow-md shadow-slate-200/50 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-swim-100 text-2xl font-bold text-swim-600 transition-colors group-hover:bg-swim-600 group-hover:text-white">
                4
              </div>
              <h3 className="text-lg font-semibold text-swim-800">
                Connect
              </h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                Reach out to coaches, schedule visits, and take your
                recruiting journey to the next level.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────── Features ──────── */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-swim-100 px-4 py-1.5 text-sm font-medium text-swim-700">
              Features
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-swim-800 sm:text-4xl">
              Everything you need to find{" "}
              <span className="gradient-swim-text">your path</span>
            </h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature cards */}
            {[
              {
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                ),
                title: "Smart Matching",
                desc: "Our algorithm considers swim times, academics, location preferences, and team culture to find your best-fit programs.",
              },
              {
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                ),
                title: "Comprehensive Search",
                desc: "Browse 3,000+ NCAA, NAIA, and Ivy League programs with detailed profiles on coaching staff, facilities, and academics.",
              },
              {
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                    />
                  </svg>
                ),
                title: "Scholarship Insights",
                desc: "Understand scholarship potential at each program — athletic, academic, and combined aid estimates.",
              },
              {
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                ),
                title: "Team Culture Fit",
                desc: "Get insights into program culture, coaching philosophy, training intensity, and team dynamics from current athletes.",
              },
              {
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                    />
                  </svg>
                ),
                title: "Side-by-Side Compare",
                desc: "Compare up to 5 colleges at once — swim program stats, academics, costs, location, and more.",
              },
              {
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.5 0 014.5 0z"
                    />
                  </svg>
                ),
                title: "Coach Connections",
                desc: "Direct contact info for coaches, recruiting coordinators, and current team members — no gatekeeping.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-swim-100 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-swim-50 text-swim-600">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-swim-800">
                  {feature.title}
                </h3>
                <p className="mt-2 leading-relaxed text-slate-600">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── Stats / Social Proof ──────── */}
      <section className="gradient-swim py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <p className="text-4xl font-extrabold text-white sm:text-5xl">
                3,000+
              </p>
              <p className="mt-2 text-sm font-medium text-swim-200">
                College programs indexed
              </p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-extrabold text-white sm:text-5xl">
                NCAA
              </p>
              <p className="mt-2 text-sm font-medium text-swim-200">
                Division I, II &amp; III
              </p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-extrabold text-white sm:text-5xl">
                NAIA + Ivy
              </p>
              <p className="mt-2 text-sm font-medium text-swim-200">
                Full coverage across all levels
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────── Testimonials ──────── */}
      <section id="testimonials" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-swim-100 px-4 py-1.5 text-sm font-medium text-swim-700">
              Testimonials
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-swim-800 sm:text-4xl">
              Trusted by swimmers, parents, and coaches
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                initials: "MR",
                name: "Mia Rodriguez",
                role: "D1 Swimmer, Class of '25",
                text: "SwimFit saved me dozens of hours of research. I found my dream school — a perfect fit academically and in the pool. The matching was scary accurate.",
              },
              {
                initials: "JT",
                name: "James Thompson",
                role: "Club Coach, 15+ years",
                text: "I recommend SwimFit to all my senior athletes. It's the tool that's been missing from the recruiting process. Finally, a system that understands swimming.",
              },
              {
                initials: "LK",
                name: "Lisa Kim",
                role: "Parent of a Sophomore Swimmer",
                text: "The comparison tools helped us evaluate scholarship offers side by side. My daughter found a program that values both her academics and her swimming.",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white p-8 shadow-md shadow-slate-200/50"
              >
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-swim-100 text-sm font-bold text-swim-700">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-swim-800">{t.name}</p>
                    <p className="text-sm text-slate-500">{t.role}</p>
                  </div>
                </div>
                <p className="leading-relaxed text-slate-600">"{t.text}"</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-slate-400">
              Your story could be here next.{" "}
              <a href="#" className="font-medium text-swim-600 underline hover:text-swim-500">
                Share your experience
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ──────── CTA Section ──────── */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-swim-800 px-8 py-16 text-center shadow-2xl shadow-swim-800/30 sm:px-16">
            {/* Decorative elements */}
            <div className="-top-20 -right-20 absolute h-64 w-64 rounded-full bg-swim-600/30 blur-3xl" />
            <div className="-bottom-24 -left-24 absolute h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />

            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Ready to find your fit?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-swim-200">
                Join thousands of competitive swimmers who've found their
                perfect college match. Start your free matching profile today.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <a
                  href="/profile"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-swim-800 shadow-lg transition-all hover:bg-swim-50"
                >
                  Create Free Profile
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </a>
                <a
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-swim-400 px-8 py-3.5 text-base font-semibold text-white transition-all hover:border-white hover:bg-white/10"
                >
                  View Pricing
                </a>
              </div>
              <p className="mt-6 text-sm text-swim-300">
                Free tier includes unlimited matching. No credit card required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────── Footer ──────── */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="md:col-span-1">
              <a href="/" className="flex items-center gap-2">
                <svg
                  className="h-7 w-7 text-swim-600"
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
                <span className="text-lg font-bold text-swim-800">
                  SwimFit
                </span>
              </a>
              <p className="mt-4 text-sm leading-relaxed text-slate-500">
                Helping competitive swimmers find their best-fit college program
                — academically, athletically, and personally.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-800">
                For Swimmers
              </h4>
              <ul className="space-y-3">
                {["Create Profile", "Find Colleges", "Compare Programs", "Scholarships"].map(
                  (link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-slate-500 transition-colors hover:text-swim-600"
                      >
                        {link}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-800">
                Resources
              </h4>
              <ul className="space-y-3">
                {["Recruiting Guide", "NCAA Eligibility", "NAIA Info", "Blog"].map(
                  (link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-slate-500 transition-colors hover:text-swim-600"
                      >
                        {link}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-800">
                Company
              </h4>
              <ul className="space-y-3">
                {["About", "For Coaches", "Privacy", "Terms"].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 transition-colors hover:text-swim-600"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-slate-200 pt-8 text-center text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} SwimFit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}