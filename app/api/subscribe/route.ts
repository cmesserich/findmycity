import { NextResponse } from "next/server";
import { existsSync } from "node:fs";
import { appendFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { email, payload } = await req.json().catch(() => ({} as any));

  const okEmail = typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!okEmail) return NextResponse.json({ ok: false, error: "invalid email" }, { status: 400 });

  try {
    const dir = path.join(process.cwd(), "tmp");
    if (!existsSync(dir)) await mkdir(dir);
    const file = path.join(dir, "subscribers.csv");

    const line = `"${new Date().toISOString()}","${email.replace(/"/g, '""')}","${JSON.stringify(payload ?? {}).replace(/"/g, '""')}"\n`;

    await appendFile(file, line).catch(async (err: any) => {
      if (err?.code === "ENOENT") {
        await writeFile(file, "timestamp,email,payload\n" + line);
      } else {
        throw err;
      }
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
