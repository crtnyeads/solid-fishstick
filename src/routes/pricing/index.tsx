import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pricing/")({
  component: PricingPage,
});

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with basic matching to explore your options.",
    features: [
      "Personalized college matching",
      "Browse 30+ college program profiles",
      "Basic match score rankings",
      "View college names & locations",
    ],
    cta: "Get Started Free",
    href: "/profile",
    highlighted: false,
    color: "slate",
  },
  {
    name: "Premium",
    price: "$39",
    period: "one-time",
    description: "Unlock full program details and direct coach contact info.",
    features: [
      "Everything in Free",
      "Full college profiles with descriptions",
      "Direct coach contact info & emails",
      "Unlimited college comparisons",
      "Scholarship insights & tuition details",
    ],
    cta: "Buy Premium",
    href: "https://buy.stripe.com/6oUdR9e0XfKj0qUdfB0x200",
    highlighted: true,
    color: "swim",
    popular: true,
  },
  {
    name: "Premium Pro",
    price: "$49",
    period: "one-time",
    description: "Everything serious recruits need for their college search.",
    features: [
      "Everything in Premium",
      "Direct messaging to coaches",
      "Recruiting timeline tracker",
      "Priority email support",
      "College visit checklist & tips",
    ],
    cta: "Buy Pro",
    href: "https://buy.stripe.com/14A4gz0a741BgpSdfB0x201",
    highlighted: false,
    color: "swim",
  },
];

function PricingPage() {
  return (
    <div className="min-h-dvh bg-slate-50">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-white/80 backdrop-blur-lg">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2">
            <svg className="h-8 w-8 text-swim-600" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="currentColor" />
              <path d="M8 20c2-3 5-5 8-5s6 2 8 5" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M10 23c2-2 4-3 6-3s4 1 6 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M16 10v5m0-5l-2 2m2-2l2 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xl font-bold text-swim-800">SwimFit</span>
          </a>
          <a href="/auth" className="text-sm font-medium text-slate-600 hover:text-swim-600">Sign In</a>
        </nav>
      </header>

      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-swim-100 px-4 py-1.5 text-sm font-medium text-swim-700">
              Pricing
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-swim-800 sm:text-5xl">
              Find your perfect plan
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Start with free matching. Upgrade when you're ready to connect with coaches.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-md ${
                  tier.popular
                    ? "border-swim-300 ring-2 ring-swim-500/20"
                    : "border-slate-200"
                }`}
              >
                {tier.popular && (
                  <div className="-top-3.5 absolute left-1/2 -translate-x-1/2 rounded-full bg-swim-600 px-4 py-1 text-xs font-semibold text-white shadow-sm">
                    Most Popular
                  </div>
                )}

                <h3 className="text-lg font-semibold text-swim-800">{tier.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-swim-800">{tier.price}</span>
                  <span className="text-sm text-slate-500">/{tier.period}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{tier.description}</p>

                <ul className="mt-8 flex-1 space-y-4">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <svg className="mt-0.5 h-5 w-5 shrink-0 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-slate-600">{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={tier.href}
                  className={`mt-8 block w-full rounded-full px-6 py-3 text-center text-sm font-semibold transition-all ${
                    tier.popular
                      ? "bg-swim-600 text-white shadow-lg shadow-swim-600/30 hover:bg-swim-500"
                      : tier.name === "Free"
                        ? "border-2 border-swim-200 text-swim-700 hover:bg-swim-50"
                        : "border-2 border-swim-300 text-swim-700 hover:bg-swim-50"
                  }`}
                >
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <h3 className="text-lg font-semibold text-swim-800">For Club Coaches & Teams</h3>
            <p className="mt-2 text-sm text-slate-600">
              Team accounts with bulk discount pricing. Give all your athletes access to premium features.
            </p>
            <a href="#" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-swim-600 hover:text-swim-500">
              Contact us for team pricing
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}