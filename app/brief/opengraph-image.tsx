import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type SP = { a?: string; b?: string; salary?: string };

export default function OG({ searchParams }: { searchParams: SP }) {
  const brand = "#3A5BAF";
  const a = (searchParams.a ?? "").replace(/-/g, " ");
  const b = (searchParams.b ?? "").replace(/-/g, " ");
  const title = a && b ? `Relocation brief — ${capitalize(b)}` : "Relocation brief";
  const subtitle = a && b ? `From ${capitalize(a)} to ${capitalize(b)}` : SITE.tagline;

  return new ImageResponse(<OGCard brand={brand} title={title} subtitle={subtitle} />, size);
}

function capitalize(s: string) {
  return s.split(" ").filter(Boolean).map(w => w[0]?.toUpperCase() + w.slice(1)).join(" ");
}

function OGCard({ brand, title, subtitle }: { brand: string; title: string; subtitle: string }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", background: "white", alignItems: "center", justifyContent: "center", padding: 64 }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 24, border: "1px solid #e5e7eb", display: "flex", padding: 56, alignItems: "center", gap: 36 }}>
        <svg width="120" height="120" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="26" fill="none" stroke={brand} strokeWidth="6" />
          <line x1="32" y1="10" x2="32" y2="20" stroke={brand} strokeWidth="6" strokeLinecap="round" />
          <polygon points="32,26 42,36 32,46 22,36" fill={brand} />
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, fontWeight: 800, color: brand, letterSpacing: -1, lineHeight: 1.1, fontFamily: "Inter, Geist, ui-sans-serif, system-ui" }}>{SITE.name}</div>
          <div style={{ marginTop: 8, fontSize: 42, color: "#111827", fontWeight: 700 }}>{title}</div>
          <div style={{ marginTop: 6, fontSize: 28, color: "#374151", fontWeight: 500 }}>{subtitle}</div>
        </div>
      </div>
    </div>
  );
}
