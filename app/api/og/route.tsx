/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { getCity, spendingPower, fmtMoney } from "@/lib/compare";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const a = getCity((searchParams.get("a") || "").toLowerCase());
  const b = getCity((searchParams.get("b") || "").toLowerCase());
  const salary = Number(searchParams.get("salary") || 100000);
  if (!a || !b || !Number.isFinite(salary)) {
    return new Response("Bad Request", { status: 400 });
  }
  const spend = spendingPower(salary, a.rpp, b.rpp);

  return new ImageResponse(
    (
      <div
        style={{
          height: "630px",
          width: "1200px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg,#0b0b0d,#111827)",
          color: "white",
          padding: "48px",
          fontSize: 40,
        }}
      >
        <div style={{ fontSize: 36, opacity: 0.8 }}>CityScout</div>
        <div style={{ fontSize: 64, fontWeight: 700, marginTop: 12 }}>
          {a.name}, {a.state} vs {b.name}, {b.state}
        </div>
        <div style={{ fontSize: 38, marginTop: 24 }}>
          {fmtMoney(salary)} ➝ feels like <b>{fmtMoney(spend.destEquivalent)}</b> in {b.name} ({(spend.deltaPct>0?"+":"") + spend.deltaPct.toFixed(1)}%)
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
