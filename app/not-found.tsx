import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-3 text-slate-600">
        We couldn’t find that. Try the{" "}
        <Link href="/" className="underline">home page</Link> or the{" "}
        <Link href="/wizard" className="underline">matcher</Link>.
      </p>
    </main>
  );
}
