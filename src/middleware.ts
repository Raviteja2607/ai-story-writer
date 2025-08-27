import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const WINDOW_MS = 60_000; // 1 minute
const MAX = 20;           // 20 requests/min per IP
const hits = new Map<string, { count: number; ts: number }>();

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api/")) {
    const ip = req.ip ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const now = Date.now();
    const rec = hits.get(ip) ?? { count: 0, ts: now };
    const reset = now - rec.ts > WINDOW_MS;
    const nextRec = reset ? { count: 1, ts: now } : { count: rec.count + 1, ts: rec.ts };
    hits.set(ip, nextRec);
    if (!reset && nextRec.count > MAX) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/api/:path*"] };
