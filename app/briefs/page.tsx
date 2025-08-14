// app/briefs/page.tsx
import type { Metadata } from "next";
import BriefsClient from "@/components/BriefsClient";

export const metadata: Metadata = {
  title: "City Reports – CityScout",
  description: "Search cities and open a printable one-page report.",
};

export default function BriefsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
        City Reports
      </h1>
      <p className="lead">
        Pick a starting city and salary, then search for your destination to open a printable
        one-page report.
      </p>

      <BriefsClient />
    </main>
  );
}
