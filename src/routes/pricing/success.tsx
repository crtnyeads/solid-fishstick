import { createFileRoute, useSearch } from "@tanstack/react-router";

export const Route = createFileRoute("/pricing/success")({
  component: SuccessPage,
});

function SuccessPage() {
  const search = useSearch({ from: Route.id }) as { session_id?: string };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-teal-100">
          <svg className="h-10 w-10 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-swim-800">
          Payment Successful!
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Welcome to SwimFit Premium! Your account has been upgraded and you now
          have access to all premium features.
        </p>

        {search.session_id && (
          <p className="mt-4 text-xs text-slate-400">
            Session: {search.session_id.slice(0, 8)}...
          </p>
        )}

        <div className="mt-10 flex flex-col gap-4">
          <a
            href="/matches"
            className="rounded-full bg-swim-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-swim-600/30 transition-all hover:bg-swim-500"
          >
            View My Matches
          </a>
          <a
            href="/profile"
            className="text-sm font-medium text-swim-600 underline hover:text-swim-500"
          >
            Go to My Profile
          </a>
        </div>
      </div>
    </div>
  );
}