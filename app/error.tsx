'use client';

export default function Error({
  error, reset
}: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-3 text-slate-600">{error.message}</p>
      <div className="mt-6 flex gap-2">
        <button className="btn" onClick={() => reset()}>Try again</button>
        <a className="btn-outline" href="/">Go home</a>
      </div>
    </main>
  );
}
