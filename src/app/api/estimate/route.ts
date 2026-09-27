import { NextResponse } from "next/server";
import { scanSite, ScanFailed } from "@/lib/crawl";
import { checkUrl, FetchRefused } from "@/lib/safe-fetch";
import { advise, DEFAULT_LANGUAGES, DEFAULT_UPDATE_RATE } from "@/lib/estimate";

/**
 * Word count of a website and the plan that fits — the public side of the
 * estimator (files are counted in the browser and never sent here).
 *
 * Anyone can call this and each call reads up to 25 pages, so it is limited:
 * per visitor IP, per hour overall, and a couple of scans at a time. The
 * limits live in this process's memory — right for the single Railway
 * instance the site runs on; several instances would each count their own.
 */

const PER_IP_PER_HOUR = 10;
const TOTAL_PER_HOUR = 300;
const CONCURRENT = 2;
const HOUR = 60 * 60 * 1000;

const byIp = new Map<string, number[]>();
let total: number[] = [];
let running = 0;

function allow(ip: string): string | null {
  const now = Date.now();
  total = total.filter((t) => now - t < HOUR);
  const mine = (byIp.get(ip) ?? []).filter((t) => now - t < HOUR);
  if (mine.length >= PER_IP_PER_HOUR) return "You've run a lot of scans — try again within the hour.";
  if (total.length >= TOTAL_PER_HOUR || running >= CONCURRENT) {
    return "The estimator is busy — try again in a minute.";
  }
  mine.push(now);
  total.push(now);
  byIp.set(ip, mine);
  if (byIp.size > 5000) {
    for (const [k, v] of byIp) if (!v.some((t) => now - t < HOUR)) byIp.delete(k);
  }
  return null;
}

function clientIp(req: Request): string {
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export async function POST(req: Request) {
  let body: { url?: unknown; languages?: unknown; updateRate?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const raw = typeof body.url === "string" ? body.url.trim().slice(0, 2000) : "";
  if (!raw) return NextResponse.json({ error: "Enter the site address" }, { status: 400 });
  const languages = Math.max(1, Math.min(100, Math.floor(Number(body.languages)) || DEFAULT_LANGUAGES));
  const rate = Number(body.updateRate);
  const updateRate = Number.isFinite(rate) && rate > 0 ? Math.min(1, rate) : DEFAULT_UPDATE_RATE;

  let url: URL;
  try {
    url = checkUrl(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }

  const refusal = allow(clientIp(req));
  if (refusal) return NextResponse.json({ error: refusal }, { status: 429 });

  running++;
  try {
    const scan = await scanSite(url.toString());
    return NextResponse.json({
      source: "url",
      label: scan.host,
      pages: scan.pages,
      clientRendered: scan.clientRendered,
      truncated: scan.truncated,
      strings: scan.strings,
      words: scan.words,
      advice: advise(scan.words, languages, updateRate),
    });
  } catch (e) {
    if (e instanceof ScanFailed || e instanceof FetchRefused) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    console.error("estimate failed", e);
    return NextResponse.json({ error: "Couldn't read the site" }, { status: 502 });
  } finally {
    running--;
  }
}
